// src/services/search.service.ts
import createHttpError from 'http-errors';
import OpenAI from 'openai';

import { promptBaseV1 } from 'src/config/prompts';
import prisma from '../db/client';
import NubiloManager from '../services/nubiloManager';
import { AdvancedSearchInput, RawSearchInput } from '../types/dto/search.dto';

// const promptBase = `You are a helpful assistant in a cloud storage app. Convert user search queries into structured JSON filters.

// Output must strictly match this TypeScript interface:

// interface AdvancedSearchInput {
//   fileName?: string;
//   mimeType?: string;
//   tag?: string;
//   isFavorite?: boolean;
//   sizeMin?: number;
//   sizeMax?: number;
//   sharedOnly?: boolean;
//   createdBefore?: string; // ISO 8601 date
//   createdAfter?: string;  // ISO 8601 date
// }

// Rules:
// - Always return ONLY the JSON. No text, no markdown, no explanation.
// - Return 'undefined' for fields not mentioned or implied.
// - Parse vague date references like "last week" or "before July" into ISO dates.

// Examples:
// Prompt: "show me favorite videos from March"
// Output:
// {
//   "fileName": undefined,
//   "mimeType": "video/",
//   "tag": undefined,
//   "isFavorite": true,
//   "sizeMin": undefined,
//   "sizeMax": undefined,
//   "sharedOnly": undefined,
//   "createdBefore": "2024-03-31T23:59:59Z",
//   "createdAfter": "2024-03-01T00:00:00Z"
// }`;


// const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const SearchService = {
  async advancedSearch(userId: string, filters: AdvancedSearchInput) {
    const {
      fileName,
      mimeType,
      tag,
      isFavorite,
      sizeMin,
      sizeMax,
      sharedOnly,
      createdAfter,
      createdBefore,
    } = filters;

    const where: any = {
      userId,
      ...(fileName?.trim() && {
        fileName: { contains: fileName.trim(), mode: 'insensitive' },
      }),
      ...(mimeType?.trim() && { mimeType: { contains: mimeType.trim() } }),
      ...(tag?.trim() && { tags: { array_contains: [tag.trim()] } }),
      ...(createdAfter && { createdAt: { gte: new Date(createdAfter) } }),
      ...(createdBefore && { createdAt: { lte: new Date(createdBefore) } }),
      ...(typeof isFavorite === 'boolean' && { isFavorite }),
      ...(typeof sizeMin === 'number' && { size: { gte: BigInt(sizeMin) } }),
      ...(typeof sizeMax === 'number' && { size: { lte: BigInt(sizeMax) } }),
    };

    if (sharedOnly) {
      const shared = await prisma.sharedFile.findMany({
        where: { ownerId: userId, isActive: true },
        select: { fileId: true },
      });
      const ids: string[] = shared.map((s: { fileId: string }) => s.fileId);
      where.id = { in: ids };
    }

    return await prisma.file.findMany({ where });
  }
  ,
  async rawSearch(userId: string, options: RawSearchInput) {
    const nubilo = await NubiloManager.getInstanceForUser(userId);

    const {
      query,
      directory,
      extension,
      metadata,
    } = options;

    if (!query || typeof query !== 'string') {
      throw createHttpError(400, 'Search query is required');
    }

    const results = await nubilo.search({
      query,
      directory,
      extensionFilter: extension,
      metadataKey: metadata ? Object.keys(metadata)[0] : undefined,
      metadataValue: metadata ? Object.values(metadata)[0] : undefined,
      caseSensitive: false,
      paginated: true,
      maxResults: 100,
    });

    return results;
  },
  async queryLLM(userQuery: string): Promise<AdvancedSearchInput> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        { role: 'system', content: promptBaseV1 },
        { role: 'user', content: userQuery },
      ],
      temperature: 0.2,
      stream: false,
    });

    let raw = completion.choices?.[0]?.message?.content;
    if (!raw) throw new Error('Invalid LLM response');

    // 🧹 Clean up common junk like markdown/code blocks and trailing commas
    raw = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/, '')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .trim();

    // ⚠ Replace `undefined` with null, since JSON.parse doesn't support undefined
    raw = raw.replace(/\bundefined\b/g, 'null');

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error('🚨 Raw LLM Output:', raw);
      throw new Error('LLM returned invalid JSON');


    }
  }

}
