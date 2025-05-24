import { Router } from 'express';

import {
  listAccounts,
  createAccount,
  getAccount,
  updateAccount,
  deleteAccount,
  listAccountTransactions,
  getAccountRemainingLimit,
} from '../controllers/index.ts';

import accountLimitRoutes from './account-limit.routes.ts';

const router = Router();

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: List all accounts
 *     description: Retrieve all accounts for the authenticated user's group
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: List of accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new account
 *     description: Create a new account for the authenticated user's group
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - balance
 *             properties:
 *               name:
 *                 type: string
 *                 description: Account name
 *                 example: "Main Checking Account"
 *               type:
 *                 type: string
 *                 enum: [savings, checking, credit, cash]
 *                 description: Account type
 *                 example: "checking"
 *               balance:
 *                 type: number
 *                 format: decimal
 *                 description: Initial account balance
 *                 example: 1500.00
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Account routes
router.get('/', listAccounts);
router.post('/', createAccount);

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Get account by ID
 *     description: Retrieve a specific account by its ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     summary: Update account
 *     description: Update account details
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Account name
 *               type:
 *                 type: string
 *                 enum: [savings, checking, credit, cash]
 *                 description: Account type
 *               balance:
 *                 type: number
 *                 format: decimal
 *                 description: Account balance
 *     responses:
 *       200:
 *         description: Account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete account
 *     description: Delete an account and all its associated data
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *     responses:
 *       204:
 *         description: Account deleted successfully
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getAccount);
router.patch('/:id', updateAccount);
router.delete('/:id', deleteAccount);

// Account transactions
router.get('/:accountId/transactions', listAccountTransactions);

// Account remaining limit
router.get('/:accountId/remaining-limit', getAccountRemainingLimit);

// Mount account limit routes
router.use('/:accountId/limits', accountLimitRoutes);

export default router;
