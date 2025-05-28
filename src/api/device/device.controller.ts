import { NextFunction, Request, Response } from "express";
import { getDeviceByCategory, getDeviceByType } from "./device.service";
import { model } from "mongoose";

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
            res.status(404).json({ message: "Nessun modello trovato per il tipo richiesto" });
            return;
        }

        res.status(200).json(modelli)
    } catch (err) {
        next(err);
    }
};

export const getDeviceCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categoria = req.query.categoria as string;

        if (!categoria) {
            res.status(400).json({ error: "Parametro 'categoria' mancante "});
        }

        const modelli = await getDeviceByCategory(categoria);

        if (modelli.length === 0) {
            res.status(400).json({ error: "Nessun modello trovato per la categoria richiesta" });
        }

        res.status(200).json(modelli)
    } catch (err) {
        next(err);
    }
}