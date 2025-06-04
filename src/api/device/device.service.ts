import { DeviceModel } from "./device.model";

export async function getDeviceByType(tipo: string): Promise<string[]> {
    return await DeviceModel.find({ Type: tipo });
}

export async function getDeviceByCategory(categoria: string): Promise<string[]> {
    return await DeviceModel.find({ Categoria: categoria });
}

export async function getCategory(): Promise<string[]> {
    return await DeviceModel.distinct('Categoria');
}