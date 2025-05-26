
import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

// Page imports
import Index from "./pages/Index";
import ProposalCreate from "./pages/ProposalCreate";
import Proposals from "./pages/Proposals";
import ProposalView from "./pages/ProposalView";
import Forum from "./pages/Forum";
import Network from "./pages/Network";
import Jobs from "./pages/Jobs";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import UserProfile from "./pages/UserProfile";
import SetupUsername from "./pages/SetupUsername";

// Proposal-specific routes
import NewProposalPage from "./pages/proposals/new";
import EditProposalPage from "./pages/proposals/[id]/edit";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/setup-username" element={<SetupUsername />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/proposals/new" element={<NewProposalPage />} />
              <Route path="/proposals/create" element={<ProposalCreate />} />
              <Route path="/proposals/:id" element={<ProposalView />} />
              <Route path="/proposals/:id/edit" element={<EditProposalPage />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/network" element={<Network />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/profile/:username" element={<UserProfile />} />
            </Routes>
          </Suspense>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
