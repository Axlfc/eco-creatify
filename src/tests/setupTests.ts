
// Jest setup file
import '@testing-library/jest-dom';

// Only run blockchain mocking in test environment
const isTestEnvironment = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;

// Polyfill global para TextEncoder/TextDecoder en entorno Node.js
if (typeof global !== 'undefined' && isTestEnvironment) {
  if (typeof global.TextEncoder === 'undefined') {
    const { TextEncoder, TextDecoder } = require('util');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  }
}

// Mock the server environment variables ONLY in test environment
if (typeof process !== 'undefined' && isTestEnvironment) {
  process.env.SUPABASE_URL = 'https://example.com';
  process.env.SUPABASE_ANON_KEY = 'test-anon-key';
}

// Mock fetch API ONLY in test environment
if (typeof global !== 'undefined' && isTestEnvironment) {
  global.fetch = jest.fn();
}

// Mock console methods to avoid noise in tests ONLY in test environment
if (typeof global !== 'undefined' && isTestEnvironment) {
  const originalConsole = console;
  global.console = {
    ...originalConsole,
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
  };
}

// Clean up after each test
if (isTestEnvironment) {
  afterEach(() => {
    jest.clearAllMocks();
  });
}

// Ensure Jest globals are available
declare global {
  var jest: any;
  var describe: any;
  var it: any;
  var expect: any;
  var beforeEach: any;
  var afterEach: any;
  var beforeAll: any;
  var afterAll: any;
}
