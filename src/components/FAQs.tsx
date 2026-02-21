import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n, translations } from "@/lib/i18n";

export const FAQs = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  const faqs = t.faqs.items;
  return (
    <section className="py-12 md:py-24 bg-background" id="faqs">
      <div className="container px-4 mx-auto max-w-3xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            {t.faqs.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.faqs.subtitle}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-foreground">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
