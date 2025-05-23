
import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMandatoryUsername } from '@/hooks/use-mandatory-username';
import { MandatoryUsernameModal } from './MandatoryUsernameModal';
import { useToast } from '@/hooks/use-toast';

interface UsernameGuardProps {
  children: ReactNode;
}

// Routes that require username to be set
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
    recheckUsername,
    hasUsername,
    isAuthenticated,
    isLoading
  } = useMandatoryUsername();
  
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Recheck username on route changes
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      recheckUsername();
    }
  }, [location.pathname, isAuthenticated, isLoading]);

  // Handle restricted route access
  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    const currentPath = location.pathname;
    const isRestrictedRoute = RESTRICTED_ROUTES.some(route => 
      currentPath.startsWith(route)
    );

    // If trying to access restricted route without username
    if (isRestrictedRoute && !hasUsername) {
      console.log('UsernameGuard: Blocked access to restricted route:', currentPath);
      
      toast({
        title: "Acceso restringido",
        description: "Debes configurar tu username para acceder a esta funcionalidad",
        variant: "destructive",
      });

      // Redirect to a safe route
      navigate('/forum', { replace: true });
    }
  }, [location.pathname, hasUsername, isAuthenticated, isLoading, navigate, toast]);

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
      />
    </>
  );
};
