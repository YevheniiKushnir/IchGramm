import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { NextFunction, Response, Request } from "express";
import { TokenPayload } from "../types/express";
import { env } from '../config/env';

const ifAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies?.token;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: Token missing' });
        return; // Just return after sending the response
    }

    if (env.JWT_SECRET) {
        jwt.verify(token, env.JWT_SECRET, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
            if (err) {
                res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
                return; // Just return after sending the response
            }

            if (decoded && typeof decoded !== 'string') {
                req.user = decoded as TokenPayload;
                return next();
            } else {
                res.status(400).json({ message: 'Token is malformed or invalid' });
                return; // Just return after sending the response
            }
        });
    } else {
        res.status(500).json({ message: 'Server configuration error: JWT key not defined' });
        return; // Just return after sending the response
    }
};

export default ifAuthenticated;