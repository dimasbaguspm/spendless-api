import { getTestAgent } from '../utils.ts';

describe('Index Routes', () => {
  describe('GET /api', () => {
    it('should return a welcome message', async () => {
      const response = await getTestAgent().get('/api');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'SpendLess API is running');
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
