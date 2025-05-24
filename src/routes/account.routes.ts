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

// Account routes
router.get('/', listAccounts);
router.post('/', createAccount);
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
