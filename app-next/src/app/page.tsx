import { HeroHome } from "@/components/home/hero-home";
import { ThreePillarsSection } from "@/components/home/three-pillars-section";
import { AccessibilitySection } from "@/components/home/accessibility-section";
import { BenchmarkingSection } from "@/components/home/benchmarking-section";
import { WorkflowLoopSection } from "@/components/home/workflow-loop-section";
import { AcademicImpactSection } from "@/components/home/academic-impact-section";
import FAQSection from "@/components/home/faq-section";

export default function HomePage() {
  return (
    <>
      <HeroHome />
      <ThreePillarsSection />
      <AccessibilitySection />
      <BenchmarkingSection />
      <WorkflowLoopSection />
      <AcademicImpactSection />
      <FAQSection />
    </>
  );
}
