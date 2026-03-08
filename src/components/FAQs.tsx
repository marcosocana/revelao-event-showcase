import { useMemo, useState } from "react";
import { useI18n, translations } from "@/lib/i18n";

type FAQsProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  items?: Array<{ q: string; a: string }>;
};

export const FAQs = ({ className, title, subtitle, items: itemsOverride }: FAQsProps) => {
  const { lang } = useI18n();
  const t = translations[lang];
  const faqs = itemsOverride ?? t.faqs.items;
  const [openIndex, setOpenIndex] = useState(-1);
  const items = useMemo(() => faqs.map((faq, index) => ({ ...faq, index })), [faqs]);
  return (
    <div className={className}>
      <div className="text-center mb-8 md:mb-10 animate-fade-in">
        <h2 className="revelao-h2 mb-2 text-center">
          {title ?? t.faqs.title}
        </h2>
        {(subtitle ?? t.faqs.subtitle) ? (
          <p className="revelao-h3 mb-2 text-center">
            {subtitle ?? t.faqs.subtitle}
          </p>
        ) : null}
      </div>

      <div className="animate-fade-in-up opacity-100 flex w-full max-w-[680px] flex-col gap-3 pt-0 mx-auto">
        {items.map((faq) => {
          const isOpen = faq.index === openIndex;
          return (
            <div
              key={faq.index}
              className="overflow-hidden rounded-[8px] bg-neutral-100"
            >
              <button
                type="button"
                className="flex w-full cursor-pointer items-center bg-neutral-100 px-4 py-3 text-left"
                onClick={() => setOpenIndex((current) => (current === faq.index ? -1 : faq.index))}
              >
                <div className="flex size-10 shrink-0 items-center justify-center">
                  <div className="relative size-[14px]">
                    <div className="absolute left-0 top-1/2 h-px w-[14px] -translate-y-1/2 rounded-sm bg-neutral-900" />
                    <div
                      className={[
                        "absolute left-1/2 top-0 h-[14px] w-px -translate-x-1/2 rounded-full bg-neutral-900 transition-transform duration-200",
                        isOpen ? "rotate-90" : "",
                      ].join(" ")}
                    />
                  </div>
                </div>
                <span className="flex-1 text-base leading-[21px] tracking-[-0.01em] text-neutral-900">
                  {faq.q}
                </span>
              </button>
              <div
                className={[
                  "grid bg-neutral-100 transition-all duration-200",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                ].join(" ")}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-4 pl-[50px] text-sm leading-relaxed text-neutral-600">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
