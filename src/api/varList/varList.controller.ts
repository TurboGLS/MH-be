import { NextFunction, Request, Response } from "express";
import { generateVarListCSV } from "./varList.service";

export const downloadVarList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { type, quantity, device, ipAddress } = req.body;

        if (!type || !quantity || !device || !ipAddress) {
            res.status(400).json({ message: "Tutti i Parametri devono essere compilati" });
            return;
        }

        const csv = await generateVarListCSV(
            type.toString(), 
            parseInt(quantity.toString()),
            parseInt(device.toString()),
            ipAddress.toString()
        );

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=varlist.csv`);
        res.status(200).send(csv);
    } catch (err) {
        next(err);
    }
}