
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import UserProfile from "@/pages/UserProfile";
import Forum from "@/pages/Forum";
import Proposals from "@/pages/Proposals";
import ProposalCreate from "@/pages/ProposalCreate";
import ProposalView from "@/pages/ProposalView";
import ProposalConsensus from "@/pages/ProposalConsensus";
import SetupUsername from "@/pages/SetupUsername";
import { RequireUsername } from "@/components/RequireUsername";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/setup-username" element={<SetupUsername />} />
          <Route path="/forum" element={
            <RequireUsername>
              <Forum />
            </RequireUsername>
          } />
          <Route path="/proposals" element={
            <RequireUsername>
              <Proposals />
            </RequireUsername>
          } />
          <Route path="/proposals/:id" element={
            <RequireUsername>
              <ProposalView />
            </RequireUsername>
          } />
          <Route path="/proposals/consensus" element={
            <RequireUsername>
              <ProposalConsensus />
            </RequireUsername>
          } />
          <Route path="/users/:username" element={
            <RequireUsername>
              <UserProfile />
            </RequireUsername>
          } />
          <Route path="/dashboard" element={
            <RequireUsername>
              <Dashboard />
            </RequireUsername>
          } />
          <Route path="/proposals/create" element={
            <RequireUsername>
              <ProposalCreate />
            </RequireUsername>
          } />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
