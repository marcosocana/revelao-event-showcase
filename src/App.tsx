import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import BlogDetail from "./pages/BlogDetail";
import BlogAdmin from "./pages/BlogAdmin";
import NotFound from "./pages/NotFound";
import QrEventLanding from "./pages/QrEventLanding";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LanguageProvider } from "@/lib/i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/evento-qr" element={<QrEventLanding />} />
            <Route path="/en/qr-event" element={<QrEventLanding />} />
            <Route path="/it/evento-qr" element={<QrEventLanding />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/blog/admin" element={<BlogAdmin />} />
            <Route path="/acceso" element={<Navigate to="https://tomorrow-snap-reveal.vercel.app" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
