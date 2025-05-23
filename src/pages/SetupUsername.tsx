import { UsernameSetupDialog } from "@/components/UsernameSetupDialog";
import Navigation from "@/components/Navigation";

/**
 * Página dedicada para la creación de username único tras el registro.
 * Accesibilidad: foco automático, roles y feedback visual.
 */
export default function SetupUsername() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center">
        <UsernameSetupDialog />
      </main>
    </div>
  );
}
