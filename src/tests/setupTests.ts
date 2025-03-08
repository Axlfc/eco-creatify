
// Setup file for Jest tests

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  writable: true
});

// Mock fetch API
global.fetch = jest.fn();

// Silence console errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('Warning:')) {
    return;
  }
  originalConsoleError(...args);
};

// Set up environment variables for testing
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://example.supabase.co';
process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'test-key';
