import { getTestAgent } from '../utils.ts';

describe('Not Found Middleware', () => {
  it('should return 404 for non-existent routes', async () => {
    const response = await getTestAgent().get('/api/non-existent-route');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('status', 'ERROR');
    expect(response.body).toHaveProperty('message', 'Resource not found');
    expect(response.body).toHaveProperty('path');
  });
});
