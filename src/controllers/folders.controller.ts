import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { foldersService, } from 'src/services/folders.service';
import { CreateFolderSchema } from 'src/types/dto/folders.dto';



export const createFolder = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, 'Unauthorized');

  const parsed = CreateFolderSchema.safeParse({ ...req.body, ...req.query });
  if (!parsed.success) {
    throw createHttpError(400, 'Invalid input', { errors: parsed.error.flatten() });
  }

  const result = await foldersService.createFolder({
    userId,
    ...parsed.data,
  });

  res.status(201).json(result);
};


export const getFolder = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, 'Unauthorized');

  const path = req.query.path as string;
  if (!path) throw createHttpError(400, 'Missing folder path');

  const result = await foldersService.getFolder({ userId, path });
  res.status(200).json(result);
};

export const deleteFolder = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, 'Unauthorized');

  const path = req.query.path as string;
  const recursive = req.query.recursive === 'true';
  if (!path) throw createHttpError(400, 'Missing folder path');

  const result = await foldersService.deleteFolder({ userId, path, recursive });
  res.status(200).json(result);
};


export const listEnrichedFolderContents = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, 'Unauthorized');

  const path = req.query.path as string;
  if (!path) throw createHttpError(400, 'Missing path');

  const result = await foldersService.listEnrichedFolderContents(userId, path);
  res.status(200).json(result);
};