import { getTestAgent } from '../utils.ts';

describe('Health Routes', () => {
  describe('GET /api/health', () => {
    it('should return status UP', async () => {
      const response = await getTestAgent().get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'UP');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
