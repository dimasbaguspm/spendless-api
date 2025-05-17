import express from 'express';

import { notFoundHandler } from './middleware/not-found.middleware.ts';
import apiRoutes from './routes/api.routes.ts';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use('/api', apiRoutes);

app.use(notFoundHandler);

// Only start the server if the file is being executed directly and not being imported
// In tests, we just want to import the app without starting the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
