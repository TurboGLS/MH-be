import { SourceModel } from "./source.model";

export async function getDataByType(type: string) {
    return await SourceModel.find({ type });
}