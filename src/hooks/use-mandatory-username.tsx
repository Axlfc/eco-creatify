
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export const useMandatoryUsername = () => {
  const { user, isAuthenticated, isLoading, updateUsername } = useAuth();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [hasCheckedUsername, setHasCheckedUsername] = useState(false);

  // Check if user needs to set username
  useEffect(() => {
    // Don't check until auth is loaded
    if (isLoading) {
      return;
    }

    // Reset check state when user changes
    if (!hasCheckedUsername && isAuthenticated && user) {
      setHasCheckedUsername(true);
      
      // If user is authenticated but has no username, show modal
      if (!user.username) {
        console.log('MandatoryUsername: User authenticated but no username, showing modal');
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    }

    // Reset when user logs out
    if (!isAuthenticated) {
      setShowModal(false);
      setHasCheckedUsername(false);
    }
  }, [isAuthenticated, user, isLoading, hasCheckedUsername]);

  // Handle username being set
  const handleUsernameSet = (newUsername: string) => {
    console.log('MandatoryUsername: Username set successfully:', newUsername);
    
    // Update the auth context
    updateUsername(newUsername);
    
    // Hide modal
    setShowModal(false);
    
    toast({
      title: "¡Bienvenido!",
      description: `Tu username ${newUsername} ha sido configurado correctamente.`,
    });
  };

  // Force recheck (useful after navigation or page refresh)
  const recheckUsername = () => {
    if (isAuthenticated && user && !user.username && !showModal) {
      console.log('MandatoryUsername: Forcing recheck - showing modal');
      setShowModal(true);
    }
  };

  return {
    showModal,
    shouldShowModal: isAuthenticated && user && !user.username,
    handleUsernameSet,
    recheckUsername,
    hasUsername: user?.username ? true : false,
    isAuthenticated,
    isLoading
  };
};
