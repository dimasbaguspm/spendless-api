import { Router } from 'express';

import {
  listCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  listCategoryTransactions,
} from '../controllers/index.ts';

const router = Router();

// Category routes
router.get('/', listCategories);
router.post('/', createCategory);
router.get('/:id', getCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

// Category transactions
router.get('/:categoryId/transactions', listCategoryTransactions);

export default router;
