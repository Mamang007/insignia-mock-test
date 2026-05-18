import { Router } from 'express';
import { walletController } from '../controllers/WalletController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * @openapi
 * /wallet/balance:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallet]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Balance retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/balance', authMiddleware, walletController.getBalance);

/**
 * @openapi
 * /wallet/topup:
 *   post:
 *     summary: Top up wallet balance
 *     tags: [Wallet]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       204:
 *         description: Top up successful
 *       400:
 *         description: Invalid topup amount
 *       401:
 *         description: Unauthorized
 */
router.post('/topup', authMiddleware, walletController.topup);

/**
 * @openapi
 * /wallet/transfer:
 *   post:
 *     summary: Transfer funds to another user
 *     tags: [Wallet]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [toUsername, amount]
 *             properties:
 *               toUsername:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       204:
 *         description: Transfer successful
 *       400:
 *         description: Insufficient balance
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Destination user not found
 */
router.post('/transfer', authMiddleware, walletController.transfer);

/**
 * @openapi
 * /wallet/transactions:
 *   get:
 *     summary: Get transaction history
 *     tags: [Wallet]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Transactions retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/transactions', authMiddleware, walletController.getTransactions);

export default router;
