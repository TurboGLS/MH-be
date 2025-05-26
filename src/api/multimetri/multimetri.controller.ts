import { NextFunction, Request, Response } from "express";
import { getModelByType } from "./multimetri.service";

export const getMultimetriModel = async (
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

        const modelli = await getModelByType(tipo);

        if (modelli.length === 0) {
            res.status(404).json({ message: "Nessun modello trovato per il tipo richiesto" });
            return;
        }

        res.status(200).json({ tipo, modelli })
    } catch (err) {
        next(err);
    }
};