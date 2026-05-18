import { Router } from 'express';
import { healthController } from '../controllers/HealthController';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Check the status of the backend server and its database connection.
 *     responses:
 *       200:
 *         description: Server is healthy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Backend is running!
 *                 dbStatus:
 *                   type: string
 *                   example: connected
 */
router.get('/health', healthController.getHealth);

export default router;
