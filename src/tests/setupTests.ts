// Jest setup file
// import '@testing-library/jest-dom'; // ← Solo necesario para tests de React DOM

// Mock the server environment variables
process.env.SUPABASE_URL = 'https://example.com';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';

// Mock fetch API
global.fetch = jest.fn();

// Mock the browser APIs that might not be available in the test environment
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
