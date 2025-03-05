import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Store the intended destination before redirecting to auth
  const storeIntendedDestination = () => {
    if (location.pathname !== '/auth') {
      localStorage.setItem('intendedDestination', location.pathname + location.search);
    }
  };

  // Clear the stored destination
  const clearIntendedDestination = () => {
    localStorage.removeItem('intendedDestination');
  };

  // Redirect to the intended destination or a default route
  const redirectAfterAuth = () => {
    const intendedDestination = localStorage.getItem('intendedDestination');
    
    // Default to dashboard if no intended destination
    const destinationPath = intendedDestination || '/dashboard';
    
    // Clear the stored destination
    clearIntendedDestination();
    
    // Navigate to the destination
    navigate(destinationPath);
  };

  return {
    storeIntendedDestination,
    redirectAfterAuth,
    clearIntendedDestination
  };
};
