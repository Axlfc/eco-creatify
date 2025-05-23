
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useMandatoryUsername } from "@/hooks/use-mandatory-username";

/**
 * Wrapper que protege rutas que requieren username obligatoriamente.
 * Redirige a rutas seguras si el usuario no tiene username.
 */
export function RequireUsername({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { recheckUsername } = useMandatoryUsername();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Si aún está cargando, no hacer nada
    if (isLoading) {
      return;
    }

    // Si no está autenticado, redirigir a auth
    if (!isAuthenticated || !user) {
      console.log('RequireUsername: Not authenticated, redirecting to auth');
      navigate("/auth", { replace: true });
      return;
    }

    // Si está autenticado pero no tiene username, forzar el modal y bloquear acceso
    if (isAuthenticated && user && !user.username) {
      console.log('RequireUsername: User authenticated but no username, forcing username mode');
      recheckUsername(); // Ensure modal is shown
      
      // Redirect to username setup
      navigate("/setup-username", { 
        replace: true, 
        state: { 
          from: location.pathname,
          message: 'Debes configurar tu username para acceder a esta sección'
        } 
      });
      return;
    }
  }, [isLoading, isAuthenticated, user, navigate, location, recheckUsername]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div role="status" aria-busy="true" tabIndex={-1} className="flex justify-center items-center min-h-screen focus:outline-none">
        <Skeleton className="w-32 h-8" />
        <span className="sr-only">Cargando...</span>
      </div>
    );
  }

  // Bloquear acceso si no está autenticado
  if (!isAuthenticated || !user) {
    return null; // Se redirigirá a auth
  }

  // Bloquear renderizado hasta que tenga username
  if (!user.username) {
    return null; // Se redirigirá a setup-username y se mostrará el modal
  }

  // Todo correcto, renderizar los children
  return <>{children}</>;
}
