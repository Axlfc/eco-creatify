
import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMandatoryUsername } from '@/hooks/use-mandatory-username';
import { MandatoryUsernameModal } from './MandatoryUsernameModal';
import { useToast } from '@/hooks/use-toast';

interface UsernameGuardProps {
  children: ReactNode;
}

// Routes that require username to be set (completely blocked)
const RESTRICTED_ROUTES = [
  '/dashboard',
  '/proposals/create',
  '/proposals/consensus',
  '/users/'
];

// Routes that allow partial access without username (read-only)
const PARTIAL_ACCESS_ROUTES = [
  '/forum',
  '/proposals'
];

export const UsernameGuard = ({ children }: UsernameGuardProps) => {
  const { 
    showModal, 
    shouldShowModal, 
    handleUsernameSet, 
    handleModalCloseAttempt,
    handleUsernameError,
    recheckUsername,
    hasUsername,
    isAuthenticated,
    isLoading,
    attemptCount,
    requiresCaptcha
  } = useMandatoryUsername();
  
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Continuous monitoring: recheck username on every route change and auth state change
  useEffect(() => {
    if (!isLoading) {
      const needsUsername = recheckUsername();
      console.log('UsernameGuard: Route change check:', { 
        path: location.pathname, 
        needsUsername, 
        isAuthenticated, 
        hasUsername 
      });
    }
  }, [location.pathname, isAuthenticated, isLoading, recheckUsername, hasUsername]);

  // Handle restricted route access - COMPLETE BLOCK
  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    const currentPath = location.pathname;
    const isRestrictedRoute = RESTRICTED_ROUTES.some(route => 
      currentPath.startsWith(route)
    );

    // If trying to access restricted route without username - IMMEDIATE BLOCK
    if (isRestrictedRoute && !hasUsername) {
      console.log('UsernameGuard: BLOCKED access to restricted route:', currentPath);
      
      toast({
        title: "Acceso completamente restringido",
        description: "Debes configurar tu username para acceder a esta funcionalidad",
        variant: "destructive",
      });

      // Redirect to a safe route and force username modal
      navigate('/forum', { replace: true });
    }
  }, [location.pathname, hasUsername, isAuthenticated, isLoading, navigate, toast]);

  // Additional security: prevent any interaction in restricted areas
  useEffect(() => {
    if (isAuthenticated && !hasUsername && !isLoading) {
      // Disable all forms, buttons, and interactive elements in restricted areas
      const currentPath = location.pathname;
      const isInRestrictedArea = RESTRICTED_ROUTES.some(route => 
        currentPath.startsWith(route)
      );

      if (isInRestrictedArea) {
        console.log('UsernameGuard: User in restricted area without username - enforcing restrictions');
        
        // Add a class to body to potentially disable interactions via CSS
        document.body.classList.add('username-required');
      } else {
        document.body.classList.remove('username-required');
      }
    } else {
      document.body.classList.remove('username-required');
    }

    return () => {
      document.body.classList.remove('username-required');
    };
  }, [isAuthenticated, hasUsername, isLoading, location.pathname]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {children}
      <MandatoryUsernameModal 
        open={showModal}
        onUsernameSet={handleUsernameSet}
        onCloseAttempt={handleModalCloseAttempt}
        onError={handleUsernameError}
        requiresCaptcha={requiresCaptcha}
        attemptCount={attemptCount}
      />
    </>
  );
};
