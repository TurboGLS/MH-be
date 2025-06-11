import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../../lib/typed-request.interface";
import { AddUserDTO } from "./auth.dto";
import userSrv, { EmailExistsError, MissingCredentialsError, UserExistsError } from "../user/user.service";
import tokenSrv from '../../lib/auth/token.service';
import { omit, pick } from "lodash";
import passport from "passport";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../../lib/auth/jwt/jwt-strategy";
import { User } from "../user/user.entity";
import dotenv from 'dotenv';
import { sendVerificationEmail } from "../verification/verification.service";

dotenv.config();

export const register = async (
    req: TypedRequest<AddUserDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const userData = omit(req.body, 'username', 'password') as User;
        const credentialsData = pick(req.body, 'username', 'password');

        const newUser = await userSrv.add(userData, credentialsData);

        // Invio Email
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${newUser.verificationToken}`;
        await sendVerificationEmail(newUser.email, verifyUrl);

        res.status(200).json({ message: 'Registrazione completata. Controlla la tua email per attivare l’account.' });
    } catch (err) {
        if (err instanceof UserExistsError || err instanceof EmailExistsError || err instanceof MissingCredentialsError) {
            res.status(400).json({ error: err.name, message: err.message });
        }
        else {
            next(err);
        }
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    passport.authenticate('local', { session: false },
        async (loginErr, user, info) => {
            try {
                if(loginErr) {
                    next(loginErr);
                    return;
                }

                if (!user) {
                    res.status(401);
                    res.json({
                        error: 'LoginError',
                        message: info.message
                    });
                    return;
                }
                
                const { token, refreshToken } = await tokenSrv.generateTokenPair(user.id);

                res.status(200);
                res.json({
                    user,
                    token,
                    refreshToken
                });
            } catch(err) {
                next(err);
            }
        }
    )(req, res, next);
}

export const refresh = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
    try {
        const { refreshToken } = req.body;

        let payload: User;
        try {
            payload = jwt.verify(refreshToken, JWT_SECRET) as User;
        } catch(verifyErr) {
            res.status(401);
            res.json({
                error: 'RefreshTokenError',
                message: 'Invalid token'
            });
            return;
        }

        const match = await tokenSrv.verifyMatch(payload.id!, refreshToken);
        if (!match) {
            console.log('unset');
            tokenSrv.removeToken(payload.id!);

            res.status(401);
            res.json({            
                error: 'RefreshTokenError',
                message: 'Invalid token'
            });
            return
        }

        const newTokens = await tokenSrv.generateTokenPair(payload.id!, refreshToken);

        res.status(200);
        res.json(newTokens);
    }catch(err) {
        next(err);
    }
}