import { Router } from 'express';
import { statsController } from '../controllers/StatsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * @openapi
 * /stats/top-transactions:
 *   get:
 *     summary: Get top 10 transactions by amount
 *     tags: [Statistics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Top transactions retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/top-transactions', authMiddleware, statsController.getTopTransactions);

/**
 * @openapi
 * /stats/top-users:
 *   get:
 *     summary: Get top 10 users by transfer volume
 *     tags: [Statistics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Top users retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/top-users', authMiddleware, statsController.getTopUsers);

export default router;
