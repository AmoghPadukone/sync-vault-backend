import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { deleteFile, filesController, getFileMetadata, uploadFile } from '../controllers/files.controller';
// import { validate } from '../middlewares/validate';
// import { CreateFilesSchema } from '../types/dto/files.dto';

const router = Router();
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /api/files/upload:
 *   get:
 *     summary: Upload a file
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/example', asyncHandler(filesController.example));
/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload one or more files
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               destination:
 *                 type: string
 *               usePresignedUrl:
 *                 type: boolean
 *               expiration:
 *                 type: number
 *               resumable:
 *                 type: boolean
 *               chunkSize:
 *                 type: number
 *               tempResumableConfigPath:
 *                 type: string
 *               uploadIntent:
 *                 type: string
 *                 enum: [mydrive, archive]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Upload successful
 *       400:
 *         description: Bad request
 */
router.post('/upload', upload.array('file'), asyncHandler(uploadFile));
/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     summary: Delete a file (or multiple files)
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File path (cloud key) to delete
 *       - in: query
 *         name: softDelete
 *         schema:
 *           type: boolean
 *         description: Enable soft delete
 *       - in: query
 *         name: backupPrefix
 *         schema:
 *           type: string
 *         description: Cloud folder to move deleted file to (soft delete)
 *       - in: query
 *         name: multiple
 *         schema:
 *           type: boolean
 *         description: If true, deletes multiple files via request body
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteFileDto'
 *     responses:
 *       200:
 *         description: File(s) deleted
 *       400:
 *         description: Input or validation error
 */
router.delete('/:id', asyncHandler(deleteFile));
/**
 * @swagger
 * /api/files/{id}:
 *   get:
 *     summary: Get metadata of a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cloud path of the file
 *       - in: query
 *         name: includeCloud
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Whether to include live cloud metadata
 *     responses:
 *       200:
 *         description: File metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 source:
 *                   type: string
 *                   enum: [db, cloud]
 *                 cloudPath:
 *                   type: string
 *                 fileName:
 *                   type: string
 *                 size:
 *                   type: number
 *                 mimeType:
 *                   type: string
 *                 lastModified:
 *                   type: string
 *                   format: date-time
 *                 tags:
 *                   type: array
 *                   items: { type: string }
 *                 classification:
 *                   type: object
 *                 rawMetadata:
 *                   type: object
 */
router.get('/:id', asyncHandler(getFileMetadata));
export default router;

