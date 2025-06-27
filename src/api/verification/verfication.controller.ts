import { NextFunction, Request, Response } from "express";
import { verifyEmailToken } from "./verification.service";

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

        // forse qui bisogna fare il solito res.status(200).json({ message: 'Token autorizzato' }); 
        // al posto di avere il redirect direttamente nel backend così da avere una visualizzazione più pulita su postman e poi magari gestirlo meglio nel frontend
        // anche quello nel frontend
        // res.redirect(`${process.env.FRONTEND_URL}/verify-success`);
        // non funziona res.redirect(`${process.env.FRONTEND_URL}verify-email?token=${token}`);
        res.status(200).json({ message: 'Email verificata con successo' });
    } catch (err) {
        next(err);
    }
};
