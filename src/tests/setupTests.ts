
// Jest setup file
import '@testing-library/jest-dom';

// Polyfill global para TextEncoder/TextDecoder en entorno Node.js
if (typeof global !== 'undefined') {
  if (typeof global.TextEncoder === 'undefined') {
    const { TextEncoder, TextDecoder } = require('util');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  }
}

// Mock the server environment variables
if (typeof process !== 'undefined') {
  process.env.SUPABASE_URL = 'https://example.com';
  process.env.SUPABASE_ANON_KEY = 'test-anon-key';
}

// Mock fetch API
if (typeof global !== 'undefined') {
  global.fetch = jest.fn();
}

// Mock console methods to avoid noise in tests
const originalConsole = console;
if (typeof global !== 'undefined') {
  global.console = {
    ...originalConsole,
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
  };
}

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Ensure Jest globals are available - these are already defined by Jest
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}
