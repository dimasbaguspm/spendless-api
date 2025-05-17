import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

// Health check endpoint
router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});

export default router;
