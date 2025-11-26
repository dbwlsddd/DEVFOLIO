// [업로드된 파일: dbwlsddd/devfolio/DEVFOLIO-dbb00499082e35b2b5d54ff0d97aa50d78692051/client/App.tsx]
import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PortfolioDetail from "./pages/PortfolioDetail";
import NotFound from "./pages/NotFound";
import CreateEditPortfolio from "./pages/CreateEditPortfolio"; // 새로 추가

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/portfolio/:id" element={<PortfolioDetail />} />
          <Route path="/portfolio/create" element={<CreateEditPortfolio />} />
          <Route path="/portfolio/edit/:id" element={<CreateEditPortfolio />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);