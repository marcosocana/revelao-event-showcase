import type { ReactNode } from "react";
import { LegalHeader } from "@/components/LegalHeader";
import { PageSeo } from "@/components/PageSeo";

type LegalDocumentLayoutProps = {
  title: string;
  updated: string;
  canonicalPath: string;
  description: string;
  children: ReactNode;
};

export const LegalDocumentLayout = ({ title, updated, canonicalPath, description, children }: LegalDocumentLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <PageSeo title={`${title} | Revelao.cam`} description={description} canonicalPath={canonicalPath} />
      <LegalHeader title={title} />
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
