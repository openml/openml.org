"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FAQSection() {
  const t = useTranslations("home.faq");

  // Get the FAQ questions from translations
  const faqCount = 6; // We have 6 questions
  const faqs = Array.from({ length: faqCount }, (_, i) => ({
    question: t(`questions.${i}.question`),
    answer: t(`questions.${i}.answer`),
    details: t.raw(`questions.${i}.details`) as string[],
    footer: t(`questions.${i}.footer`),
  }));

  return (
    <section className="bg-muted/30 pb-32">
      {/* Header */}
      <div className="mx-auto mb-6 max-w-7xl px-4 py-2 text-center md:px-8">
        <div className="mx-auto inline-block rounded-sm px-6 text-2xl font-medium text-slate-700 uppercase dark:text-white">
          {t("title")}
        </div>
        <h1 className="gradient-text title-font py-3 text-4xl leading-[1.05] font-semibold tracking-tight lg:text-[clamp(1.9rem,3.2vw,51px)]">
          {t("heading")}
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-[1.8] font-semibold text-slate-700 dark:text-slate-300">
          {t("description")}
        </p>
      </div>

      {/* FAQ Accordion */}
      <Accordion
        type="single"
        collapsible
        className="mx-auto max-w-4xl space-y-4"
      >
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="bg-tra rounded-lg border border-slate-700/40 px-6 transition-all hover:border-slate-700 hover:bg-slate-600/8 dark:border-slate-700 dark:bg-slate-800/50"
          >
            <AccordionTrigger className="text-secondary text-left text-lg font-medium hover:no-underline dark:text-white/85">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pt-2 text-base/snug font-medium text-slate-800 dark:text-slate-200">
              <p className="mb-4">{faq.answer}</p>
              {faq.details && faq.details.length > 0 && (
                <ul className="mb-4 space-y-2 pl-2">
                  {faq.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
                      <span className="text-lg">{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
              {faq.footer && (
                <p className="mt-3 text-sm text-slate-400 italic">
                  {faq.footer}
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
