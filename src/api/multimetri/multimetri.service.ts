import { MultimetriModel } from "./multimetri.model";

export async function getModelByType(tipo: string): Promise<string[]> {
    const result = await MultimetriModel.find({ Type: tipo }).lean();
    return result.map(doc => doc.Modello);
}