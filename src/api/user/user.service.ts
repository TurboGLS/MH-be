import { UserIdentityModel } from "../../lib/auth/local/user-identity.model";
import { User } from "./user.entity";
import { UserModel } from "./user.model";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_EMAIL_SECRET = process.env.JWT_EMAIL_SECRET || 'my_email_verification_secret';

export class UserExistsError extends Error {
    constructor() {
        super();
        this.name = 'UserExists';
        this.message = 'username already in use';
    }
}

export class EmailExistsError extends Error {
    constructor() {
        super();
        this.name = 'EmailExists';
        this.message = 'email already in use';
    }
}

export class MissingCredentialsError extends Error {
    constructor() {
        super();
        this.name = 'MissingCredentialsError';
        this.message = 'Username e Password sono obbliatori';
    }
}

export class UserService {
    async add(user: Omit<User, 'role'>, credentials: { username: string, password: string }): Promise<User> {
        if (!credentials.username || !credentials.password) {
            throw new MissingCredentialsError();
        }

        const existingIdentity = await UserIdentityModel.findOne({ 'credentials.username': credentials.username });
        if (existingIdentity) {
            throw new UserExistsError();
        }

        const existingEmail = await UserModel.findOne({ email: user.email });
        if (existingEmail) {
            throw new EmailExistsError();
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

        // Genero il token di verifica email
        const verificationToken = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_EMAIL_SECRET, { expiresIn: '1d' });

        // salva la scadenza: 24 ore da ora
        newUser.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Salvo il token nella proprietà dell'utente (aggiungi 'verificationToken' nel modello User se non c'è)
        newUser.verificationToken = verificationToken;
        await newUser.save();

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

    async getById(userId: string): Promise<User | null> {
        const user = await UserModel.findById(userId);
        return user ? user.toObject() : null;
    }
}

export default new UserService();