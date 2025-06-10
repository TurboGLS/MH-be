import { SourceFotovoltaiciModel } from "./sourceFotovoltaici.model";

export async function getDataFromSensori(type: string) {
    return await SourceFotovoltaiciModel.find({ DeviceType: type });
}