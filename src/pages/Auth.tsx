import { AuthForm } from "@/components/AuthForm";
import { Navigation } from "@/components/Navigation";

const Auth = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <AuthForm />
      </main>
    </div>
  );
};

export default Auth;