import { UserModel } from "../user/user.model";
import { UserIdentityModel } from "../../lib/auth/local/user-identity.model";

export async function cleanupUnverifiedUsers(): Promise<number> {
    const now = new Date();

    const usersToDelete = await UserModel.find({
        active: false,
        verificationTokenExpires: { $lt: now }
    });

    if (usersToDelete.length === 0) {
        console.log('Nessun utente non verificato da eliminare.');
        return 0;
    }

    usersToDelete.forEach(user => {
        console.log(`Scheduled deletion for unverified user ${user._id}`);
    });

    const deletePromises = usersToDelete.map(user =>
        Promise.all([
            UserModel.deleteOne({ _id: user._id }),
            UserIdentityModel.deleteOne({ userId: user._id })
        ])
    );

    await Promise.all(deletePromises);

    console.log(`Deleted ${usersToDelete.length} unverified users.`);
    return usersToDelete.length;
}