import { JWT_SECRET } from "./jwt/jwt-strategy";
import { UserIdentityModel } from "./local/user-identity.model";
import jwt from 'jsonwebtoken';
import userSrv from '../../api/user/user.service';

export class TokenSerice {

    async generateTokenPair(userId: string, oldToken?: string): Promise<{ token: string, refreshToken: string }> {
        const user = await userSrv.getById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '15 minutes' });
        const refreshToken = jwt.sign(user, JWT_SECRET, { expiresIn: '3 hours' });
        await this.assignTokenToUser(user.id!, refreshToken, oldToken);
        return {
            token,
            refreshToken
        };
    }

    async verifyMatch(userId: string, token: string): Promise<boolean> {
        return !!(await UserIdentityModel.exists({ user: userId, refreshToken: token }));
    }

    async assignTokenToUser(userId: string, token: string, oldToken?: string): Promise<void> {
        let updated;
        if (!oldToken) {
            // Se non c’è oldToken, metto il refreshToken in un array nuovo (non faccio push)
            updated = await UserIdentityModel.findOneAndUpdate(
                { user: userId },
                { $set: { refreshToken: [token] } }  // resetto l’array a un solo token
            );
        } else {
            // Sostituisco il token vecchio con quello nuovo
            updated = await UserIdentityModel.findOneAndUpdate(
                { user: userId, refreshToken: oldToken },
                { $set: { 'refreshToken.$': token } }
            );
        }
        if (!updated) {
            throw new Error('User not found');
        }
    }

    async removeToken(userId: string) {
        await UserIdentityModel.findOneAndUpdate({ user: userId }, { $unset: { refreshToken: 1 } });
    }
}

export default new TokenSerice();