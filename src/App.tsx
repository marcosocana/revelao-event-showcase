import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LanguageProvider } from "@/lib/i18n";

const queryClient = new QueryClient();
const Index = lazy(() => import("./pages/Index"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const BlogAdmin = lazy(() => import("./pages/BlogAdmin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const QrEventLanding = lazy(() => import("./pages/QrEventLanding"));
const PruebasLanding = lazy(() => import("./pages/PruebasLanding"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const EventUseCaseLanding = lazy(() => import("./pages/EventUseCaseLanding"));
const DemoEnvironment = lazy(() => import("./pages/DemoEnvironment"));
const TemplateCreator = lazy(() => import("./pages/TemplateCreator"));

const PageFallback = () => <div className="min-h-screen bg-background" />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/evento-qr" element={<QrEventLanding />} />
              <Route path="/en/qr-event" element={<QrEventLanding />} />
              <Route path="/it/evento-qr" element={<QrEventLanding />} />
              <Route path="/bodas/:slug" element={<EventUseCaseLanding />} />
              <Route path="/eventos/:slug" element={<EventUseCaseLanding />} />
              <Route path="/events/:slug" element={<EventUseCaseLanding />} />
              <Route path="/en/events/:slug" element={<EventUseCaseLanding />} />
              <Route path="/it/eventi/:slug" element={<EventUseCaseLanding />} />
              <Route path="/entornodemo" element={<DemoEnvironment />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/en/terms" element={<TermsAndConditions />} />
              <Route path="/en/privacy" element={<PrivacyPolicy />} />
              <Route path="/it/terms" element={<TermsAndConditions />} />
              <Route path="/it/privacy" element={<PrivacyPolicy />} />
              <Route path="/pruebas" element={<PruebasLanding />} />
              <Route path="/blog" element={<Index />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/blog/admin" element={<BlogAdmin />} />
              <Route path="/acceso" element={<Navigate to="https://tomorrow-snap-reveal.vercel.app" replace />} />
              <Route path="/crearplantilla" element={<TemplateCreator />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
