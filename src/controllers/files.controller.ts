import { Request, Response } from 'express';

export const filesController = {
  example: async (req: Request, res: Response) => {
    res.json({ message: 'Hello from FilesController' });
  },
};

