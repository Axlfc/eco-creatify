
import '@testing-library/jest-dom';

// Mock global objects for testing environment
global.fetch = jest.fn();
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: 'mock-id' }),
}));

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [], error: null })),
      insert: jest.fn(() => Promise.resolve({ data: [], error: null })),
      update: jest.fn(() => Promise.resolve({ data: [], error: null })),
      delete: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  },
}));

// Mock hooks
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 'test-user', email: 'test@example.com' },
    isLoading: false,
  }),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));
