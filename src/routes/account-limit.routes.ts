import { Router } from 'express';

import {
  listAccountLimits,
  createAccountLimit,
  getAccountLimit,
  updateAccountLimit,
  deleteAccountLimit,
} from '../controllers/index.ts';

const router = Router({ mergeParams: true }); // mergeParams allows access to parent router params

/**
 * @swagger
 * /accounts/{accountId}/limits:
 *   get:
 *     summary: List account limits
 *     description: Get all spending limits for a specific account
 *     tags: [Account Limits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account limits retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 limits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       amount:
 *                         type: number
 *                         format: decimal
 *                       period:
 *                         type: string
 *                         enum: [daily, weekly, monthly, yearly]
 *                       accountId:
 *                         type: string
 *                       groupId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - user not authorized to access account
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', listAccountLimits);

/**
 * @swagger
 * /accounts/{accountId}/limits:
 *   post:
 *     summary: Create account limit
 *     description: Create a new spending limit for an account
 *     tags: [Account Limits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
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
 *             required:
 *               - name
 *               - amount
 *               - period
 *             properties:
 *               name:
 *                 type: string
 *                 description: Limit name
 *                 example: "Monthly Food Budget"
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 description: Limit amount
 *                 example: 500.00
 *               period:
 *                 type: string
 *                 enum: [daily, weekly, monthly, yearly]
 *                 description: Limit period
 *                 example: "monthly"
 *     responses:
 *       201:
 *         description: Account limit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account limit created successfully"
 *                 limit:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     amount:
 *                       type: number
 *                       format: decimal
 *                     period:
 *                       type: string
 *                     accountId:
 *                       type: string
 *                     groupId:
 *                       type: string
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - user not authorized to modify account
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createAccountLimit);

/**
 * @swagger
 * /accounts/{accountId}/limits/{limitId}:
 *   get:
 *     summary: Get account limit
 *     description: Retrieve a specific account limit
 *     tags: [Account Limits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *       - in: path
 *         name: limitId
 *         required: true
 *         schema:
 *           type: string
 *         description: Limit ID
 *     responses:
 *       200:
 *         description: Account limit retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 limit:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     amount:
 *                       type: number
 *                       format: decimal
 *                     period:
 *                       type: string
 *                     accountId:
 *                       type: string
 *                     groupId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - user not authorized to access account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Account or limit not found
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
router.get('/:limitId', getAccountLimit);

/**
 * @swagger
 * /accounts/{accountId}/limits/{limitId}:
 *   patch:
 *     summary: Update account limit
 *     description: Update a specific account limit
 *     tags: [Account Limits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *       - in: path
 *         name: limitId
 *         required: true
 *         schema:
 *           type: string
 *         description: Limit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Limit name
 *                 example: "Updated Monthly Food Budget"
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 description: Limit amount
 *                 example: 600.00
 *               period:
 *                 type: string
 *                 enum: [daily, weekly, monthly, yearly]
 *                 description: Limit period
 *                 example: "monthly"
 *     responses:
 *       200:
 *         description: Account limit updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account limit updated successfully"
 *                 limit:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     amount:
 *                       type: number
 *                       format: decimal
 *                     period:
 *                       type: string
 *                     accountId:
 *                       type: string
 *                     groupId:
 *                       type: string
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - user not authorized to modify account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Account or limit not found
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
router.patch('/:limitId', updateAccountLimit);

/**
 * @swagger
 * /accounts/{accountId}/limits/{limitId}:
 *   delete:
 *     summary: Delete account limit
 *     description: Delete a specific account limit
 *     tags: [Account Limits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *       - in: path
 *         name: limitId
 *         required: true
 *         schema:
 *           type: string
 *         description: Limit ID
 *     responses:
 *       200:
 *         description: Account limit deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account limit deleted successfully"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - user not authorized to modify account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Account or limit not found
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
router.delete('/:limitId', deleteAccountLimit);

// Remaining limit should be accessed at the accountId level
// This will be mounted at /accounts/:accountId/remaining-limit in the account.routes.ts file

export default router;
