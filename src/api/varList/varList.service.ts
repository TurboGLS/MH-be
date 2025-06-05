import { device } from "../utils/device.data";
import { getDataByType } from "../sourceMultimetri/sourceMultimetri.service";

interface VarListOptions {
    model: string;
    auxNumber: string;
    description?: string;
    device: string;
    ipAddress: string;
}

export async function varListGenerator(options: VarListOptions) {
    const { model, auxNumber: auxQuantity, description, device: deviceId, ipAddress } = options;

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

    for (const param of baseParams) {
        const replacedParam = param.toJSON({ virtuals: true });

        // sostituisco i placeholder con il numero totale di AUX e gli altri parametri
        for (const key in replacedParam) {
            if (typeof replacedParam[key] === 'string') {
                replacedParam[key] = replacedParam[key]
                    .replace(/§/g, auxCount.toString())
                    .replace(/@/g, deviceId.toString())
                    .replace(/ç/g, ipAddress);
            }
        }

        if (description && typeof replacedParam.Description === 'string') {
            replacedParam.Description = replacedParam.Description.replace(/d3scription/g, description);
        }

        const { DeviceType: Type, _id, __v, AddressModBus, AddressDeviceId, AddressIp, ...cleaned } = replacedParam;

        varlist.push(cleaned);
    }

    return varlist;
}