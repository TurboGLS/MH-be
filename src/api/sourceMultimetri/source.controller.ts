import { NextFunction, Request, Response } from "express";
import { pingService } from "./source.service";

export const pingController = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
        try {
            const result = await pingService();

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };