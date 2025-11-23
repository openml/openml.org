import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionContainer } from "@/components/layout/section-container";

/**
 * Explore Datasets Section - Server Component
 * From user's diagram: explore datasets with website/code options
 */
export function ExploreSection() {
  const languages = [
    { name: "Python", icon: "🐍", href: "https://docs.openml.org/Python" },
    { name: "R", icon: "📊", href: "https://docs.openml.org/R" },
    { name: "Julia", icon: "📈", href: "https://docs.openml.org/Julia" },
    { name: "Java", icon: "☕", href: "https://docs.openml.org/Java" },
    { name: ".NET", icon: "🔷", href: "https://docs.openml.org/dotnet" },
  ];

  return (
    <SectionContainer id="explore" className="bg-muted/30">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          explore datasets
        </h2>
        <p className="text-muted-foreground text-lg">
          Access OpenML data through the website or your favorite programming
          language
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        {/* Website Option */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="mb-4 text-2xl">website</CardTitle>
            <CardDescription className="space-y-4 text-base">
              <p>
                Browse and search datasets through our intuitive web interface
              </p>
              <Link
                href="/datasets"
                className="text-primary inline-block font-medium hover:underline"
              >
                Browse Datasets →
              </Link>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Code Option */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="mb-4 text-2xl">code</CardTitle>
            <CardDescription className="space-y-4 text-base">
              <p className="mb-3">
                Use our APIs and client libraries in your preferred language
              </p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <a
                    key={lang.name}
                    href={lang.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Badge
                      variant="secondary"
                      className="hover:bg-primary/10 cursor-pointer text-sm"
                    >
                      {lang.icon} {lang.name}
                    </Badge>
                  </a>
                ))}
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </SectionContainer>
  );
}
