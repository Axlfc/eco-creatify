
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useMandatoryUsername } from "@/hooks/use-mandatory-username";
import Navigation from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Página dedicada para la creación de username único tras el registro.
 * SOLO accesible si el usuario está autenticado pero no tiene username.
 * Se muestra el modal automáticamente en cualquier caso.
 */
export default function SetupUsername() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { recheckUsername } = useMandatoryUsername();
  const navigate = useNavigate();

  // Force modal to show whenever this page is accessed
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Trigger the username check which will show the modal if needed
      recheckUsername();
    }
  }, [isAuthenticated, isLoading, recheckUsername]);

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

  // Usuario autenticado sin username: mostrar página con mensaje
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Configuración de Username</h1>
          <p className="text-muted-foreground mb-4">
            Para continuar usando la plataforma, necesitas elegir un nombre de usuario único.
          </p>
          <p className="text-sm text-amber-600">
            Por favor completa el formulario en la ventana emergente.
            No podrás cerrar esta ventana sin elegir un username.
          </p>
        </div>
      </main>
    </div>
  );
}
