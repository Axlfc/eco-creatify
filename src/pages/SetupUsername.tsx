
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { UsernameSetupDialog } from "@/components/UsernameSetupDialog";
import Navigation from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Página dedicada para la creación de username único tras el registro.
 * Accesibilidad: foco automático, roles y feedback visual.
 */
export default function SetupUsername() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si no está autenticado, redirigir a login
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { replace: true });
      return;
    }

    // Si ya tiene username, redirigir al dashboard
    if (!isLoading && isAuthenticated && user?.username) {
      navigate("/dashboard", { replace: true });
      return;
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // Mostrar loading mientras se verifica
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Skeleton className="w-96 h-64" />
        </main>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!isAuthenticated) {
    return null;
  }

  // Si ya tiene username, no mostrar nada (se redirigirá)
  if (user?.username) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center">
        <UsernameSetupDialog />
      </main>
    </div>
  );
}
