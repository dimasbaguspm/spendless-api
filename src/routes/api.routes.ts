import express, { Router } from 'express';

import healthRoutes from './health.routes.ts';
import indexRoutes from './index.routes.ts';

const router: Router = express.Router();

// Register routes
router.use('/', indexRoutes);
router.use('/health', healthRoutes);

export default router;
