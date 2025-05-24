import { Router } from 'express';

import { getSummary } from '../controllers/index.ts';

const router = Router();

// Summary route
router.get('/', getSummary);

export default router;
