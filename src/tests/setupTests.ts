
// Jest setup file
import '@testing-library/jest-dom';

// Mock the server environment variables
process.env.SUPABASE_URL = 'https://example.com';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';

// Mock fetch API
global.fetch = jest.fn();

// Mock the browser APIs that might not be available in the test environment
Object.defineProperty(window, 'console', {
  value: {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
  },
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}
