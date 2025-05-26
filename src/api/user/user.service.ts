import { UserIdentityModel } from "../../lib/auth/local/user-identity.model";
import { User } from "./user.entity";
import { UserModel } from "./user.model";
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

export class UserExistsError extends Error {
    constructor() {
        super();
        this.name = 'UserExists';
        this.message = 'username already in use';
    }
}

export class UserService {
    async add(user: Omit<User, 'role'>, credentials: { username: string, password: string }): Promise<User> {
        const existingIdentity = await UserIdentityModel.findOne({'credentials.username': credentials.username});
        if (existingIdentity) {
            throw new UserExistsError();
        }

        let role: 'admin' | 'user';
        const domain = process.env.DOMINIO || '';

        if (domain !== '' && user.email.endsWith(domain)) {
            role = 'admin';
        } else {
            role = 'user';
        }

        const completeUser: User = {
            ...user,
            role
        };

        const newUser = await UserModel.create(completeUser);

        const hashedPassword = await bcrypt.hash(credentials.password, 10);

        await UserIdentityModel.create({
            provider: 'local',
            user: newUser.id,
            credentials: {
                username: credentials.username,
                hashedPassword
            }
        });
        return newUser;
    }
}

export default new UserService();