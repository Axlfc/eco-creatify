
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import UserProfile from "@/pages/UserProfile";
import Forum from "@/pages/Forum";
import { UsernameSetupDialog } from "@/components/UsernameSetupDialog";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users/:username" element={<UserProfile />} />
          <Route path="/forum" element={<Forum />} />
        </Routes>
        <UsernameSetupDialog />
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
