import express from 'express';

import { pool } from './core/db/config.ts';
import { notFoundHandler } from './middleware/not-found.middleware.ts';
import apiRoutes from './routes/api.routes.ts';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use('/api', apiRoutes);
app.use(notFoundHandler);

// Test database connection
const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connection successful');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Only start the server if the file is being executed directly and not being imported
// In tests, we just want to import the app without starting the server
if (process.env.NODE_ENV !== 'test') {
  testDatabaseConnection().catch((error) => {
    console.error('Error testing database connection:', error);
    process.exit(1);
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
