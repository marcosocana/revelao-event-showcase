import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type LegalDocumentLayoutProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

export const LegalDocumentLayout = ({ title, updated, children }: LegalDocumentLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex items-center gap-4 border-b border-border bg-card p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full" aria-label="Volver">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </header>
      <main className="mx-auto max-w-2xl space-y-6 px-6 py-8">
        <p className="text-sm text-muted-foreground">Última actualización: {updated}</p>
        {children}
      </main>
    </div>
  );
};

export const LegalSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="space-y-4">
    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    <div className="space-y-3 leading-relaxed text-muted-foreground">{children}</div>
  </section>
);
