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

        for (const user of usersToDelete) {
            await UserModel.deleteOne({ _id: user._id });
            await UserIdentityModel.deleteOne({ userId: user._id });
            console.log(`Deleted unverified user ${user._id}`);
        }

    } catch (error) {
        console.error('Errore durante la pulizia utenti non verificati:', error);
    }
}

// Pianifica il job: ogni giorno a mezzanotte
cron.schedule('0 0 * * *', () => {
    console.log('Eseguo il job di pulizia utenti non verificati...');
    cleanupUnverifiedUsers();
});
