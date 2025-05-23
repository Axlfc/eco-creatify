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
    if (!isLoading && isAuthenticated && user && !user.username) {
      // Guarda la ruta original para redirigir después
      navigate("/setup-username", { replace: true, state: { from: location.pathname } });
    }
  }, [isLoading, isAuthenticated, user, navigate, location]);

  if (isLoading) {
    return (
      <div role="status" aria-busy="true" tabIndex={-1} className="flex justify-center items-center min-h-screen focus:outline-none">
        <Skeleton className="w-32 h-8" />
        <span className="sr-only">Cargando...</span>
      </div>
    );
  }
  if (!user || !isAuthenticated) {
    // Bloquea acceso si no está autenticado
    return null;
  }
  if (!user.username) {
    // Bloquea renderizado hasta que tenga username
    return null;
  }
  return <>{children}</>;
}
