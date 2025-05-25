/**
 * Página para editar una propuesta existente.
 * Obtiene el id de la URL, carga los datos y renderiza ProposalEditor en modo edición.
 *
 * @todo Integrar con API real y control de autenticación real.
 * @todo Usar layout global si existe.
 */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProposalEditor from "@/components/proposals/ProposalEditor";
import { fetchProposal } from "@/lib/api/proposals";
// TODO: Importar y usar el layout general si existe (ej. AppLayout)
// TODO: Importar hook/contexto de autenticación real

const EditProposalPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposal, setProposal] = useState<any>(null);
  // TODO: Reemplazar por hook/contexto real de autenticación
  const isAuthenticated = true; // Mock temporal

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProposal(id)
      .then((data) => {
        setProposal(data);
        setError(null);
      })
      .catch((err) => {
        setProposal(null);
        setError(err.message || "Error al cargar la propuesta");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!isAuthenticated) {
    return <div className="max-w-xl mx-auto py-8 text-center text-red-600">Debes iniciar sesión para editar una propuesta.</div>;
  }
  if (loading) {
    return <div className="max-w-xl mx-auto py-8 text-center">Cargando propuesta...</div>;
  }
  if (error) {
    return <div className="max-w-xl mx-auto py-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Editar propuesta</h1>
      {/* TODO: Breadcrumbs si aplica */}
      <ProposalEditor proposalId={id!} initialData={proposal} />
    </div>
  );
};

export default EditProposalPage;
