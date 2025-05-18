import express, { Router } from 'express';

import authRoutes from './auth.routes.ts';
import categoryRoutes from './category.routes.ts';
import healthRoutes from './health.routes.ts';
import indexRoutes from './index.routes.ts';
import transactionRoutes from './transaction.routes.ts';

const router: Router = express.Router();

// Register routes
router.use('/', indexRoutes);
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);

export default router;
