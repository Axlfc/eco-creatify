
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { LogOut, AlertCircle, CheckCircle2 } from "lucide-react";

interface MandatoryUsernameModalProps {
  open: boolean;
  onUsernameSet: (username: string) => void;
}

export const MandatoryUsernameModal = ({ open, onUsernameSet }: MandatoryUsernameModalProps) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalStartTime = useRef<number>(Date.now());

  // Auto-focus en el input cuando se abre el modal
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Auto-logout después de 2 minutos de inactividad
  useEffect(() => {
    if (open) {
      modalStartTime.current = Date.now();
      const autoLogoutTimer = setTimeout(() => {
        toast({
          title: "Sesión cerrada por inactividad",
          description: "Debes elegir un username para continuar",
          variant: "destructive",
        });
        handleForceLogout();
      }, 120000); // 2 minutos

      return () => clearTimeout(autoLogoutTimer);
    }
  }, [open]);

  const validateUsername = (username: string): string | null => {
    if (!username.trim()) {
      return "El nombre de usuario no puede estar vacío.";
    }
    
    if (username.length < 3 || username.length > 20) {
      return "El nombre de usuario debe tener entre 3 y 20 caracteres.";
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Solo se permiten letras, números y guiones bajos.";
    }
    
    return null;
  };

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck.trim()) {
      setIsAvailable(null);
      return;
    }

    const validationError = validateUsername(usernameToCheck);
    if (validationError) {
      setErrorMsg(validationError);
      setIsAvailable(false);
      return;
    }

    setIsValidating(true);
    setErrorMsg(null);

    try {
      const { data: existing, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", usernameToCheck.trim())
        .maybeSingle();

      if (error) {
        console.error("Error checking username:", error);
        setErrorMsg("Error al verificar disponibilidad. Intenta de nuevo.");
        setIsAvailable(false);
        return;
      }

      if (existing) {
        setErrorMsg("Este nombre de usuario ya está en uso.");
        setIsAvailable(false);
      } else {
        setErrorMsg(null);
        setIsAvailable(true);
      }
    } catch (error) {
      console.error("Error checking username availability:", error);
      setErrorMsg("Error de conexión. Intenta de nuevo.");
      setIsAvailable(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setIsAvailable(null);
    setErrorMsg(null);
    
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout for validation
    const newTimeoutId = setTimeout(() => {
      checkUsernameAvailability(value);
    }, 500);
    
    setTimeoutId(newTimeoutId);
  };

  const handleSubmit = async () => {
    if (!user?.id || !username.trim() || !isAvailable) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Double-check availability before saving
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
        setIsAvailable(false);
        return;
      }

      // Save username
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ username: username.trim() })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "¡Username creado correctamente!",
        description: "Ya puedes usar todas las funcionalidades de la plataforma.",
      });

      // Notify parent component
      onUsernameSet(username.trim());

    } catch (error: any) {
      console.error("Error saving username:", error);
      setErrorMsg(error.message || "Error al guardar el username");
      toast({
        title: "Error",
        description: error.message || "Error al crear el username",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceLogout = async () => {
    toast({
      title: "Sesión cerrada",
      description: "Debes elegir un username para usar la plataforma",
      variant: "destructive",
    });
    
    await signOut();
    navigate("/auth", { replace: true });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && username.trim() && isAvailable) {
      handleSubmit();
    }
    
    // Prevent closing modal with Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Prevent modal from being closed
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // User tried to close modal - force logout
      handleForceLogout();
    }
  };

  const getUsernameStatusIcon = () => {
    if (isValidating) {
      return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
    }
    if (errorMsg) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    if (isAvailable) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]" 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="mandatory-username-title"
        aria-describedby="mandatory-username-description"
      >
        <DialogHeader>
          <DialogTitle id="mandatory-username-title" className="text-xl font-semibold text-center">
            ¡Elige tu nombre de usuario!
          </DialogTitle>
          <DialogDescription id="mandatory-username-description" className="text-center space-y-2">
            <span className="block">
              Para completar tu cuenta y participar en la plataforma necesitas elegir un nombre de usuario único.
            </span>
            <span className="block text-sm text-amber-600 font-medium">
              ⚠️ Si no completas este paso, tu sesión se cerrará automáticamente.
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Nombre de usuario *
            </Label>
            <div className="relative">
              <Input
                ref={inputRef}
                id="username"
                placeholder="Elige tu nombre de usuario"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                onKeyDown={handleKeyPress}
                aria-invalid={!!errorMsg}
                aria-describedby="username-error username-help"
                disabled={isLoading}
                className={`pr-10 ${errorMsg ? 'border-red-500' : isAvailable ? 'border-green-500' : ''}`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getUsernameStatusIcon()}
              </div>
            </div>
            
            <div id="username-help" className="text-xs text-muted-foreground">
              3-20 caracteres, solo letras, números y guiones bajos
            </div>
            
            {errorMsg && (
              <div id="username-error" className="text-red-600 text-sm" role="alert">
                {errorMsg}
              </div>
            )}
            
            {isAvailable && (
              <div className="text-green-600 text-sm">
                ✅ Username disponible
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !username.trim() || !isAvailable || isValidating}
              className="flex-1"
              aria-busy={isLoading}
            >
              {isLoading ? "Guardando..." : "Crear username"}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleForceLogout}
              disabled={isLoading}
              className="px-3"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs text-center text-muted-foreground border-t pt-3">
            Este modal no se puede cerrar sin completar el username.
            <br />
            Si prefieres salir, usa el botón de cerrar sesión.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
