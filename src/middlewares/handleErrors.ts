// src/middlewares/handleErrors.ts
import { NextFunction, Request, Response } from 'express';

export function handleErrors(err: any, req: Request, res: Response, next: NextFunction) {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';

    res.status(status).json({
        error: message,
        ...(err.errors && { details: err.errors }),
    });
}