import cron from 'node-cron';
import { UserModel } from '../api/user/user.model';
import { UserIdentityModel } from '../lib/auth/local/user-identity.model';

// Funzione di pulizia utenti non verificati con token scaduto
async function cleanupUnverifiedUsers() {
    try {
        const now = new Date();

        // Trova tutti gli utenti non attivi con token scaduto
        const usersToDelete = await UserModel.find({
            active: false,
            verificationTokenExpires: { $lt: now }
        });

        if (usersToDelete.length === 0) {
            console.log('Nessun utente non verificato da eliminare.');
            return;
        }

        // Stampa gli ID degli utenti che verranno eliminati
        usersToDelete.forEach(user => {
            console.log(`Scheduled deletion for unverified user ${user._id}`);
        });

        // Elimina in parallelo gli utenti e le relative identità
        const deletePromises = usersToDelete.map(user =>
            Promise.all([
                UserModel.deleteOne({ _id: user._id }),
                UserIdentityModel.deleteOne({ userId: user._id })
            ])
        );

        await Promise.all(deletePromises);

        console.log(`Deleted ${usersToDelete.length} unverified users.`);

    } catch (error) {
        console.error('Errore durante la pulizia utenti non verificati:', error);
    }
}

// Pianifica il job: ogni giorno a mezzanotte, solo in produzione
if (process.env.NODE_ENV === 'production') {
    cron.schedule('0 0 * * *', () => {
        console.log('Eseguo il job di pulizia utenti non verificati...');
        cleanupUnverifiedUsers();
    });
}
