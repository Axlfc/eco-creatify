
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const UsernameSetupDialog = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, updateUsername } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verificar si necesita configurar username
    const needsSetup = user && !user.username;
    setOpen(needsSetup || false);
  }, [user]);

  const validateUsername = (username: string): string | null => {
    if (!username.trim()) {
      return "El nombre de usuario no puede estar vacío.";
    }
    
    if (username.length < 3 || username.length > 20) {
      return "El nombre de usuario debe tener entre 3 y 20 caracteres.";
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "El nombre de usuario solo puede contener letras, números y guiones bajos.";
    }
    
    return null;
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    
    // Validación local
    const validationError = validateUsername(username);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    if (!user?.id) {
      setErrorMsg("Error de autenticación. Por favor, inicia sesión nuevamente.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Verificar unicidad del username
      const { data: existing, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username.trim())
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existing) {
        setErrorMsg("Este nombre de usuario ya está en uso. Elige otro.");
        return;
      }

      // Actualizar el username en la base de datos
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ username: username.trim() })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      // Actualizar el estado local
      updateUsername(username.trim());

      toast({
        title: "¡Username creado correctamente!",
        description: "Ya puedes usar la plataforma.",
      });

      setOpen(false);

      // Redirigir a la ruta original o al dashboard
      const from = location.state?.from || "/dashboard";
      navigate(from, { replace: true });

    } catch (error: any) {
      console.error("Error creating username:", error);
      setErrorMsg(error.message || "Error desconocido al crear username");
      toast({
        title: "Error",
        description: error.message || "Error al crear el username",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && username.trim()) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>¡Bienvenido! Elige tu nombre de usuario</DialogTitle>
          <DialogDescription>
            Selecciona un nombre de usuario único para comenzar. Esta será tu identidad en la plataforma.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              placeholder="Elige tu nombre de usuario"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errorMsg) setErrorMsg(null); // Limpiar error al escribir
              }}
              onKeyPress={handleKeyPress}
              aria-invalid={!!errorMsg}
              aria-describedby="username-error"
              autoFocus
              disabled={isLoading}
            />
            {errorMsg && (
              <div id="username-error" className="text-red-600 text-sm mt-1" role="alert">
                {errorMsg}
              </div>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !username.trim()}
            className="w-full"
            aria-busy={isLoading}
          >
            {isLoading ? "Guardando..." : "Crear username"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
