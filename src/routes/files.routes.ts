import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { filesController } from '../controllers/files.controller';
// import { validate } from '../middlewares/validate';
// import { CreateFilesSchema } from '../types/dto/files.dto';

const router = Router();

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

export default router;

