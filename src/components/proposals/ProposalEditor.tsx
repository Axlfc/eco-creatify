/**
 * ProposalEditor.tsx
 *
 * Formulario interactivo para crear y editar propuestas ciudadanas.
 * Permite guardar como borrador o publicar, con validación y feedback visual.
 * Modular y reutilizable para creación y edición.
 *
 * Props:
 * - proposalId?: string (si se edita una propuesta existente)
 * - initialData?: Partial<Proposal> (para edición)
 * - onSuccess?: (proposal: Proposal) => void
 *
 * @todo Integrar con backend real y validación backend.
 * @todo Integrar editor markdown/rich text para descripción.
 * @todo Migrar lógica legacy de ProposalForm a este componente y eliminar duplicidad progresivamente.
 */
import React, { useState, useEffect, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useProposals } from "../../hooks/useProposals";
import { NotificationContext } from "../../context/NotificationContext";
// TODO: Importar y usar un componente de tags/autocomplete real

interface ProposalEditorProps {
  proposalId?: string;
  initialData?: {
    title?: string;
    description?: string;
    tags?: string[];
  };
  onSuccess?: (proposal: any) => void;
}

const MAX_TITLE = 100;

const ProposalEditor: React.FC<ProposalEditorProps> = ({ proposalId, initialData = {}, onSuccess }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createProposal, updateProposal, getProposalById } = useProposals();
  const notificationCtx = useContext(NotificationContext);

  // Cargar datos si es edición
  useEffect(() => {
    if (proposalId) {
      // TODO: Cargar datos reales desde API/hook
      const proposal = getProposalById?.(proposalId);
      if (proposal) {
        setTitle(proposal.title);
        setDescription(proposal.description);
        setTags(proposal.tags || []);
      }
    }
  }, [proposalId, getProposalById]);

  // Validación simple
  const validate = () => {
    if (!title.trim()) return "El título es obligatorio";
    if (title.length > MAX_TITLE) return `Máximo ${MAX_TITLE} caracteres en el título`;
    if (!description.trim()) return "La descripción es obligatoria";
    return null;
  };

  // Guardar como borrador
  const handleSaveDraft = async () => {
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsSaving(true);
    try {
      let result;
      if (proposalId) {
        result = await updateProposal({ id: proposalId, title, description, tags, status: 'draft' });
      } else {
        result = await createProposal({ title, description, tags, status: 'draft' });
      }
      notificationCtx?.notify?.({ type: 'success', message: 'Borrador guardado' });
      onSuccess?.(result);
    } catch (err) {
      setError('Error al guardar el borrador');
    } finally {
      setIsSaving(false);
    }
  };

  // Publicar propuesta
  const handlePublish = async () => {
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsPublishing(true);
    try {
      let result;
      if (proposalId) {
        result = await updateProposal({ id: proposalId, title, description, tags, status: 'published' });
      } else {
        result = await createProposal({ title, description, tags, status: 'published' });
      }
      notificationCtx?.notify?.({ type: 'success', message: 'Propuesta publicada' });
      onSuccess?.(result);
    } catch (err) {
      setError('Error al publicar la propuesta');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <form className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label className="block font-medium">Título *</label>
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={MAX_TITLE}
          placeholder="Título claro y específico"
        />
        <div className="text-xs text-gray-500">{title.length}/{MAX_TITLE}</div>
      </div>
      <div>
        <label className="block font-medium">Descripción *</label>
        {/* TODO: Reemplazar por editor markdown/rich text */}
        <Textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe tu propuesta en detalle"
          className="min-h-[120px]"
        />
      </div>
      <div>
        <label className="block font-medium">Tags/Categorías</label>
        {/* TODO: Reemplazar por componente de tags/autocomplete real */}
        <Input
          value={tags.join(", ")}
          onChange={e => setTags(e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
          placeholder="Ej: medioambiente, educación, tecnología"
        />
        <div className="text-xs text-gray-500">Separar por coma</div>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar borrador'}
        </Button>
        <Button type="button" onClick={handlePublish} disabled={isPublishing}>
          {isPublishing ? 'Publicando...' : 'Publicar'}
        </Button>
      </div>
    </form>
  );
};

export default ProposalEditor;
