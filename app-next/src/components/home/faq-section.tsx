"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      question: "Why is OpenML ideal for ML research?",
      answer: "OpenML makes your experiments fully reproducible.",
      details: [
        "algorithms",
        "hyperparameters",
        "dataset versions",
        "metrics",
        "hardware",
      ],
      footer: "Anyone can repeat your results exactly.",
    },
    {
      question: "How does OpenML make results comparable?",
      answer: "All datasets and tasks are standardized. You can compare:",
      details: ["algorithms", "pipelines", "hyperparameters"],
      footer:
        "across identical evaluation protocols — essential for benchmarking.",
    },
    {
      question: "Can I search previous experiments?",
      answer:
        "Yes. Every experiment is logged with rich, machine-readable metadata. You can query things like:",
      details: ['"Which models work best on small tabular datasets?"'],
      footer: "This makes OpenML powerful for meta-learning.",
    },
    {
      question: "What makes OpenML scientifically rigorous?",
      answer: "OpenML enforces:",
      details: [
        "curated datasets",
        "standardized tasks",
        "consistent train/test splits",
        "documented metadata",
      ],
      footer:
        "Ideal for academic papers, reproducible research, and ML competitions.",
    },
    {
      question: "Why is OpenML ideal for ML research?",
      answer: "OpenML automatically tracks every part of your experiment:",
      details: [
        "algorithms and pipelines",
        "hyperparameters",
        "dataset versions",
        "evaluation metrics",
        "hardware used",
      ],
      footer:
        "This ensures full reproducibility for anyone who wants to validate your results.",
    },
    {
      question: "How does OpenML make results comparable?",
      answer: "All results follow standardized evaluation protocols:",
      details: [
        "uniform dataset formats",
        "shared tasks with fixed splits",
        "consistent metrics",
        "identical benchmarking conditions",
      ],
      footer:
        "You can directly compare algorithms, pipelines, and hyperparameters at scale.",
    },
    {
      question: "Can I search previous experiments?",
      answer: "Yes. Every experiment is stored with machine-readable metadata:",
      details: [
        "dataset properties",
        "algorithm settings",
        "performance metrics",
        "task type and structure",
      ],
      footer:
        "You can query thousands of runs to discover what works best for your problem.",
    },
    // {
    //   question: "What makes OpenML scientifically rigorous?",
    //   answer: "OpenML enforces:",
    //   details: [
    //     "curated datasets",
    //     "standardized tasks",
    //     "consistent train/test splits",
    //     "documented metadata",
    //   ],
    //   footer:
    //     "Ideal for academic papers, reproducible research, and ML competitions.",
    // },
    // {
    //   question: "What makes OpenML datasets easier to use?",
    //   answer: "All datasets follow strict, standardized formatting rules:",
    //   details: [
    //     "consistent feature naming",
    //     "clear label definitions",
    //     "standard missing-value representations",
    //     "declared data types for every column",
    //   ],
    //   footer:
    //     "You can load any dataset directly into your ML workflow with minimal preprocessing.",
    // },
    // {
    //   question:
    //     "How does OpenML ensure datasets are trustworthy and versioned?",
    //   answer: "Each dataset is transparently versioned:",
    //   details: [
    //     "unique dataset IDs",
    //     "version numbers",
    //     "complete changelogs",
    //     "documented licenses and creators",
    //   ],
    //   footer:
    //     "This guarantees reproducibility across papers and research projects.",
    // },
    // {
    //   question: "Can I rely on OpenML datasets for fair benchmarking?",
    //   answer: "Yes. Most datasets come with predefined tasks that include:",
    //   details: [
    //     "fixed train/test splits",
    //     "defined target variables",
    //     "standard evaluation metrics",
    //     "consistent benchmarking protocols",
    //   ],
    //   footer:
    //     "This ensures fair, apples-to-apples comparisons across all algorithms.",
    // },
    // {
    //   question: "What are OpenML tasks and why are they important?",
    //   answer: "Tasks define exactly how to evaluate a dataset:",
    //   details: [
    //     "what to predict (target variable)",
    //     "how to split the data",
    //     "which metrics to compute",
    //     "how to structure reproducible evaluations",
    //   ],
    //   footer:
    //     "Tasks remove ambiguity and make benchmark results directly comparable.",
    // },
    // {
    //   question: "How does OpenML help me find the right model?",
    //   answer: "OpenML stores experiments with rich, searchable metadata:",
    //   details: [
    //     "performance across datasets",
    //     "hyperparameter settings",
    //     "pipeline structures",
    //     "algorithm behavior under different conditions",
    //   ],
    //   footer:
    //     "You can instantly discover which approaches work best for similar problems.",
    // },
    // {
    //   question:
    //     "How does OpenML support collaboration across teams and institutions?",
    //   answer: "OpenML standardizes how experiments are shared:",
    //   details: [
    //     "consistent dataset versions",
    //     "identical task definitions",
    //     "reproducible run logs",
    //     "shared evaluation protocols",
    //   ],
    //   footer:
    //     "Teams can coordinate experiments seamlessly, even across different environments.",
    // },
    // {
    //   question: "Why is OpenML valuable for meta-learning research?",
    //   answer:
    //     "OpenML provides large-scale structured metadata ideal for meta-analyses:",
    //   details: [
    //     "cross-dataset performance patterns",
    //     "algorithm behavior insights",
    //     "hyperparameter effect trends",
    //     "dataset property correlations",
    //   ],
    //   footer:
    //     "This enables automated model selection and meta-learning across diverse tasks.",
    // },
    // {
    //   question: "Does OpenML work with my existing ML tools?",
    //   answer: "Yes. OpenML integrates with all major ML frameworks:",
    //   details: ["scikit-learn", "PyTorch", "TensorFlow", "XGBoost"],
    //   footer:
    //     "You can load datasets and publish results with just a few lines of code.",
    // },
  ];

  return (
    <section className="bg-muted/30 pb-32">
      {/* Header */}
      <div className="mx-auto mb-6 max-w-7xl px-4 py-2 text-center md:px-8">
        <div className="mx-auto inline-block rounded-sm px-6 text-2xl font-medium text-slate-700 uppercase dark:text-white">
          OpenML FAQ
        </div>
        <h2 className="gradient-text title-font py-3 text-4xl leading-[1.05] font-semibold tracking-tight lg:text-[clamp(1.9rem,3.2vw,51px)]">
          Clear answers to the most important questions
        </h2>
        <p className="mx-auto max-w-3xl text-lg leading-[1.8] font-semibold text-slate-700 dark:text-slate-300">
          Whether you're training your first model or running large-scale
          benchmarks, OpenML streamlines every step of your workflow. This Q&A
          highlights what makes OpenML unique and how it can simplify your daily
          ML work.
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
