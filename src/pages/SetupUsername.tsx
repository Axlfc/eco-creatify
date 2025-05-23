
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { UsernameSetupDialog } from "@/components/UsernameSetupDialog";
import Navigation from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Página dedicada para la creación de username único tras el registro.
 * SOLO accesible si el usuario está autenticado pero no tiene username.
 */
export default function SetupUsername() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si aún está cargando, esperar
    if (isLoading) {
      return;
    }

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated || !user) {
      console.log('SetupUsername: Not authenticated, redirecting to auth');
      navigate("/auth", { replace: true });
      return;
    }

    // Si ya tiene username, redirigir al dashboard
    if (user.username) {
      console.log('SetupUsername: User already has username, redirecting to dashboard');
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
  if (!isAuthenticated || !user) {
    return null;
  }

  // Si ya tiene username, no mostrar nada (se redirigirá)
  if (user.username) {
    return null;
  }

  // Usuario autenticado sin username: mostrar el diálogo
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center">
        <UsernameSetupDialog />
      </main>
    </div>
  );
}
