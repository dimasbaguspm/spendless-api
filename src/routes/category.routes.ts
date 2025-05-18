import express, { Router } from 'express';

import { CategoryController } from '../controllers/category.controller.ts';
import { authenticateJWT } from '../middleware/auth.middleware.ts';

const router: Router = express.Router();
const categoryController = new CategoryController();

// All routes require authentication
router.use(authenticateJWT);

// Standard CRUD routes
router.get('/', categoryController.getCategories.bind(categoryController));
router.post('/', categoryController.createCategory.bind(categoryController));
router.get('/:id', categoryController.getCategoryById.bind(categoryController));
router.put('/:id', categoryController.updateCategory.bind(categoryController));
router.delete('/:id', categoryController.deleteCategory.bind(categoryController));

export default router;
