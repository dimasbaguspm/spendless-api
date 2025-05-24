import { Router } from 'express';

import { registerUser, loginUser } from '../controllers/index.ts';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
// // Optional password reset functionality
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);

export default router;
