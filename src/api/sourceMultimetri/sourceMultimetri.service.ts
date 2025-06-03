import { SourceMultimetriModel } from "./sourceMultimetri.model";

export async function getDataByType(type: string) {
    return await SourceMultimetriModel.find({ Type: type });
}