
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
import { LogOut, AlertCircle, CheckCircle2, Shield } from "lucide-react";

interface MandatoryUsernameModalProps {
  open: boolean;
  onUsernameSet: (username: string) => void;
  onCloseAttempt: () => void;
  onError: () => void;
  requiresCaptcha?: boolean;
  attemptCount?: number;
}

export const MandatoryUsernameModal = ({ 
  open, 
  onUsernameSet, 
  onCloseAttempt,
  onError,
  requiresCaptcha = false,
  attemptCount = 0
}: MandatoryUsernameModalProps) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const { toast } = useToast();
  const { user, forceLogout } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalStartTime = useRef<number>(Date.now());

  // Ensure modal visibility matches props
  useEffect(() => {
    if (open) {
      setModalVisible(true);
    }
  }, [open]);

  // Auto-focus en el input cuando se abre el modal
  useEffect(() => {
    if (modalVisible && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [modalVisible]);

  // Auto-logout después de 3 minutos de inactividad
  useEffect(() => {
    if (modalVisible) {
      modalStartTime.current = Date.now();
      const autoLogoutTimer = setTimeout(() => {
        toast({
          title: "Sesión cerrada por inactividad",
          description: "Debes elegir un username para continuar",
          variant: "destructive",
        });
        handleForceLogout();
      }, 180000); // 3 minutos

      return () => clearTimeout(autoLogoutTimer);
    }
  }, [modalVisible]);

  // Reset captcha verification when requirements change
  useEffect(() => {
    if (!requiresCaptcha) {
      setCaptchaVerified(false);
    }
  }, [requiresCaptcha]);

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
        onError();
      } else {
        setErrorMsg(null);
        setIsAvailable(true);
      }
    } catch (error) {
      console.error("Error checking username availability:", error);
      setErrorMsg("Error de conexión. Intenta de nuevo.");
      setIsAvailable(false);
      onError();
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

  const handleCaptchaComplete = () => {
    setCaptchaVerified(true);
    toast({
      title: "Verificación completada",
      description: "Ahora puedes continuar con la selección de username",
    });
  };

  const handleSubmit = async () => {
    if (!user?.id || !username.trim() || !isAvailable) {
      return;
    }

    // Check captcha requirement
    if (requiresCaptcha && !captchaVerified) {
      toast({
        title: "Verificación requerida",
        description: "Completa la verificación anti-spam para continuar",
        variant: "destructive",
      });
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
        onError();
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
      setModalVisible(false);

    } catch (error: any) {
      console.error("Error saving username:", error);
      setErrorMsg(error.message || "Error al guardar el username");
      toast({
        title: "Error",
        description: error.message || "Error al crear el username",
        variant: "destructive",
      });
      onError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceLogout = async () => {
    toast({
      title: "Sesión cerrada por seguridad",
      description: "Debes elegir un username para usar la plataforma",
      variant: "destructive",
    });
    
    onCloseAttempt();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && username.trim() && isAvailable && (!requiresCaptcha || captchaVerified)) {
      handleSubmit();
    }
    
    // Prevent closing modal with Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onCloseAttempt();
    }
  };

  // Prevent modal from being closed - FORCE LOGOUT
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Prevent closing - instead trigger the force logout
      onCloseAttempt();
      e.preventDefault();
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

  // Simple captcha simulation (in production, use real captcha service)
  const SimpleCaptcha = () => {
    const [captchaAnswer, setCaptchaAnswer] = useState("");
    const [captchaQuestion] = useState(() => {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const operation = Math.random() > 0.5 ? '+' : '-';
      const answer = operation === '+' ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2);
      return { question: `${Math.max(num1, num2)} ${operation} ${Math.min(num1, num2)}`, answer: answer.toString() };
    });

    const handleCaptchaSubmit = () => {
      if (captchaAnswer === captchaQuestion.answer) {
        handleCaptchaComplete();
      } else {
        toast({
          title: "Respuesta incorrecta",
          description: "Intenta resolver la operación de nuevo",
          variant: "destructive",
        });
        setCaptchaAnswer("");
      }
    };

    return (
      <div className="border rounded p-3 bg-muted/50">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium">Verificación anti-spam</span>
        </div>
        <p className="text-sm mb-2">Resuelve: {captchaQuestion.question} = ?</p>
        <div className="flex gap-2">
          <Input
            value={captchaAnswer}
            onChange={(e) => setCaptchaAnswer(e.target.value)}
            placeholder="Respuesta"
            className="w-20"
          />
          <Button size="sm" onClick={handleCaptchaSubmit}>
            Verificar
          </Button>
        </div>
      </div>
    );
  };

  // If the modal is not open, don't render it
  if (!open && !modalVisible) {
    return null;
  }

  return (
    <>
      {/* Global overlay to block all interactions */}
      <div 
        className="username-modal-overlay"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />

      <Dialog 
        open={true} 
        onOpenChange={(open) => {
          if (!open) {
            onCloseAttempt();
          }
        }}
      >
        <DialogContent 
          className="username-modal sm:max-w-[425px] z-[1001]" 
          onInteractOutside={(e) => {
            e.preventDefault();
            onCloseAttempt();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCloseAttempt();
          }}
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
                ⚠️ Si no completas este paso o intentas cerrar esta ventana, tu sesión se cerrará automáticamente por seguridad.
              </span>
              {attemptCount > 0 && (
                <span className="block text-xs text-red-600">
                  Intentos fallidos: {attemptCount}/3
                </span>
              )}
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
                  aria-required="true"
                  autoFocus
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

            {requiresCaptcha && !captchaVerified && (
              <SimpleCaptcha />
            )}

            {requiresCaptcha && captchaVerified && (
              <div className="text-green-600 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Verificación anti-spam completada
              </div>
            )}
            
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSubmit}
                disabled={
                  isLoading || 
                  !username.trim() || 
                  !isAvailable || 
                  isValidating ||
                  (requiresCaptcha && !captchaVerified)
                }
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
              <br />
              <strong>Cualquier intento de bypass resultará en cierre automático de sesión.</strong>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
