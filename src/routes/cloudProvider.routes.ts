import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
    connectProvider,
    disconnectProvider,
    getConnectedProviders,
    getProviders,
    updateProvider,
} from '../controllers/cloudProvider.controller';

const router = Router();

/**
 * @swagger
 * /api/providers:
 *   get:
 *     summary: Get list of all supported cloud providers
 *     tags: [Cloud Providers]
 *     responses:
 *       200:
 *         description: Returns all supported providers (static list)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 providers:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["aws", "azure", "gcp"]
 */
router.get('/', getProviders);

/**
 * @swagger
 * /api/providers/connect:
 *   post:
 *     summary: Connect a cloud provider by uploading credentials
 *     tags: [Cloud Providers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/AwsProviderDto'
 *               - $ref: '#/components/schemas/AzureProviderDto'
 *               - $ref: '#/components/schemas/GcpProviderDto'
 *     responses:
 *       200:
 *         description: Successfully connected provider
 *       400:
 *         description: Invalid input or missing fields
 *       401:
 *         description: Unauthorized
 */
router.post('/connect', connectProvider);

/**
 * @swagger
 * /api/providers/{providerId}:
 *   delete:
 *     summary: Disconnect a cloud provider for the current user
 *     tags: [Cloud Providers]
 *     parameters:
 *       - name: providerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [aws, azure, gcp]
 *     responses:
 *       200:
 *         description: Successfully disconnected provider
 *       400:
 *         description: Invalid provider ID
 *       401:
 *         description: Unauthorized
 */
router.delete('/:providerId', expressAsyncHandler(disconnectProvider));

/**
 * @swagger
 * /api/providers/user-connected:
 *   get:
 *     summary: Get list of cloud providers the user is currently connected to
 *     tags: [Cloud Providers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of provider configs with decrypted credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 providers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProviderConfigFull'
 *       401:
 *         description: Unauthorized
 */
router.get('/user-connected', expressAsyncHandler(getConnectedProviders));

/**
 * @swagger
 * /api/providers/{providerId}:
 *   patch:
 *     summary: Update credentials or fields for a connected cloud provider
 *     tags: [Cloud Providers]
 *     parameters:
 *       - name: providerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [aws, azure, gcp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProviderDto'
 *     responses:
 *       200:
 *         description: Provider config updated
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 */
router.patch('/:providerId', expressAsyncHandler(updateProvider));

export default router;
