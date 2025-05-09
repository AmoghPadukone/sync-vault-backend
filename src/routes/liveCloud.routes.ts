import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { browseCloud, getMetadata } from 'src/controllers/live-cloud.controller';


const router = Router();

/**
 * @swagger
 * /api/live-cloud/browse:
 *   get:
 *     summary: Browse cloud storage using prefix
 *     tags: [Live Cloud]
 *     parameters:
 *       - in: query
 *         name: prefix
 *         schema:
 *           type: string
 *         description: Folder prefix to browse
 *     responses:
 *       200:
 *         description: Folders and files returned
 */
router.get('/browse', asyncHandler(browseCloud));

/**
 * @swagger
 * /api/live-cloud/metadata:
 *   get:
 *     summary: Fetch raw metadata of file/folder
 *     tags: [Live Cloud]
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Metadata returned
 */
router.get('/metadata', asyncHandler(getMetadata));

export default router;