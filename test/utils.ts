// filepath: /home/kyrielle/development/spendless-api/test/utils.ts
/**
 * Set up your test utilities here for making HTTP requests to your Express app
 */

import { Express } from 'express';
import request from 'supertest';

import realApp from '../src/index.ts';

/**
 * Creates a supertest agent for testing HTTP endpoints
 */
function createTestAgent(app: Express) {
  return request(app);
}

/**
 * Returns a supertest agent for the main app
 */
export function getTestAgent() {
  return createTestAgent(realApp);
}
