import { setRequestLocale, getTranslations } from "next-intl/server";
import { TableOfContents } from "@/components/about/table-of-contents";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  Code,
  Database,
  Zap,
  GitBranch,
  Award,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = (await getTranslations({
    locale,
    namespace: "home.documentation.meta",
  })) as (key: string) => string;

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "OpenML documentation",
      "machine learning tutorial",
      "Python API",
      "R API",
      "Java API",
      "ML datasets",
      "machine learning tasks",
      "ML benchmarking",
      "scikit-learn integration",
    ],
    alternates: {
      canonical: `/${locale}/documentation`,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `https://www.openml.org/${locale}/documentation`,
      siteName: "OpenML",
      images: [
        {
          url: "https://www.openml.org/images/og/documentation.png",
          width: 1200,
          height: 630,
          alt: "OpenML Documentation - Learn Machine Learning",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      site: "@open_ml",
      images: ["https://www.openml.org/images/og/documentation.png"],
    },
  };
}

export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tHero = await getTranslations("home.documentation.hero");
  const tAlert = await getTranslations("home.documentation.alert");

  const tocItems = [
    { id: "getting-started", title: "Getting Started", level: 2 },
    { id: "quick-start", title: "Quick Start", level: 3 },
    { id: "concepts", title: "Core Concepts", level: 2 },
    { id: "datasets", title: "Datasets", level: 3 },
    { id: "tasks", title: "Tasks", level: 3 },
    { id: "flows", title: "Flows", level: 3 },
    { id: "runs", title: "Runs", level: 3 },
    { id: "apis", title: "APIs & Integrations", level: 2 },
    { id: "python", title: "Python", level: 3 },
    { id: "r-java", title: "R & Java", level: 3 },
    { id: "benchmarking", title: "Benchmarking", level: 2 },
    { id: "advanced", title: "Advanced Topics", level: 2 },
  ];

  return (
    <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative flex min-h-screen gap-8">
        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="gradient-text mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              {tHero("title")}
            </h1>
            <p className="text-muted-foreground text-xl">{tHero("subtitle")}</p>
          </div>

          <Alert className="mb-8">
            <BookOpen className="h-4 w-4" />
            <AlertTitle>{tAlert("title")}</AlertTitle>
            <AlertDescription>
              {tAlert("description")}{" "}
              <Link
                href="https://docs.openml.org/"
                className="text-primary font-medium hover:underline"
                target="_blank"
              >
                docs.openml.org
              </Link>{" "}
              for in-depth guides, API references, and code examples.
            </AlertDescription>
          </Alert>

          {/* Getting Started */}
          <section id="getting-started" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Getting Started</h2>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="mb-4 text-xl font-semibold">
                  How to use OpenML
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      <span className="text-2xl">💻</span>
                    </div>
                    <h4 className="font-semibold">Web Interface</h4>
                    <p className="text-muted-foreground text-sm">
                      Explore datasets, tasks, and experiments through our
                      interactive website
                    </p>
                    <Link
                      href="/datasets"
                      className="text-primary mt-auto text-sm hover:underline"
                    >
                      Browse Datasets →
                    </Link>
                  </div>

                  <div className="flex flex-col items-start gap-2 rounded-lg border p-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <h4 className="font-semibold">APIs & Libraries</h4>
                    <p className="text-muted-foreground text-sm">
                      Access resources programmatically through Python, R, or
                      Java clients
                    </p>
                    <Link
                      href="/apis"
                      className="text-primary mt-auto text-sm hover:underline"
                    >
                      View APIs →
                    </Link>
                  </div>

                  <div className="flex flex-col items-start gap-2 rounded-lg border p-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <h4 className="font-semibold">Learn Concepts</h4>
                    <p className="text-muted-foreground text-sm">
                      Understand datasets, tasks, flows, runs, and benchmarking
                    </p>
                    <Link
                      href="#concepts"
                      className="text-primary mt-auto text-sm hover:underline"
                    >
                      Read Concepts →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start */}
            <div id="quick-start" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Start with Python</CardTitle>
                  <CardDescription>
                    Get up and running in 10 minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-muted-foreground mb-2 text-sm font-medium">
                        1. Install OpenML
                      </p>
                      <pre className="bg-muted overflow-x-auto rounded-lg p-4">
                        <code className="text-sm">pip install openml</code>
                      </pre>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-2 text-sm font-medium">
                        2. Load a dataset
                      </p>
                      <pre className="bg-muted overflow-x-auto rounded-lg p-4">
                        <code className="text-sm">{`import openml

# Load iris dataset
dataset = openml.datasets.get_dataset(61)
X, y, _, _ = dataset.get_data(target=dataset.default_target_attribute)`}</code>
                      </pre>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-2 text-sm font-medium">
                        3. Run an experiment
                      </p>
                      <pre className="bg-muted overflow-x-auto rounded-lg p-4">
                        <code className="text-sm">{`from sklearn.ensemble import RandomForestClassifier

# Get a task
task = openml.tasks.get_task(59)

# Run classifier
clf = RandomForestClassifier()
run = openml.runs.run_model_on_task(clf, task)

# Publish to OpenML
run.publish()`}</code>
                      </pre>
                    </div>
                    <div className="pt-2">
                      <Link
                        href="https://docs.openml.org/notebooks/getting_started/"
                        target="_blank"
                      >
                        <Button className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Full Tutorial
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Core Concepts */}
          <section id="concepts" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Core Concepts</h2>

            {/* Datasets */}
            <div id="datasets" className="mb-6 scroll-mt-20">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                      <Database className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>Datasets</CardTitle>
                      <CardDescription>
                        Versioned, uniformly formatted data
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    OpenML hosts <strong>25,000+ datasets</strong> with rich
                    metadata, automatic versioning, and consistent formatting.
                    Every dataset includes:
                  </p>
                  <ul className="text-muted-foreground mb-4 space-y-2">
                    <li className="flex gap-2">
                      <ChevronRight className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span>
                        Uniform feature types and missing value representations
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span>
                        Comprehensive metadata (license, creator, version, etc.)
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span>Data quality metrics and preprocessing status</span>
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/datasets">
                      <Button size="sm" className="gap-2">
                        <Database className="h-4 w-4" />
                        Browse Datasets
                      </Button>
                    </Link>
                    <Link
                      href="https://docs.openml.org/concepts/data/"
                      target="_blank"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Technical Docs
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tasks */}
            <div id="tasks" className="mb-6 scroll-mt-20">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                      <Award className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>Tasks</CardTitle>
                      <CardDescription>
                        Standardized ML challenges
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Tasks define <strong>how to evaluate</strong> a dataset:
                    target variable, train/test splits, and metrics. This
                    ensures all results are directly comparable.
                  </p>
                  <ul className="text-muted-foreground mb-4 space-y-2">
                    <li className="flex gap-2">
                      <ChevronRight className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span>
                        Predefined train/test splits (no data leakage)
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span>
                        Fixed evaluation metrics (AUC, RMSE, accuracy, etc.)
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span>
                        Clear problem type (classification, regression, etc.)
                      </span>
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/tasks">
                      <Button size="sm" className="gap-2">
                        <Award className="h-4 w-4" />
                        Browse Tasks
                      </Button>
                    </Link>
                    <Link
                      href="https://docs.openml.org/concepts/tasks/"
                      target="_blank"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Technical Docs
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Flows */}
            <div id="flows" className="mb-6 scroll-mt-20">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                      <GitBranch className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>Flows</CardTitle>
                      <CardDescription>
                        ML pipelines and workflows
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    A <strong>flow</strong> is a machine learning pipeline:
                    preprocessing steps, algorithms, and hyperparameters
                    combined into a reusable, shareable object.
                  </p>
                  <ul className="text-muted-foreground mb-4 space-y-2">
                    <li className="flex gap-2">
                      <ChevronRight className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span>
                        Automatically extracted from scikit-learn, PyTorch, etc.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span>Complete parameter tracking and versioning</span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span>Easily reusable and comparable</span>
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/flows">
                      <Button size="sm" className="gap-2">
                        <GitBranch className="h-4 w-4" />
                        Browse Flows
                      </Button>
                    </Link>
                    <Link
                      href="https://docs.openml.org/concepts/flows/"
                      target="_blank"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Technical Docs
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Runs */}
            <div id="runs" className="mb-6 scroll-mt-20">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                      <Zap className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>Runs</CardTitle>
                      <CardDescription>
                        Experiment executions and results
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    A <strong>run</strong> is the result of applying a flow to a
                    task. It captures predictions, metrics, runtime, and full
                    provenance.
                  </p>
                  <ul className="text-muted-foreground mb-4 space-y-2">
                    <li className="flex gap-2">
                      <ChevronRight className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span>
                        Full evaluation metrics (per-fold, aggregated)
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span>Predictions stored for further analysis</span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span>Hardware and runtime tracking</span>
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/runs">
                      <Button size="sm" className="gap-2">
                        <Zap className="h-4 w-4" />
                        Browse Runs
                      </Button>
                    </Link>
                    <Link
                      href="https://docs.openml.org/concepts/runs/"
                      target="_blank"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Technical Docs
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* APIs & Integrations */}
          <section id="apis" className="mb-16 scroll-mt-20">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold">APIs & Integrations</h2>
              <Link href="/apis">
                <Button variant="outline" size="sm" className="gap-2">
                  <Code className="h-4 w-4" />
                  Full API Guide
                </Button>
              </Link>
            </div>

            {/* Python */}
            <div id="python" className="mb-6 scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Python API
                  </CardTitle>
                  <CardDescription>
                    Native integration with scikit-learn, PyTorch, TensorFlow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    The most popular OpenML client. Seamlessly integrates with
                    the Python ML ecosystem.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="https://docs.openml.org/python/"
                      target="_blank"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        Python Docs
                      </Button>
                    </Link>
                    <Link
                      href="https://github.com/openml/openml-python"
                      target="_blank"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        GitHub
                      </Button>
                    </Link>
                    <Link
                      href="https://docs.openml.org/examples/"
                      target="_blank"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <Code className="h-4 w-4" />
                        Examples
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* R & Java */}
            <div id="r-java" className="mb-6 scroll-mt-20">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">R</CardTitle>
                    <CardDescription>MLR integration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="https://docs.openml.org/r/" target="_blank">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />R Documentation
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Java</CardTitle>
                    <CardDescription>Weka, MOA support</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="https://docs.openml.org/ecosystem/Java/"
                      target="_blank"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Java Documentation
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Benchmarking */}
          <section id="benchmarking" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Benchmarking</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 text-lg">
                  OpenML enables{" "}
                  <strong>rigorous, reproducible benchmarking</strong> through
                  benchmark suites — curated collections of tasks designed to
                  stress-test algorithms.
                </p>
                <p className="text-muted-foreground mb-6">
                  Examples: <strong>OpenML-CC18</strong> (classification),{" "}
                  <strong>AutoML Benchmark</strong>, domain-specific suites.
                </p>
                <Link href="https://docs.openml.org/benchmark/" target="_blank">
                  <Button className="gap-2">
                    <Award className="h-4 w-4" />
                    Benchmarking Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>

          {/* Advanced Topics */}
          <section id="advanced" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Advanced Topics</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Authentication</CardTitle>
                  <CardDescription>API keys and publishing</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href="https://docs.openml.org/concepts/authentication/"
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Tagging & Search</CardTitle>
                  <CardDescription>
                    Organize and discover resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href="https://docs.openml.org/concepts/tagging/"
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Terms & Licenses</CardTitle>
                  <CardDescription>
                    Licenses, citations, terms of use
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/terms">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <ChevronRight className="h-4 w-4" />
                      View Terms
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">REST API</CardTitle>
                  <CardDescription>Direct HTTP access</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/apis#rest">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Code className="h-4 w-4" />
                      API Reference
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <Card className="from-primary/5 to-primary/10 border-primary/20 bg-gradient-to-br">
            <CardContent className="pt-6 text-center">
              <h3 className="mb-4 text-2xl font-bold">Ready to Dive Deeper?</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Visit our comprehensive documentation for detailed guides, code
                examples, and API references.
              </p>
              <Link href="https://docs.openml.org/" target="_blank">
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  Visit Full Documentation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Table of Contents - Right Sidebar */}
        <aside className="hidden shrink-0 xl:block">
          <TableOfContents items={tocItems} />
        </aside>
      </div>
    </div>
  );
}
