import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { login, me, signup, updateProfile } from '../controllers/auth.controller';
import { authenticateJWT } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { LoginSchema, ProfileUpdateSchema, SignupSchema } from '../types/dto/auth.dto';

const router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupDto'
 *     responses:
 *       201:
 *         description: Successfully registered
 *       400:
 *         description: Invalid email or password
 */
router.post('/signup', validate(SignupSchema), signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Bad request
 */
router.post('/login', validate(LoginSchema), login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get profile of the currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile with preferences
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "clt6h45s50001lx0vfp3zv4cu"
 *                 email:
 *                   type: string
 *                   example: "amoghpadukone@gmail.com"
 *                 defaultProvider:
 *                   type: string
 *                   example: "aws"
 *                 preferences:
 *                   $ref: '#/components/schemas/UserPreference'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticateJWT, asyncHandler(me));

/**
 * @swagger
 * /api/auth/profile:
 *   patch:
 *     summary: Update user profile and UI preferences
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdateDto'
 *     responses:
 *       200:
 *         description: Updated user profile
 *       400:
 *         description: Validation failed or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/profile', validate(ProfileUpdateSchema), authenticateJWT, asyncHandler(updateProfile));

export default router;
