import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionContainer } from "@/components/layout/section-container";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CodeSnippet } from "@/components/ui/code-snippet";

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
          Accessibility & Integration
        </h2>
        <p className="text-muted-foreground text-lg">
          Access OpenML anywhere. Sub-headline: Whether you prefer a GUI or a
          CLI, your data is always one click away.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        {/* Website Option */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="mb-4 text-2xl">The Web Interface</CardTitle>
            <CardDescription className="space-y-4 text-base">
              <p>
                Browse, visualize, and organize datasets through our intuitive
                web dashboard. Perfect for exploratory analysis and data
                discovery.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent className="relative -mt-6 h-74">
            <Image
              src="/dataset-distribution-plot.jpg"
              alt="Diagram illustrating the scientific machine learning workflow and data lifecycle"
              fill
              priority
              className="object-cover p-6"
            />
          </CardContent>
          <CardFooter className="-mt-6 flex justify-end">
            <Link
              href="/datasets"
              className="text-primary flex items-center font-medium hover:underline"
            >
              Browse Datasets <ArrowRight className="ml-2" />
            </Link>
          </CardFooter>
        </Card>

        {/* Code Option */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="mb-4 text-2xl">The Code (APIs)</CardTitle>
            <CardDescription className="space-y-4 text-base">
              <p className="mb-3">
                Integrate directly into your code. Use our client libraries to
                programmatically download data and upload results without
                leaving your IDE.
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
          <CardContent className="h-auto">
            <CodeSnippet
              language="python"
              code={`import openml
# Load the diabetes dataset by ID
dataset = openml.datasets.get_dataset(37)
X, y, categorical_indicator, attribute_names = dataset.get_data(
    target=dataset.default_target_attribute
)`}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link
              href="/datasets"
              className="text-primary flex items-center font-medium hover:underline"
            >
              View API Docs <ArrowRight className="ml-2" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </SectionContainer>
  );
}
