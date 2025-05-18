import express, { Router } from 'express';

import { TransactionController } from '../controllers/transaction.controller.ts';
import { authenticateJWT } from '../middleware/auth.middleware.ts';

const router: Router = express.Router();
const transactionController = new TransactionController();

// All routes require authentication
router.use(authenticateJWT);

// Regular CRUD routes
router.get('/', transactionController.getTransactions.bind(transactionController));
router.post('/', transactionController.createTransaction.bind(transactionController));
router.get('/:id', transactionController.getTransactionById.bind(transactionController));
router.put('/:id', transactionController.updateTransaction.bind(transactionController));
router.delete('/:id', transactionController.deleteTransaction.bind(transactionController));

export default router;
