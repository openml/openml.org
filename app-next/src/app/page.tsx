import { HeroSection } from "@/components/home/hero-section";
import { ExploreSection } from "@/components/home/explore-section";
import { DownloadsSection } from "@/components/home/downloads-section";
import { BenchmarksSection } from "@/components/home/benchmarks-section";
import { FrictionlessMLSection } from "@/components/home/frictionless-ml-section";

/**
 * Homepage - Server Component
 * All sections based on user's design diagram
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ExploreSection />
      <DownloadsSection />
      <BenchmarksSection />
      <FrictionlessMLSection />
    </>
  );
}
