import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('[ERROR]', err);
    const status = err.status || 500;
    res.status(status).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};
