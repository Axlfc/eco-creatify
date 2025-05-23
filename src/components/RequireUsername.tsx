
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Wrapper que protege rutas restringidas y fuerza a definir username único.
 * SOLO actúa si el usuario está autenticado.
 * Si el usuario no tiene username, redirige automáticamente a /setup-username.
 */
export function RequireUsername({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Si aún está cargando, no hacer nada
    if (isLoading) {
      return;
    }

    // Si no está autenticado, redirigir a auth
    if (!isAuthenticated || !user) {
      navigate("/auth", { replace: true });
      return;
    }

    // SOLO si está autenticado pero no tiene username, redirigir a setup
    if (isAuthenticated && user && !user.username) {
      console.log('RequireUsername: User authenticated but no username, redirecting to setup');
      navigate("/setup-username", { 
        replace: true, 
        state: { from: location.pathname } 
      });
      return;
    }
  }, [isLoading, isAuthenticated, user, navigate, location]);

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
    return null; // Se redirigirá a setup-username
  }

  // Todo correcto, renderizar los children
  return <>{children}</>;
}
