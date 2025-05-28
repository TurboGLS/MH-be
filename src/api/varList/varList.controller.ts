import { NextFunction, Request, Response } from "express";
import { generateVarListCSV } from "./varList.service";

export const downloadVarList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { type, quantity } = req.query;

        if (!type || !quantity) {
            res.status(400).json({ message: "Parametri 'type' e 'quantity' obbligatori" });
            return;
        }

        const csv = await generateVarListCSV(type.toString(), parseInt(quantity.toString()));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=varlist_type${type}_q${quantity}.csv`);
        res.status(200).send(csv);
    } catch (err) {
        next(err);
    }
}