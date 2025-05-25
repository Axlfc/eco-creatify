import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Check, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useProposals } from '../../hooks/useProposals';
import { NotificationContext } from '../../context/NotificationContext';
import { validateProposal } from '@/utils/validation';


/**
 * ProposalForm.tsx
 *
 * Formulario reutilizable para crear y editar propuestas ciudadanas.
 * - Si recibe una propuesta (prop proposal), actúa en modo edición.
 * - Si no recibe propuesta, actúa en modo creación.
 * - Integra validación de campos, feedback visual y notificaciones.
 * - Requiere autenticación: obtiene usuario desde useAuth.
 * - Al enviar, llama a la API correspondiente (POST/PUT) y muestra feedback.
 *
 * Uso:
 * <ProposalForm onSuccess={fn} /> // Crear
 * <ProposalForm proposal={propuesta} onSuccess={fn} /> // Editar
 *
 * @todo Integrar con backend real y smart contract (Web3) cuando esté disponible.
 * @todo Migrar lógica legacy de formularios de propuestas a este componente y eliminar duplicidad progresivamente.
 */

const categories = [
  "Environment",
  "Education",
  "Technology",
  "Governance",
  "Community",
  "Infrastructure",
  "Culture",
  "Health",
  "Safety"
];


import { useAuth } from '@/hooks/use-auth';

export interface Proposal {
  id?: string;
  title: string;
  description: string;
  category?: string;
}

interface ProposalFormProps {
  proposal?: Proposal;
  onSuccess?: (proposal: Proposal) => void;
}

const MIN_TITLE = 10;
const MIN_DESC = 50;
const MAX_TITLE = 120;
const MAX_DESC = 2000;

const ProposalForm: React.FC<ProposalFormProps> = ({ proposal, onSuccess }) => {
  const { isAuthenticated, user } = useAuth();
  const [title, setTitle] = useState(proposal?.title || "");
  const [description, setDescription] = useState(proposal?.description || "");
  const [category, setCategory] = useState(proposal?.category || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [characterCount, setCharacterCount] = useState(description.length);
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    description?: string;
    category?: string;
  }>({});

  const navigate = useNavigate();
  const { toast } = useToast();
  const { createProposal, updateProposal } = useProposals(); // TODO: Implementar lógica real en useProposals
  const notificationCtx = useContext(NotificationContext); // Para feedback global

  useEffect(() => {
    setCharacterCount(description.length);
  }, [description]);


  const validateForm = () => {
    // Validación reutilizable frontend/backend
    const { isValid, errors } = validateProposal({ title, description, category });
    setFormErrors(errors);
    return isValid;
  };

  /**
   * Envía una propuesta a la API REST para crearla (POST) o actualizarla (PUT).
   * Si la API no está disponible, usa mocks legacy.
   * Maneja errores de validación y feedback visual.
   * @param proposalData Datos de la propuesta a guardar
   * @param isEdit true si es edición (PUT), false si creación (POST)
   * @returns La propuesta guardada o error de validación
   */
  async function saveProposalAPI(proposalData: Proposal, isEdit: boolean): Promise<{ proposal?: Proposal; errors?: any; errorMessage?: string }> {
    // Validación previa frontend antes de enviar
    const { isValid, errors } = validateProposal(proposalData);
    if (!isValid) return { errors };
    try {
      const url = isEdit ? `/api/proposals/${proposalData.id}` : '/api/proposals';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // TODO: Añadir token de autenticación si está disponible
        },
        body: JSON.stringify(proposalData),
      });
      const data = await res.json();
      if (!res.ok) {
        // Errores de validación backend
        if (data && data.errors) {
          return { errors: data.errors };
        }
        return { errorMessage: data?.message || 'Error desconocido en el servidor' };
      }
      // Validación extra tras respuesta backend
      const backendValidation = validateProposal(data.proposal || data);
      if (!backendValidation.isValid) {
        return { errors: backendValidation.errors };
      }
      return { proposal: data.proposal || data };
    } catch (err: any) {
      // Fallback a mocks si la API no responde
      // TODO: Integrar fallback a mocks legacy si es necesario (usar variable de entorno pública o contexto)
      // Por ahora, solo devolvemos error de conexión
      return { errorMessage: 'No se pudo conectar con el servidor' };
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setFormErrors({});
    try {
      // Control de permisos: solo el autor puede editar (TODO)
      // TODO: Integrar control de permisos y autenticación real
      const { proposal: savedProposal, errors, errorMessage } = await saveProposalAPI(
        { ...proposal, title, description, category },
        Boolean(proposal?.id)
      );
      if (errors) {
        setFormErrors(errors);
        notificationCtx?.notify({ type: 'error', message: 'Corrige los errores del formulario' });
        return;
      }
      if (errorMessage) {
        setFormErrors({ title: errorMessage });
        notificationCtx?.notify({ type: 'error', message: errorMessage });
        return;
      }
      notificationCtx?.notify({
        type: 'success',
        message: proposal?.id ? 'Propuesta actualizada' : 'Propuesta creada',
      });
      onSuccess?.(savedProposal!);
      // Redirigir al detalle de la propuesta tras éxito
      navigate(`/proposals/${savedProposal?.id}`);
    } catch (err) {
      setFormErrors({ title: 'Error al guardar la propuesta' });
      notificationCtx?.notify({ type: 'error', message: 'Error al guardar la propuesta' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCharacterCountColor = () => {
    if (characterCount < 500) return "text-red-500";
    if (characterCount > 900) return "text-amber-500";
    return "text-green-500";
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">
          {proposal ? 'Editar propuesta' : 'Crear nueva propuesta'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Proposal Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título claro y específico"
                className={formErrors.title ? "border-red-500" : ""}
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formErrors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="description">Proposal Description (500-1000 characters)</Label>
                <span className={`text-sm ${getCharacterCountColor()}`}>
                  {characterCount}/1000
                </span>
              </div>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe tu propuesta en detalle, incluyendo propósito, beneficios e implementación"
                className={`min-h-32 ${formErrors.description ? "border-red-500" : ""}`}
              />
              {formErrors.description ? (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formErrors.description}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm flex items-center mt-1">
                  <Info className="h-4 w-4 mr-1" />
                  Sé conciso pero proporciona suficiente detalle para que otros puedan entender y evaluar tu propuesta
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className={formErrors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.category && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formErrors.category}
                </p>
              )}
            </div>
          </div>

          <div className="bg-muted/40 p-4 rounded-md border border-border/50">
            <h4 className="font-medium mb-2 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Proposal Process
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>After submission, your proposal enters a 24-hour presentation phase</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>This is followed by a 72-hour structured discussion phase</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>Finally, a 48-hour weighted voting phase determines the outcome</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate("/proposals")}> 
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (proposal ? 'Guardando...' : 'Enviando...') : (proposal ? 'Guardar cambios' : 'Crear propuesta')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProposalForm;

/*
TODOs:
- Control de permisos: solo el autor puede editar/eliminar la propuesta. Validar user.id === proposal.createdBy antes de permitir edición o borrado.
- Mostrar feedback visual específico si el usuario no tiene permisos para editar.
- Añadir tests automáticos (Jest/React Testing Library) para los flujos: creación, edición, error de red, error de validación, sin permisos.
- Documentar edge cases detectados y sugerencias para siguientes sprints.
- TODO: Llamar a addProposalHistory en el backend tras cada edición exitosa (PUT /api/proposals/:id)
- TODO: Llamar a fetchProposalHistory en el frontend tras cada edición exitosa para refrescar el historial
- TODO: Validar que sólo el autor o moderadores puedan editar/eliminar propuestas y ver historial completo
*/
