import mongoose, { Collection, Schema, Model, mongo } from "mongoose";
import { DeviceModel } from "./device.model";
import { device } from "../utils/device.data";

export async function getDeviceByType(tipo: string): Promise<string[]> {
    return await DeviceModel.find({ Type: tipo });
}

export async function getDeviceByCategory(categoria: string): Promise<string[]> {
    const devices = await DeviceModel.find({ Categoria: categoria }, { Modello: 1, _id: 0 });
    return devices.map(device => device.Modello);
}

export async function getCategory(): Promise<string[]> {
    return await DeviceModel.distinct('Categoria');
}

const dynamicModels: Record<string, Model<any>> = {};

export async function getCollectionByCategoria(category: string): Promise<any[]> {
    const categoryToCollectionName: Record<string, string> = {
        Multimetri: 'sourcemultimetris',
        Fotovoltaici: 'sourcefotovoltaicis',
        // da aggiungere altre categorie in futuro
    };

    // Schema generico per collections dinamiche (non valido per `DeviceModel`)
    const genericSchema = new Schema({}, {strict: false});

    // Funzione principale per ottenere dati in base alla categoria
    const collectionName = categoryToCollectionName[category];

    if (!collectionName) {
        throw new Error(`Categoria "${category}" non supportata`);
    }

    if (!dynamicModels[collectionName]) {
        dynamicModels[collectionName] = mongoose.model(collectionName, genericSchema, collectionName);
    }

    return dynamicModels[collectionName].find({}).exec();
}