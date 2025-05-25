/**
 * LEGACY - Archivo principal de rutas y providers globales.
 *
 * TODO: Centralizar y migrar rutas a un sistema modular si crecen los módulos.
 * TODO: Integrar nuevos contextos globales (SidebarContext, NotificationContext, AuthContext) aquí para máxima escalabilidad.
 * TODO: Preparar integración de lógica Web3 (Ethers.js) en rutas de proposals/consensus y jobs/network.
 * TODO: Marcar rutas legacy/deprecated si se reemplazan por nuevas páginas.
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { UsernameGuard } from "@/components/UsernameGuard";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import UserProfile from "@/pages/UserProfile";
import Forum from "@/pages/Forum";
import Proposals from "@/pages/Proposals";
import NewProposalPage from "@/pages/proposals/NewProposal";
import EditProposalPage from "@/pages/proposals/EditProposal";
import ProposalView from "@/pages/ProposalView";
import ProposalConsensus from "@/pages/ProposalConsensus";
import SetupUsername from "@/pages/SetupUsername";
import { RequireUsername } from "@/components/RequireUsername";
import ForumPage from "@/pages/ForumPage";
import ProposalsPage from "@/pages/ProposalsPage";
import ConsensusPage from "@/pages/ConsensusPage";
import DashboardPage from "@/pages/DashboardPage";
import UserProfilePage from "@/pages/UserProfilePage";
import JobsPage from "@/pages/JobsPage";
import NetworkPage from "@/pages/NetworkPage";
import { SidebarContext } from "@/context/SidebarContext";
import { NotificationContext } from "@/context/NotificationContext";
// TODO: Importar y envolver con AuthContext cuando esté disponible
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <SidebarContext.Provider value={null}> {/* TODO: Implementar provider real y lógica de sidebar */}
      <NotificationContext.Provider value={null}> {/* TODO: Implementar provider real y lógica de notificaciones */}
        {/* TODO: Envolver con AuthContext.Provider cuando esté disponible */}
        <QueryClientProvider client={queryClient}>
          <Router>
            <UsernameGuard>
              <Routes>
                {/* LEGACY: Rutas antiguas, mantener hasta migración completa */}
                <Route path="/forum" element={<Forum />} /> {/* TODO: Deprecated, migrar a ForumPage */}
                <Route path="/proposals" element={<Proposals />} /> {/* TODO: Deprecated, migrar a ProposalsPage */}
                <Route path="/proposals/consensus" element={<ProposalConsensus />} /> {/* TODO: Deprecated, migrar a ConsensusPage */}
                <Route path="/dashboard" element={<Dashboard />} /> {/* TODO: Deprecated, migrar a DashboardPage */}
                <Route path="/users/:username" element={<UserProfile />} /> {/* TODO: Deprecated, migrar a UserProfilePage */}
                {/* NUEVAS RUTAS: Scaffolded, integración progresiva */}
                <Route path="/forum/new" element={<ForumPage />} />
                <Route path="/proposals/new" element={<ProposalsPage />} />
                <Route path="/proposals/consensus/new" element={<ConsensusPage />} />
                <Route path="/dashboard/new" element={<DashboardPage />} />
                <Route path="/users/:username/new" element={<UserProfilePage />} />
                <Route path="/jobs" element={<JobsPage />} /> {/* TODO: Integrar Web3/Ethers.js aquí */}
                <Route path="/network" element={<NetworkPage />} /> {/* TODO: Integrar Web3/Ethers.js aquí */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/setup-username" element={<SetupUsername />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/proposals" element={<Proposals />} />
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
                <Route path="/proposals/new" element={
                  <RequireUsername>
                    <NewProposalPage />
                  </RequireUsername>
                } />
                <Route path="/proposals/:id/edit" element={
                  <RequireUsername>
                    <EditProposalPage />
                  </RequireUsername>
                } />
                <Route path="/forum-page" element={<ForumPage />} />
                <Route path="/proposals-page" element={<ProposalsPage />} />
                <Route path="/consensus-page" element={<ConsensusPage />} />
                <Route path="/dashboard-page" element={<DashboardPage />} />
                <Route path="/user-profile-page" element={<UserProfilePage />} />
                <Route path="/jobs-page" element={<JobsPage />} />
                <Route path="/network-page" element={<NetworkPage />} />
              </Routes>
            </UsernameGuard>
            <Toaster />
          </Router>
        </QueryClientProvider>
      </NotificationContext.Provider>
    </SidebarContext.Provider>
  );
}

export default App;
