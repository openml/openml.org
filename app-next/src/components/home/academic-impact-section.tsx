import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/layout/section-container";
import Image from "next/image";

/**
 * Academic Impact Section - Server Component
 * Highlights OpenML's role in creating citable, FAIR-compliant research artifacts
 */
export function AcademicImpactSection() {
  return (
    <SectionContainer id="academic-impact" className="bg-muted/30">
      <div className="mb-12 text-center">
        <h1 className="from-foreground to-foreground/70 mb-4 bg-linear-to-r bg-clip-text text-4xl font-bold tracking-tight md:text-5xl dark:bg-[linear-gradient(15deg,#2563eb,#6366f1,#8b5cf6)] dark:bg-clip-text dark:text-transparent">
          Contribute to the Global Knowledge Base
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-lg md:text-xl">
          Generate persistent identifiers (DOIs) for your datasets, workflows,
          and experiments—ensuring FAIR compliance and enabling reproducible
          science.
        </p>
      </div>
      <div className="mx-auto flex max-w-5xl gap-12 md:flex-row md:items-center">
        <div className="flex-2 items-center text-end">
          <h2 className="text-foreground mb-5 text-2xl font-bold md:text-3xl">
            The Citation Lifecycle
          </h2>
          <p className="text-muted-foreground text-base/8">
            Don't let your research die on a hard drive. Uploading to OpenML
            creates citable, versioned artifacts with provenance tracking. Your
            work becomes part of the global ML benchmark corpus, cited by peers
            and powering meta-research.
          </p>
        </div>
        <div className="flex-3 items-center justify-center">
          <CitationLifecycle
            light="/img/contribute-citations-light.png"
            dark="/img/contribute-citations-dark.png"
            alt="Academic Impact"
          />
        </div>
      </div>
    </SectionContainer>
  );
}

const CitationLifecycle: React.FC<{
  light: string;
  dark: string;
  alt: string;
}> = ({ light, dark, alt }) => {
  return (
    <div className="relative mt-2 pb-12">
      <Image
        src={light}
        alt={alt}
        width={1400}
        height={700}
        className="h-auto w-full rounded-full object-contain dark:hidden"
        sizes="(max-width: 768px) 100vw, 33vw"
        priority
      />
      <Image
        src={dark}
        alt={alt}
        width={1400}
        height={700}
        className="hidden h-auto w-full rounded-full object-contain dark:block"
        sizes="(max-width: 768px) 100vw, 33vw"
        priority
      />
    </div>
  );
};
