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
 * Frictionless ML Section - Server Component
 * From user's diagram: import data + export models/experiments (flows, runs, measures)
 */
export function FrictionlessMLSection() {
  return (
    <SectionContainer id="frictionless">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Frictionless ML</h2>
        <p className="text-muted-foreground text-lg">
          Seamlessly integrate OpenML into your ML workflow
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        {/* Import Data */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="mb-4 text-2xl">
              import data in libraries to build models quick!
            </CardTitle>
            <CardDescription className="space-y-4 text-base">
              <p>
                Load datasets directly into your favorite ML libraries with a
                single line of code
              </p>
              <Link
                href="/datasets"
                className="text-primary inline-block font-medium hover:underline"
              >
                Get Started →
              </Link>
              <div className="pt-4">
                <p className="text-muted-foreground mb-2 text-xs">
                  Compatible with:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">scikit-learn</Badge>
                  <Badge variant="outline">PyTorch</Badge>
                  <Badge variant="outline">TensorFlow</Badge>
                  <Badge variant="outline">XGBoost</Badge>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Export Models & Experiments */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="mb-4 text-2xl">
              exporting models & experiments analysis
            </CardTitle>
            <CardDescription className="space-y-4 text-base">
              <p>
                Share your workflows, runs, and evaluation results with the
                community
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/flows"
                  className="text-primary flex items-center gap-2 font-medium hover:underline"
                >
                  → flows{" "}
                  <span className="text-muted-foreground text-xs">
                    (workflows)
                  </span>
                </Link>
                <Link
                  href="/runs"
                  className="text-primary flex items-center gap-2 font-medium hover:underline"
                >
                  → runs{" "}
                  <span className="text-muted-foreground text-xs">
                    (experiments)
                  </span>
                </Link>
                <Link
                  href="/measures"
                  className="text-primary flex items-center gap-2 font-medium hover:underline"
                >
                  → measures{" "}
                  <span className="text-muted-foreground text-xs">
                    (metrics)
                  </span>
                </Link>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </SectionContainer>
  );
}
