import { DeviceModel } from "../device/device.model";
import { getDataFromFotovoltaici } from "../sourceFotovoltaici/sourceFotovoltaici.service";
import { getDataFromMultimetri } from "../sourceMultimetri/sourceMultimetri.service";

interface VarListOptions {
    categoria: string,
    model: string;
    auxNumber: string;
    description?: string;
    device: string;
    ipAddress: string;
}

async function findDeviceInfo(model: string) {
    const deviceInfo = await DeviceModel.findOne({ Modello: model });
    if (!deviceInfo) throw new Error(`Modello ${model} non trovato`);
    return deviceInfo;
}

export async function varListGenerator(options: VarListOptions) {
    const { model, auxNumber: auxQuantity, description, device: deviceId, ipAddress } = options;

    const deviceInfo = await findDeviceInfo(model);
    const baseParams = await getDataByModel(deviceInfo);

    if (!baseParams || baseParams.length === 0) {
        throw new Error(`Nessun parametro trovato per modello ${model}`);
    }

    const varlist: any[] = [];

    const auxCount = parseInt(auxQuantity, 10);
    if (isNaN(auxCount) || auxCount <= 0) {
        throw new Error(`Quantità aux non valida: ${auxQuantity}`);
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

export async function getDataByModel(deviceInfo) {
    // Trovo info modello
    switch (deviceInfo.Categoria) {
        case "Multimetro":
            return await getDataFromMultimetri(deviceInfo.Type);
        case "Fotovoltaico":
            return await getDataFromFotovoltaici(deviceInfo.Type);
        default:
            throw new Error("Collection non supportata per modello");
    }
}