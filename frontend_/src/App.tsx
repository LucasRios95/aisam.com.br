import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Aisam from "./pages/Aisam";
import Associados from "./pages/Associados";
import Diretoria from "./pages/Diretoria";
import ConsultoriaJuridica from "./pages/ConsultoriaJuridica";
import Servicos from "./pages/Servicos";
import AssocieSe from "./pages/AssocieSe";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/aisam" element={<Aisam />} />
          <Route path="/associados" element={<Associados />} />
          <Route path="/diretoria" element={<Diretoria />} />
          <Route path="/consultoria-juridica" element={<ConsultoriaJuridica />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/associe-se" element={<AssocieSe />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
