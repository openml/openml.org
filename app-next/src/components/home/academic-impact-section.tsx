"use client";

import { SectionContainer } from "@/components/layout/section-container";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

/**
 * Academic Impact Section - Client Component
 * Highlights OpenML's role in creating citable, FAIR-compliant research artifacts
 */
export function AcademicImpactSection() {
  const t = useTranslations("home.academicImpact");
  const locale = useLocale();

  // Map locale to image filenames (capitalize first letter for French and German)
  const getImagePath = (theme: "light" | "dark") => {
    if (locale === "en") {
      return `/img/contribute-citations-livecycle-${theme}.png`;
    }
    // Capitalize first letter: en -> En, fr -> Fr, de -> De, nl -> Nl
    const localeCap = locale.charAt(0).toUpperCase() + locale.slice(1);
    return `/img/lang/${localeCap}_${theme}.png`;
  };

  return (
    <SectionContainer id="academic-impact" className="bg-muted/30">
      <div className="mb-12 text-center">
        <h1 className="gradient-text mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-lg md:text-xl">
          {t("intro")}
        </p>
      </div>
      <div className="fr mx-auto flex max-w-5xl flex-col justify-center gap-12 px-2 md:px-10 lg:flex-row lg:items-center lg:px-2">
        <div className="flex-2 items-center text-center lg:text-end">
          <h2 className="text-foreground mb-5 text-2xl font-bold md:text-3xl">
            {t("subtitle")}
          </h2>
          <p className="text-muted-foreground text-lg leading-8">{t("text")}</p>
        </div>
        <div className="flex-3 items-center justify-center px-16 md:px-32 lg:px-0">
          <div className="relative mt-2 pb-12">
            <Image
              src={getImagePath("light")}
              alt="Academic Impact"
              width={1400}
              height={700}
              className="h-auto w-full rounded-full object-contain dark:hidden"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
            <Image
              src={getImagePath("dark")}
              alt="Academic Impact"
              width={1400}
              height={700}
              className="hidden h-auto w-full rounded-full object-contain dark:block"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
