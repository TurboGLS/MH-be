import { SourceMultimetriModel } from "./sourceMultimetri.model";

export async function getDataFromMultimetri(type: string) {
    return await SourceMultimetriModel.find({ DeviceType: type });
}