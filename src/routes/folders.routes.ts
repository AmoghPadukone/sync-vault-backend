import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { createFolder, deleteFolder, getFolder, listEnrichedFolderContents } from 'src/controllers/folders.controller';

const router = Router();

/**
 * @swagger
 * /api/folders/create:
 *   post:
 *     summary: Create a new folder in My Drive or Archive
 *     tags: [Folders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFoldersDto'
 *     responses:
 *       200:
 *         description: Folder successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateFolderResponse'
 */
router.post('/create', asyncHandler(createFolder));

/**
 * @swagger
 * /api/folders:
 *   get:
 *     summary: Get a folder and its enriched contents
 *     tags: [Folders]
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Path of the folder
 *     responses:
 *       200:
 *         description: Folder and enriched files returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetFolderResponse'
 */
router.get('/', asyncHandler(getFolder));

/**
 * @swagger
 * /api/folders:
 *   delete:
 *     summary: Delete a folder from DB and optionally from cloud (recursive)
 *     tags: [Folders]
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Path of the folder
 *       - in: query
 *         name: recursive
 *         required: false
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Whether to recursively delete contents
 *     responses:
 *       200:
 *         description: Folder deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteFolderResponse'
 */
router.delete('/', asyncHandler(deleteFolder));

/**
 * @swagger
 * /api/folders/contents:
 *   get:
 *     summary: List all enriched folders and files under a path in My Drive
 *     tags: [Folders]
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Prefix path of the parent folder
 *     responses:
 *       200:
 *         description: Folder contents listed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FolderContentsResponse'
 */
router.get('/contents', asyncHandler(listEnrichedFolderContents));

export default router;