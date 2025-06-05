import { device } from "../utils/device.data";
import { getDataByType } from "../sourceMultimetri/sourceMultimetri.service";

interface VarListOptions {
    model: string;
    auxQuantity: string;
    description?: string;
    device: string;
    ipAddress: string;
}

export async function varListGenerator(options: VarListOptions) {
    const { model, auxQuantity, description, device: deviceId, ipAddress } = options;

    // Trovo il device in base al modello selezionato
    const deviceInfo = device.find(d => d.Modello === model);
    if (!deviceInfo) {
        throw new Error(`Modello ${model} non trovato`);
    }

    const type = deviceInfo.Type;

    // Filtro i parametri per type
    const baseParams = await getDataByType(type);
    if (!baseParams || baseParams.length === 0) {
        throw new Error(`Nessun parametro trovato per type ${type}`);
    }

    const varlist: any[] = [];

    const auxCount = parseInt(auxQuantity, 10);
    if (isNaN(auxCount) || auxCount <= 0) {
        throw new Error(`Quantità ausiliari non valida: ${auxQuantity}`);
    }

    for (let i = 1; i <= auxCount; i++) {
        for (const param of baseParams) {
            // Ottengo l'oggetto con virtuals inclusi
            const replacedParam = param.toJSON({ virtuals: true });

            // sostituisco i placeholder
            for (const key in replacedParam) {
                if (typeof replacedParam[key] === 'string') {
                    replacedParam[key] = replacedParam[key]
                        .replace(/§/g, i.toString())
                        .replace(/@/g, deviceId.toString())
                        .replace(/ç/g, ipAddress);
                }
            }

            // Sostituisco solo il placeholder 'd3scription' nella Description (se presente)
            if (description && typeof replacedParam.Description === 'string') {
                replacedParam.Description = replacedParam.Description.replace(/d3scription/g, description);
            }

            // Rimuovo campi indesiderati
            const { DeviceType: Type, _id, __v, AddressModBus, AddressDeviceId, AddressIp, ...cleaned } = replacedParam;

            varlist.push(cleaned);
        }
    }

    return varlist;
}