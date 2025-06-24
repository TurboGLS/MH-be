import { NextFunction, Request, Response } from "express";
import { getCategory, getCollectionByCategoria, getDeviceByCategory, getDeviceByType } from "./device.service";

export const getDeviceModel = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tipo = req.query.tipo as string;

        if (!tipo) {
            res.status(400).json({ error: "Parametro 'tipo' mancante" });
            return;
        }

        const modelli = await getDeviceByType(tipo);

        if (modelli.length === 0) {
            res.status(404).json({ error: "Nessun modello trovato per il tipo richiesto" });
            return;
        }

        res.status(200).json(modelli)
    } catch (err) {
        next(err);
    }
};

export const getDeviceInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categoria = req.query.categoria as string;

        if (!categoria) {
            res.status(400).json({ error: "Parametro 'categoria' mancante " });
            return;
        }

        const modelli = await getDeviceByCategory(categoria);

        if (modelli.length === 0) {
            res.status(404).json({ error: "Nessun modello trovato per la categoria richiesta" });
            return;
        }

        res.status(200).json(modelli)
    } catch (err) {
        next(err);
    }
}

export const getCategorie = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await getCategory();

        res.status(200).json(categories);
    } catch (err) {
        next(err);
    }
}

export const getCollectionDynamic = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { categoria } = req.params;

        if (!categoria) {
            res.status(400).json({ error: 'Parametro "categoria" mancante.' });
            return;
        }

        const devices = await getCollectionByCategoria(categoria);

        if (!devices || devices.length === 0) {
            res.status(404).json({ error: 'Nessun device trovato per la categoria richiesta' });
            return;
        }

        res.status(200).json(devices);
    } catch (err) {
        // Se l'errore è dovuto a categoria non supportata
        if (err instanceof Error && err.message.startsWith('Categoria')) {
            res.status(400).json({ error: err.message });
            return;
        }

        next(err);
    }
}