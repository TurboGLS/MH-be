import { SourceModel } from "./source.model";

export async function getDataByType(type: number) {
    return await SourceModel.find({ type });
}