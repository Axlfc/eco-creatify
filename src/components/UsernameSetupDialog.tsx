import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

export const UsernameSetupDialog = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUsername = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session.user.id)
        .single();

      if (!profile?.username) {
        setOpen(true);
      }
    };

    checkUsername();
  }, []);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!username.trim()) {
      setErrorMsg("El nombre de usuario no puede estar vacío.");
      return;
    }
    setIsLoading(true);
    try {
      // Validar unicidad del username
      const { data: existing, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username.trim())
        .maybeSingle();
      if (checkError) throw checkError;
      if (existing) {
        setErrorMsg("Este nombre de usuario ya está en uso. Elige otro.");
        setIsLoading(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");
      const { error } = await supabase
        .from("profiles")
        .update({ username: username.trim() })
        .eq("id", session.user.id);
      if (error) throw error;
      toast({
        title: "Username creado correctamente",
        description: "Ya puedes usar la plataforma.",
      });
      setOpen(false);
      navigate("/dashboard");
    } catch (error: any) {
      setErrorMsg(error.message || "Error desconocido al crear username");
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome! Choose your username</DialogTitle>
          <DialogDescription>
            Pick a unique username to get started. This will be your identity on the platform.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              placeholder="Elige tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={!!errorMsg}
              aria-describedby="username-error"
              autoFocus
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