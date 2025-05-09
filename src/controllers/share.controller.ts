import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { ShareService } from '../services/share.service';
import { ShareFileSchema } from '../types/dto/share.dto';

export const shareFile = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id || 'defaultUser';
  const parsed = ShareFileSchema.safeParse(req.body);

  if (!parsed.success) {
    throw createHttpError(400, 'Invalid request', { errors: parsed.error.flatten() });
  }

  const { path, expiresIn } = parsed.data;
  const shared = await ShareService.generateShare(userId, path, expiresIn);
  res.status(200).json(shared);
};

export const revokeShare = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id || 'defaultUser';
  const { fileId } = req.params;

  if (!fileId) throw createHttpError(400, 'fileId required');

  await ShareService.revokeShare(userId, fileId);
  res.status(200).json({ message: 'Share revoked' });
};

export const listShares = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id || 'defaultUser';
  const shares = await ShareService.listShares(userId);
  res.status(200).json(shares);
};