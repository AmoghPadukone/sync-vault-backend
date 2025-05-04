import { Request, Response } from 'express';
import fs from 'fs/promises';
import createHttpError from 'http-errors'; // or make your own
import path from 'path';
import { fileService } from 'src/services/files.service';
import NubiloManager from 'src/services/nubiloManager';
import { DeleteFileSchema, GetFileMetadataSchema, UploadFileSchema } from 'src/types/dto/files.dto';

export const filesController = {
  example: async (req: Request, res: Response) => {
    res.json({ message: 'Hello from FilesController' });
  },
};




export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, 'Unauthorized');

  const parsed = UploadFileSchema.safeParse(req.body);
  if (!parsed.success) {
    throw createHttpError(400, 'Invalid input', { errors: parsed.error.flatten() });
  }

  const result = await fileService.uploadFile({
    userId,
    files: req.files as Express.Multer.File[] | undefined,
    body: parsed.data,
  });

  res.status(200).json(result);
};





export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const fileId = req.params.id;
  if (!userId) throw createHttpError(401, 'Unauthorized: UserID not found');
  if (!fileId) throw createHttpError(400, 'Bad Request: File ID not found');

  const parsed = DeleteFileSchema.safeParse({
    ...req.query,
    paths: req.body?.paths, // safely merge body for `paths`
  });

  if (!parsed.success) {
    throw createHttpError(400, 'Invalid input', {
      errors: parsed.error.flatten(),
    });
  }

  const result = await fileService.deleteFile({
    userId,
    fileId,
    ...parsed.data,
  });

  res.status(200).json(result);
};


export const getFileMetadata = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, 'Unauthorized');

  const cloudPath = req.params.id;

  const parsed = GetFileMetadataSchema.safeParse(req.query);
  if (!parsed.success) {
    throw createHttpError(400, 'Invalid query params', { errors: parsed.error.flatten() });
  }

  const result = await fileService.getFileMetadata({
    userId,
    cloudPath,
    includeCloud: parsed.data.includeCloud,
  });

  res.status(200).json(result);
};