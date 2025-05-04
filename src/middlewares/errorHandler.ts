import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = err.status || 500;

    console.error('[ERROR]', {
        message: err.message,
        stack: err.stack,
        ...(err.errors && { details: err.errors }),
    });

    res.status(status).json({
        error: err.message || 'Internal Server Error',
        ...(err.errors && { details: err.errors }), // ✅ supports Zod
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};