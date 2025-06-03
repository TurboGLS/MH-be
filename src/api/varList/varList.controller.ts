import { NextFunction, Request, Response } from "express";
import { device } from "../utils/device.data";
import { DeviceModel } from "../device/device.model";
import { sourceMultimetri } from "../utils/sourceMultimetri.data";
import { Parser } from "json2csv";
import { varListGenerator } from "./varList.service";

export const downloadVarList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const request = req.body;

        if (!Array.isArray(request) || request.length === 0) {
            res.status(400).json({ message: "Dati errati o mancanti" });
            return;
        }

        let combinedVarlist: any[] = [];

        for (const item of request) {
            const { model, auxQuantity, description, device, ipAddress } = item;
            
            if (!model || !auxQuantity || !description || !device || !ipAddress) {
                res.status(400).json({ message: "Parametri obbligatori mancanti" });
                return;
            }

            const varlistPart = await varListGenerator({
                model,
                auxQuantity,
                description,
                device,
                ipAddress
            });

            combinedVarlist.push(...varlistPart);
        }

        const parser = new Parser({ quote: "" });
        const csv = parser.parse(combinedVarlist);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=var_lst.csv");
        res.status(200).send(csv);
    } catch (err) {
        next(err);
    }
}