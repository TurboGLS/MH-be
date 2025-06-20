import { NextFunction, Request, Response } from "express";
import { cleanupUnverifiedUsers } from "./cleanup.service";

export const runCleanup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Protezione tramite header segreto
        const jobSecret = req.headers['x-job-secret'];

        // Se il secret non corrisponde, blocca l'accesso
        if (jobSecret !== process.env.CLEANUP_SECRET) {
            res.status(403).json({ error: 'Accesso non autorizzato.' });
            return;
        }

        // Se il secret è corretto, esegue la pulizia
        const deletedCount = await cleanupUnverifiedUsers();

        res.status(200).json({ message: `Pulizia completata. Utenti eliminati: ${deletedCount}` });
    } catch (err) {
        console.log('Errore durante la pulizia utenti via API.');
        next(err);
        res.status(500).json({ error: 'Errore durante la pulizia utenti.' });
    }
}