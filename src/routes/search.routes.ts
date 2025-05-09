import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { advancedSearch, rawSearch, smartSearch } from '../controllers/search.controller';
import { validate } from '../middlewares/validate';
import { AdvancedSearchSchema, RawSearchSchema } from '../types/dto/search.dto';

const router = Router();

/**
 * @swagger
 * /api/search/advanced:
 *   post:
 *     summary: Perform structured advanced search using enriched DB metadata
 *     tags: [Search]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdvancedSearchDto'
 *     responses:
 *       200:
 *         description: Matched files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/File'
 */
router.post('/advanced', validate(AdvancedSearchSchema), asyncHandler(advancedSearch));

/**
 * @swagger
 * /api/search/raw:
 *   post:
 *     summary: Perform raw cloud-native search via cloud provider APIs
 *     tags: [Search]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RawSearchDto'
 *     responses:
 *       200:
 *         description: Raw cloud search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                 folders:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.post('/raw', validate(RawSearchSchema), asyncHandler(rawSearch));
/**
 * @swagger
 * /api/search/smart:
 *   post:
 *     summary: Convert natural language query into structured search filters
 *     tags: [Search]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SmartSearchDto'
 *     responses:
 *       200:
 *         description: JSON filter for previewing search
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdvancedSearchDto'
 */
router.post('/smart', asyncHandler(smartSearch));

export default router;