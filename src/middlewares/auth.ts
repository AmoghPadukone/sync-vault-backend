import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new Error('Missing token: Not Authenticated'));
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
        req.user = {
            id: payload.id,
            email: payload.email,
        };
        next();
    } catch (err) {
        return next(new Error('Invalid token'));
    }
};
