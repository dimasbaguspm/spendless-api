/**
 * Sample test data to use in tests
 */

export const mockApiResponse = {
  message: 'Hello, World!',
  timestamp: new Date().toISOString(),
};

export const mockUserData = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
};

export const mockErrorResponse = {
  status: 'ERROR',
  message: 'An error occurred',
  timestamp: new Date().toISOString(),
};
