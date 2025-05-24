import { Router } from 'express';

import {
  listTransactions,
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/index.ts';

const router = Router();

// Transaction routes
router.get('/', listTransactions);
router.post('/', createTransaction);
router.get('/:id', getTransaction);
router.patch('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
