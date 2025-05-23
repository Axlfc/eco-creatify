
// Jest setup file
import '@testing-library/jest-dom';

// Mock the server environment variables
process.env.SUPABASE_URL = 'https://example.com';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';

// Mock fetch API
global.fetch = jest.fn();

// Mock console methods to avoid noise in tests
const originalConsole = console;
global.console = {
  ...originalConsole,
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Ensure Jest globals are available
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
  
  var describe: jest.Describe;
  var it: jest.It;
  var test: jest.It;
  var expect: jest.Expect;
  var beforeAll: jest.Lifecycle;
  var beforeEach: jest.Lifecycle;
  var afterAll: jest.Lifecycle;
  var afterEach: jest.Lifecycle;
}
