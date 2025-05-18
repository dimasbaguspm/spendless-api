import express, { Router } from 'express';

import authRoutes from './auth.routes.ts';
import healthRoutes from './health.routes.ts';
import indexRoutes from './index.routes.ts';

const router: Router = express.Router();

// Register routes
router.use('/', indexRoutes);
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

export default router;
