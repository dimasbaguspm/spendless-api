import { Router } from 'express';

import { getMe, updateMe } from '../controllers/user.controller.ts';

const router = Router();

// User routes
router.get('/me', getMe);
router.patch('/me', updateMe);

export default router;
