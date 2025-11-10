import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import Aisam from "./pages/Aisam";
import Associados from "./pages/Associados";
import Diretoria from "./pages/Diretoria";
import ConsultoriaJuridica from "./pages/ConsultoriaJuridica";
import Servicos from "./pages/Servicos";
import AssocieSe from "./pages/AssocieSe";
import LinksUteis from "./pages/LinksUteis";
import Noticias from "./pages/Noticias";
import Login from "./pages/Login";
import Contato from "./pages/Contato";
import Dashboard from "./pages/Dashboard";
import Vagas from "./pages/Vagas";
import AdminUsers from "./pages/AdminUsers";
import MeuCurriculo from "./pages/MeuCurriculo";
import PublicarVaga from "./pages/PublicarVaga";
import Jaisam from "./pages/Jaisam";
import NotFound from "./pages/NotFound";
import VagaDetalhes from "./pages/VagaDetalhes";
import MinhasCandidaturas from "./pages/MinhasCandidaturas";
import CandidatoAcesso from "./pages/CandidatoAcesso";
import AceitarConviteRecrutador from "./pages/AceitarConviteRecrutador";
import Relatorios from "./pages/Relatorios";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <WhatsAppButton />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/aisam" element={<Aisam />} />
          <Route path="/associados" element={<Associados />} />
          <Route path="/diretoria" element={<Diretoria />} />
          <Route path="/consultoria-juridica" element={<ConsultoriaJuridica />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/associe-se" element={<AssocieSe />} />
          <Route path="/links-uteis" element={<LinksUteis />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vagas" element={<Vagas />} />
          <Route path="/vaga/:id" element={<VagaDetalhes />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/meu-curriculo" element={<MeuCurriculo />} />
          <Route path="/publicar-vaga" element={<PublicarVaga />} />
          <Route path="/jaisam" element={<Jaisam />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/minhas-candidaturas" element={<MinhasCandidaturas />} />
          <Route path="/candidato/acesso" element={<CandidatoAcesso />} />
          <Route path="/aceitar-convite/:token" element={<AceitarConviteRecrutador />} />
          <Route path="/relatorios" element={<Relatorios />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
