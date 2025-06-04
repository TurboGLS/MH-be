import { device } from "../utils/device.data";
import { getDataByType } from "../sourceMultimetri/sourceMultimetri.service";

interface VarListOptions {
    model: string;
    auxQuantity: number;
    description?: string;
    device: number;
    ipAddress: string;
}

export async function varListGenerator(options: VarListOptions) {
    const { model, auxQuantity, device: deviceId, ipAddress, description } = options;

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

    for (let i = 1; i <= auxQuantity; i++) {
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

            // sostituisco la descrizione se presente
            if (description) {
                replacedParam.Description = description;
            }

            // Rimuovo campi indesiderati
            const { DeviceType: Type, _id, __v, AddressModBus, AddressDeviceId, AddressIp, ...cleaned } = replacedParam;

            varlist.push(cleaned);
        }
    }

    return varlist;
}