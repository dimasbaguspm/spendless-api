import { Router } from 'express';

import {
  listAccountLimits,
  createAccountLimit,
  getAccountLimit,
  updateAccountLimit,
  deleteAccountLimit,
} from '../controllers/index.ts';

const router = Router({ mergeParams: true }); // mergeParams allows access to parent router params

// Account limit routes
router.get('/', listAccountLimits);
router.post('/', createAccountLimit);
router.get('/:limitId', getAccountLimit);
router.patch('/:limitId', updateAccountLimit);
router.delete('/:limitId', deleteAccountLimit);

// Remaining limit should be accessed at the accountId level
// This will be mounted at /accounts/:accountId/remaining-limit in the account.routes.ts file

export default router;
