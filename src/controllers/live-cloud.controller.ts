import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { LiveCloudService } from 'src/services/live-cloud.service';
import { BrowseCloudSchema, MetadataSchema } from 'src/types/dto/live-cloud.dto';


export const liveCloudController = {
  example: async (req: Request, res: Response) => {
    res.json({ message: 'Hello from Live-cloudController' });
  },


};


export const browseCloud = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id || 'defaultUser';
  const parsed = BrowseCloudSchema.safeParse(req.query);

  if (!parsed.success) {
    throw createHttpError(400, 'Invalid query', { errors: parsed.error.flatten() });
  }

  const { prefix } = parsed.data;
  const result = await LiveCloudService.browse(userId, prefix);
  res.status(200).json(result);
};

export const getMetadata = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id || 'defaultUser';
  const parsed = MetadataSchema.safeParse(req.query);

  if (!parsed.success) {
    throw createHttpError(400, 'Invalid path', { errors: parsed.error.flatten() });
  }

  const result = await LiveCloudService.metadata(userId, parsed.data.path);
  res.status(200).json(result);
};