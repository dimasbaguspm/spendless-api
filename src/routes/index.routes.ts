import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

// Basic route for testing
router.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'SpendLess API is running',
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

export default router;
