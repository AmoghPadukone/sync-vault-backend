import { Request, Response } from 'express';

export const sayHello = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello, Amogh 🚀' });
};
