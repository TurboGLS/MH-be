import { NextFunction, Request, Response } from "express";
import { verifyEmailToken } from "./verification.service";
import dotenv from 'dotenv';

dotenv.config();

export const verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token } = req.query;

        const user = await verifyEmailToken(token as string);
        if (!user) {
            res.status(400).json({ message: 'Token non valido o scaduto' });
            return;
        }

        res.redirect(`${process.env.FRONTEND_URL}/verify-success`);
    } catch (err) {
        next(err);
    }
};
