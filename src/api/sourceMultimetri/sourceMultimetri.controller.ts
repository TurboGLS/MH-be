import { NextFunction, Request, Response } from "express";
import { getDataByType } from "./sourceMultimetri.service";

export const getData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const typeParam = req.query.type ;

        if (typeof typeParam !== 'string') {
            res.status(400).json({ error: "Paramentro 'type' mancante o non valido" });
            return;
        }

        const results = await getDataByType(typeParam);

        if (results.length === 0) {
            res.status(404).json({ message: "Nessun multimetro trovato per il tipo richiest"});
            return;
        }

        res.status(200).json(results);
    } catch (err) {
        next(err);
    }
}