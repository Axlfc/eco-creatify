
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Wrapper que protege rutas restringidas y fuerza a definir username único.
 * Si el usuario no tiene username, redirige automáticamente a /setup-username.
 * Accesibilidad: feedback visual de carga, roles y foco.
 */
export function RequireUsername({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Solo verificar si no está cargando y está autenticado
    if (!isLoading && isAuthenticated) {
      if (!user) {
        // Usuario no encontrado, redirigir a auth
        navigate("/auth", { replace: true });
        return;
      }

      if (!user.username) {
        // Usuario sin username, redirigir a setup
        navigate("/setup-username", { 
          replace: true, 
          state: { from: location.pathname } 
        });
        return;
      }
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
    return null;
  }

  // Bloquear renderizado hasta que tenga username
  if (!user.username) {
    return null;
  }

  // Todo correcto, renderizar los children
  return <>{children}</>;
}
