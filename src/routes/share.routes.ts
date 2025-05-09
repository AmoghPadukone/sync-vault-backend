// src/routes/share.routes.ts
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { listShares, revokeShare, shareFile } from 'src/controllers/share.controller';


const router = Router();

/**
 * @swagger
 * /api/share:
 *   post:
 *     summary: Generate a public share link
 *     tags: [Share]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShareFileDto'
 *     responses:
 *       200:
 *         description: Share link created
 */
router.post('/', asyncHandler(shareFile
));

/**
 * @swagger
 * /api/share/{fileId}:
 *   delete:
 *     summary: Revoke sharing for a file
 *     tags: [Share]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Share removed
 */
router.delete('/:fileId', asyncHandler(revokeShare));

/**
 * @swagger
 * /api/share:
 *   get:
 *     summary: List all shared files
 *     tags: [Share]
 *     responses:
 *       200:
 *         description: Shared files
 */
router.get('/', asyncHandler(listShares));

export default router;