import { HeroHome } from "@/components/home/HeroHome";
import { HeroSection } from "@/components/home/hero-section";
import { ExploreSection } from "@/components/home/explore-section";
import { DownloadsSection } from "@/components/home/downloads-section";
import { BenchmarksSection } from "@/components/home/benchmarks-section";
import { FrictionlessMLSection } from "@/components/home/frictionless-ml-section";

export default function HomePage() {
  return (
    <>
      <HeroHome />
      <HeroSection />
      <ExploreSection />
      <DownloadsSection />
      <BenchmarksSection />
      <FrictionlessMLSection />
    </>
  );
}
