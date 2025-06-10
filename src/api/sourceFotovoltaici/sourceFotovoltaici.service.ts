import { SourceFotovoltaiciModel } from "./sourceFotovoltaici.model";

export async function getDataFromFotovoltaici(type: string) {
    return await SourceFotovoltaiciModel.find({ DeviceType: type });
}