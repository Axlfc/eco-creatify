
import React, { useState, useEffect } from "react";
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


/**
 * ProposalForm.tsx
 *
 * Formulario reutilizable para crear y editar propuestas ciudadanas.
 * - Si recibe una propuesta (prop proposal), actúa en modo edición.
 * - Si no recibe propuesta, actúa en modo creación.
 * - Integra validación de campos, feedback visual y notificaciones mínimas.
 * - Requiere autenticación: obtiene usuario desde useAuth.
 * - Al enviar, llama a la API correspondiente (POST/PUT) y muestra feedback.
 *
 * Uso:
 * <ProposalForm onSuccess={fn} /> // Crear
 * <ProposalForm proposal={propuesta} onSuccess={fn} /> // Editar
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

  useEffect(() => {
    setCharacterCount(description.length);
  }, [description]);


  const validateForm = () => {
    const errors: { title?: string; description?: string; category?: string } = {};
    let isValid = true;
    if (!title.trim()) {
      errors.title = "El título es obligatorio";
      isValid = false;
    } else if (title.length < MIN_TITLE) {
      errors.title = `Mínimo ${MIN_TITLE} caracteres`;
      isValid = false;
    } else if (title.length > MAX_TITLE) {
      errors.title = `Máximo ${MAX_TITLE} caracteres`;
      isValid = false;
    }
    if (!description.trim()) {
      errors.description = "La descripción es obligatoria";
      isValid = false;
    } else if (description.length < MIN_DESC) {
      errors.description = `Mínimo ${MIN_DESC} caracteres`;
      isValid = false;
    } else if (description.length > MAX_DESC) {
      errors.description = `Máximo ${MAX_DESC} caracteres`;
      isValid = false;
    }
    if (!category.trim()) {
      errors.category = 'Selecciona una categoría';
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({ title: 'Debes iniciar sesión', description: 'Inicia sesión para enviar propuestas', variant: 'destructive' });
      return;
    }
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const method = proposal ? 'PUT' : 'POST';
      const url = proposal ? `/api/proposals/${proposal.id}` : '/api/proposals';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token || ''}`,
        },
        body: JSON.stringify({ title, description, category }),
      });
      if (!res.ok) throw new Error('Error en el servidor');
      const data = await res.json();
      toast({
        title: proposal ? 'Propuesta actualizada' : 'Propuesta creada',
        description: proposal ? 'Los cambios han sido guardados.' : 'Tu propuesta ha sido registrada.',
      });
      onSuccess?.(data);
      navigate('/proposals');
    } catch (err) {
      toast({ title: 'Error', description: 'No se pudo guardar la propuesta', variant: 'destructive' });
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
