import { HeroHome } from "@/components/home/hero-home";
import { ThreePillarsSection } from "@/components/home/three-pillars-section";
import { AccessibilitySection } from "@/components/home/accessibility-section";
import { BenchmarkingSection } from "@/components/home/benchmarking-section";
import { WorkflowLoopSection } from "@/components/home/workflow-loop-section";
import { FrictionlessMLSection } from "@/components/home/frictionless-ml-section";

export default function HomePage() {
  return (
    <>
      <HeroHome />
      <ThreePillarsSection />
      <AccessibilitySection />
      <BenchmarkingSection />
      <WorkflowLoopSection />
      <FrictionlessMLSection />
    </>
  );
}
