import { NextFunction, Request, Response } from "express"
import { TypedRequest } from "../../lib/typed-request.interface"
import { AddUserDTO } from "./user.dto"
import { omit, pick } from "lodash"
import userSrv, { UserExistsError } from "../user/user.service"
import "../../lib/auth/local/local-strategy";
import passport from "passport"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../../lib/auth/jwt/jwt-strategy"
import { User } from "../user/user.entity"

export const add = async (
    req: TypedRequest<AddUserDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const userData = omit(req.body, 'username', 'password') as User;
        const credentialsData = pick(req.body, 'username', 'password');
        const newUser = await userSrv.add(userData, credentialsData);
        res.json(newUser);
    } catch (err) {
        if (err instanceof UserExistsError) {
            res.status(400).json({ error: err.name, message: err.message });
        }
        next(err);
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    passport.authenticate('local', { session: false },
        async (err, user, info) => {
            try {
                if (err) {
                    next(err);
                    return;
                }

                if (!user) {
                    res.status(401).json({ error: 'LoginError', message: info?.message || 'Invalid credentials' });
                    return;
                }
                const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7 days' });
                res.status(200).json({ user, token });
            } catch (err) {
                next(err);
            }
        }
    ) (req, res, next);
}