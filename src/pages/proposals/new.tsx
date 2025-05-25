/**
 * Página para crear una nueva propuesta ciudadana.
 * Renderiza el componente ProposalEditor en modo creación.
 * Controla autenticación y muestra layout general.
 *
 * @todo Integrar con sistema de rutas y layout global.
 * @todo Redirigir o mostrar error si el usuario no está autenticado.
 */
import React from "react";
import ProposalEditor from "@/components/proposals/ProposalEditor";
// TODO: Importar y usar el layout general si existe (ej. AppLayout)
// TODO: Importar hook/contexto de autenticación real

const NewProposalPage: React.FC = () => {
  // TODO: Reemplazar por hook/contexto real de autenticación
  const isAuthenticated = true; // Mock temporal

  if (!isAuthenticated) {
    return <div className="max-w-xl mx-auto py-8 text-center text-red-600">Debes iniciar sesión para crear una propuesta.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Nueva propuesta</h1>
      {/* TODO: Breadcrumbs si aplica */}
      <ProposalEditor />
    </div>
  );
};

export default NewProposalPage;
