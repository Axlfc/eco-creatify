/**
 * LEGACY - Página de inicio de sesión/autenticación (rutas).
 *
 * TODO: Preparar integración con AuthContext global y migrar lógica a nuevo sistema modular si es necesario.
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <AuthForm />
    </div>
  );
};

export default Auth;