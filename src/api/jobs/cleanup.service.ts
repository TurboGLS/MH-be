import { UserModel } from "../user/user.model";
import { UserIdentityModel } from "../../lib/auth/local/user-identity.model";

export async function cleanupUnverifiedUsers(): Promise<number> {
    const now = new Date(); // data attuale
    const batchSize = 500; // limito l'eliminazione a 500 utente alla volta
    let totalDeleted = 0;

    console.log('Starting cleanup job...');
    console.log('Memory usage before cleanup', process.memoryUsage());

    while (true) {
        // find sulla collection di User dove active è false è il token di verifica è minore (quindi scaduto) della data attuale
        const usersToDelete = await UserModel.find({
            active: false,
            verificationTokenExpires: { $lt: now }
        }).limit(batchSize).lean();

        // se non trovo utenti fantasma passo un consol.log e chiudo la funzione
        if (usersToDelete.length === 0) {
            console.log('Nessun utente non verificato da eliminare.');
            break;
        }

        // console.log per identificare tutti gli id degli utenti da eliminare
        usersToDelete.forEach(user => {
            console.log(`Scheduled deletion for unverified user ${user._id}`);
        });

        // uso una promise per eliminare l'utente sia dalla collection UserModel e UserIdentityModel
        // che ha lo stesso id, in UserModel _id, mentre in UserIdentityModel user
        const deletePromises = usersToDelete.map(user =>
            Promise.all([
                UserModel.deleteOne({ _id: user._id }),
                UserIdentityModel.deleteOne({ user: user._id })
            ])
        );

        // aspetto che tutti gli utenti di tutte le collection vengano eliminati
        await Promise.all(deletePromises);

        // conteggio degli utenti eliminati
        totalDeleted += usersToDelete.length;

        // console.log con il numero degli utenti eliminato da vedere nei log di koyeb per verifica
        console.log(`Deleted ${usersToDelete.length} unverified users.`);
    }

    // log finali
    console.log(`Pulizia completata. Utenti totali eliminati: ${totalDeleted}`);
    // log per l'uso della memoria
    console.log('Memory usage after cleanup:', process.memoryUsage());

    // return con il numero totale degli utenti eliminati stampati poi nel log
    return totalDeleted;
}