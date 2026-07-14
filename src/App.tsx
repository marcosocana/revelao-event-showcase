import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Analytics } from "@/components/Analytics";
import { CookieBanner } from "@/components/CookieBanner";
import { LanguageProvider } from "@/lib/i18n";

const queryClient = new QueryClient();
const Index = lazy(() => import("./pages/Index"));
const BlogHub = lazy(() => import("./pages/BlogHub"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const BlogAdmin = lazy(() => import("./pages/BlogAdmin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const QrEventLanding = lazy(() => import("./pages/QrEventLanding"));
const PruebasLanding = lazy(() => import("./pages/PruebasLanding"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const EventUseCaseLanding = lazy(() => import("./pages/EventUseCaseLanding"));
const DemoEnvironment = lazy(() => import("./pages/DemoEnvironment"));
const TemplateCreator = lazy(() => import("./pages/TemplateCreator"));
const CaptainsLanding = lazy(() => import("./pages/CaptainsLanding"));
const CaptainsSeoLanding = lazy(() => import("./pages/CaptainsSeoLanding"));

const PageFallback = () => <div className="min-h-screen bg-background" />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Analytics />
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
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/en/terms" element={<TermsAndConditions />} />
              <Route path="/en/privacy" element={<PrivacyPolicy />} />
              <Route path="/en/cookies" element={<CookiePolicy />} />
              <Route path="/it/terms" element={<TermsAndConditions />} />
              <Route path="/it/privacy" element={<PrivacyPolicy />} />
              <Route path="/it/cookies" element={<CookiePolicy />} />
              <Route path="/pruebas" element={<PruebasLanding />} />
              <Route path="/capitanes" element={<CaptainsLanding />} />
              <Route path="/capitanes-de-mesa-boda" element={<CaptainsSeoLanding />} />
              <Route path="/juegos-para-invitados-de-boda" element={<CaptainsSeoLanding />} />
              <Route path="/juegos-para-mesas-de-boda" element={<CaptainsSeoLanding />} />
              <Route path="/retos-para-bodas" element={<CaptainsSeoLanding />} />
              <Route path="/ideas-capitanes-de-mesa" element={<CaptainsSeoLanding />} />
              <Route path="/plantilla-capitan-de-mesa" element={<CaptainsSeoLanding />} />
              <Route path="/tarjeta-capitan-de-mesa" element={<CaptainsSeoLanding />} />
              <Route path="/blog" element={<BlogHub />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/blog/admin" element={<BlogAdmin />} />
              <Route path="/acceso" element={<Navigate to="https://tomorrow-snap-reveal.vercel.app" replace />} />
              <Route path="/crearplantilla" element={<TemplateCreator />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CookieBanner />
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
