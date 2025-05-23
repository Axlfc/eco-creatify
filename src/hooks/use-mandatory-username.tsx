/**
 * Flujo esperado para username obligatorio:
 * - Si el usuario autenticado no tiene username, mostrar siempre el modal de selección de username en todas las rutas protegidas.
 * - Si el modal se cierra sin elegir username válido, forzar logout y redirigir a /login.
 * - Tras elegir username único y válido, actualizar el perfil global y habilitar rutas protegidas (/dashboard, /user/{username}...).
 * - Las rutas públicas (foro, landing, etc.) permiten solo lectura sin username, pero bloquean acciones de publicación.
 * - El flujo es reutilizable y debe mantenerse sincronizado con cambios de sesión o datos de usuario.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

export const useMandatoryUsername = () => {
  const { user, isAuthenticated, isLoading, updateUsername, forceLogout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);

  // Check if user needs username on every auth state change and route change
  const checkUsernameRequired = useCallback(() => {
    // Don't check until auth is loaded
    if (isLoading) {
      return;
    }

    // If user is authenticated but has no username, ALWAYS show modal
    if (isAuthenticated && user && !user.username) {
      console.log('MandatoryUsername: User authenticated but no username, FORCING modal');
      setShowModal(true);
      return true;
    }

    // If user has username or is not authenticated, hide modal
    if (!isAuthenticated || (user && user.username)) {
      setShowModal(false);
      return false;
    }

    return false;
  }, [isAuthenticated, user, isLoading]);

  // Check on auth state changes and route changes - ALWAYS ENFORCE
  useEffect(() => {
    checkUsernameRequired();
  }, [checkUsernameRequired, location.pathname, isAuthenticated, user]);

  // Additional check to enforce modal on any render
  useEffect(() => {
    const enforceCheck = () => {
      checkUsernameRequired();
    };
    
    // Run check immediately and on any potential state changes
    enforceCheck();
    
    // Set up interval to periodically check (catches any state restoration edge cases)
    const interval = setInterval(enforceCheck, 5000);
    return () => clearInterval(interval);
  }, [checkUsernameRequired]);

  // Anti-spam: show captcha after multiple attempts
  useEffect(() => {
    if (attemptCount >= 3) {
      setShowCaptcha(true);
    }
  }, [attemptCount]);

  // Handle username being set
  const handleUsernameSet = async (newUsername: string) => {
    console.log('MandatoryUsername: Username set successfully:', newUsername);
    
    try {
      // Update the auth context
      await updateUsername(newUsername);
      
      // Hide modal and reset counters
      setShowModal(false);
      setAttemptCount(0);
      setShowCaptcha(false);
      
      toast({
        title: "¡Bienvenido!",
        description: `Tu username ${newUsername} ha sido configurado correctamente.`,
      });
    } catch (error) {
      console.error('MandatoryUsername: Error setting username:', error);
      toast({
        title: "Error",
        description: "Error al configurar el username. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Handle modal close attempts - FORCE LOGOUT
  const handleModalCloseAttempt = useCallback(() => {
    console.log('MandatoryUsername: User attempted to close modal - forcing logout');
    
    toast({
      title: "Sesión cerrada por seguridad",
      description: "Debes elegir un username para continuar usando la plataforma",
      variant: "destructive",
    });

    forceLogout("Flujo de username cancelado");
  }, [forceLogout, toast]);

  // Handle failed username attempts
  const handleUsernameError = useCallback(() => {
    setAttemptCount(prev => prev + 1);
    
    if (attemptCount >= 2) {
      toast({
        title: "Múltiples intentos fallidos",
        description: "Por seguridad, completa la verificación anti-spam",
        variant: "destructive",
      });
    }
  }, [attemptCount, toast]);

  return {
    showModal,
    shouldShowModal: isAuthenticated && user && !user.username,
    handleUsernameSet,
    handleModalCloseAttempt,
    handleUsernameError,
    recheckUsername: checkUsernameRequired,
    hasUsername: user?.username ? true : false,
    isAuthenticated,
    isLoading,
    attemptCount,
    showCaptcha,
    requiresCaptcha: attemptCount >= 3
  };
};
