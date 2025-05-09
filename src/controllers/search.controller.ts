// src/controllers/search.controller.ts
import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { z } from 'zod';
import { SearchService } from '../services/search.service';
import { AdvancedSearchSchema, RawSearchSchema, SmartSearchSchema } from '../types/dto/search.dto';

export const advancedSearch = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, 'Unauthorized');

  const parsed = AdvancedSearchSchema.safeParse(req.body);
  if (!parsed.success) {
    throw createHttpError(400, parsed.error.flatten());
  }

  const results = await SearchService.advancedSearch(userId, parsed.data);
  res.status(200).json(results);
};

export const rawSearch = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, 'Unauthorized');

  const parsed = RawSearchSchema.safeParse(req.body);
  if (!parsed.success) {
    throw createHttpError(400, parsed.error.flatten());
  }

  const results = await SearchService.rawSearch(userId, parsed.data);
  res.status(200).json(results);
};


export const smartSearch = async (req: Request, res: Response): Promise<void> => {
  const parsed = SmartSearchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const result = await SearchService.queryLLM(parsed.data.query);
  res.status(200).json(result);
}
