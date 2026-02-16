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
  Github,
  Code,
  FileText,
  Lightbulb,
  Users,
  Mail,
  BookOpen,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = (await getTranslations({
    locale,
    namespace: "home.contribute.meta",
  })) as (key: string) => string;

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "contribute",
      "open source",
      "machine learning contribution",
      "OpenML community",
      "ML datasets",
      "code contribution",
      "documentation",
      "open science collaboration",
    ],
    alternates: {
      canonical: `/${locale}/contribute`,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `https://www.openml.org/${locale}/contribute`,
      siteName: "OpenML",
      images: [
        {
          url: "https://www.openml.org/images/og/contribute.png",
          width: 1200,
          height: 630,
          alt: "Contribute to OpenML - Open Source ML Platform",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      site: "@open_ml",
      images: ["https://www.openml.org/images/og/contribute.png"],
    },
  };
}

export default async function ContributePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home.contribute.hero");

  const tocItems = [
    { id: "overview", title: "Overview", level: 2 },
    { id: "ways-to-contribute", title: "Ways to Contribute", level: 2 },
    { id: "code", title: "Code Contributions", level: 3 },
    { id: "documentation", title: "Documentation", level: 3 },
    { id: "data", title: "Data & Experiments", level: 3 },
    { id: "community", title: "Community Support", level: 3 },
    { id: "getting-started", title: "Getting Started", level: 2 },
    { id: "guidelines", title: "Contribution Guidelines", level: 2 },
    { id: "resources", title: "Resources", level: 2 },
  ];

  return (
    <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative flex min-h-screen gap-8">
        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="gradient-text mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              {t("title")}
            </h1>
            <p className="text-muted-foreground text-xl">{t("subtitle")}</p>
          </div>

          <Alert className="bg-primary/5 border-primary/20 mb-8">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>New to contributing?</strong> Don't worry! We welcome
              contributors of all experience levels. Start small, ask questions,
              and grow with us. 🎉
            </AlertDescription>
          </Alert>

          {/* Overview */}
          <section id="overview" className="mb-16 scroll-mt-20">
            <h2 className="mb-4 text-3xl font-bold">Overview</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
                  OpenML is an <strong>open-source project</strong> hosted on{" "}
                  <Link
                    href="https://github.com/openml"
                    className="text-primary hover:underline"
                    target="_blank"
                  >
                    GitHub
                  </Link>
                  . We're dependent on community contributions to grow, improve,
                  and remain sustainable.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Whether you write code, create documentation, share datasets,
                  answer questions, or spread the word —{" "}
                  <strong>your contribution matters</strong>.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Ways to Contribute */}
          <section id="ways-to-contribute" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Ways to Contribute</h2>

            {/* Code Contributions */}
            <div id="code" className="mb-8 scroll-mt-20">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                      <Code className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>Code Contributions</CardTitle>
                      <CardDescription>
                        Backend, frontend, APIs, client libraries
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Help us build and maintain OpenML's infrastructure:
                  </p>
                  <ul className="text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Python API</strong> — enhance the Python client
                        library
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Backend services</strong> — improve server-side
                        infrastructure
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Website & UI</strong> — develop React/Next.js
                        frontend features
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>R, Java, Julia clients</strong> — contribute to
                        language integrations
                      </span>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Link href="https://github.com/openml" target="_blank">
                      <Button className="gap-2">
                        <Github className="h-4 w-4" />
                        Browse Repositories
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Documentation */}
            <div id="documentation" className="mb-8 scroll-mt-20">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                      <FileText className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>Documentation</CardTitle>
                      <CardDescription>
                        Guides, tutorials, API references
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Good documentation is crucial for newcomers:
                  </p>
                  <ul className="text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Write tutorials</strong> — step-by-step guides
                        for common tasks
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Improve API docs</strong> — clarify function
                        descriptions and examples
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Fix typos & errors</strong> — every improvement
                        helps
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Add translations</strong> — make OpenML
                        accessible globally
                      </span>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Link href="https://docs.openml.org/" target="_blank">
                      <Button variant="outline" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        View Documentation
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data & Experiments */}
            <div id="data" className="mb-8 scroll-mt-20">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                      <Lightbulb className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>Data & Experiments</CardTitle>
                      <CardDescription>
                        Share datasets, tasks, flows, and runs
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Grow OpenML's knowledge base:
                  </p>
                  <ul className="text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Upload datasets</strong> — share curated,
                        high-quality data
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Create tasks</strong> — define new benchmarks
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Share experiments</strong> — publish
                        reproducible runs
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Curate collections</strong> — organize benchmark
                        suites
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Community Support */}
            <div id="community" className="mb-8 scroll-mt-20">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                      <Users className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>Community Support</CardTitle>
                      <CardDescription>
                        Help others, answer questions, share knowledge
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Build a supportive community:
                  </p>
                  <ul className="text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Answer questions</strong> — on GitHub
                        Discussions
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Review pull requests</strong> — provide
                        constructive feedback
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Report bugs</strong> — help identify issues
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>
                        <strong>Share use cases</strong> — showcase how you use
                        OpenML
                      </span>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Link
                      href="https://github.com/orgs/openml/discussions"
                      target="_blank"
                    >
                      <Button variant="outline" className="gap-2">
                        <Users className="h-4 w-4" />
                        Join Discussions
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Getting Started */}
          <section id="getting-started" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Getting Started</h2>
            <Card>
              <CardContent className="pt-6">
                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
                      1
                    </span>
                    <div>
                      <strong className="text-foreground">Pick an area</strong>
                      <p className="text-muted-foreground">
                        Choose something you're comfortable with — code, docs,
                        data, or community
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
                      2
                    </span>
                    <div>
                      <strong className="text-foreground">Find an issue</strong>
                      <p className="text-muted-foreground">
                        Browse{" "}
                        <Link
                          href="https://github.com/openml"
                          className="text-primary hover:underline"
                          target="_blank"
                        >
                          GitHub issues
                        </Link>{" "}
                        labeled{" "}
                        <code className="bg-muted rounded px-1.5 py-0.5">
                          good first issue
                        </code>
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
                      3
                    </span>
                    <div>
                      <strong className="text-foreground">Reach out</strong>
                      <p className="text-muted-foreground">
                        Email{" "}
                        <Link
                          href="mailto:openmlHQ@googlegroups.com"
                          className="text-primary hover:underline"
                        >
                          openmlHQ@googlegroups.com
                        </Link>{" "}
                        or comment on the issue
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
                      4
                    </span>
                    <div>
                      <strong className="text-foreground">Contribute!</strong>
                      <p className="text-muted-foreground">
                        Make your changes, open a pull request, and collaborate
                        with reviewers
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </section>

          {/* Contribution Guidelines */}
          <section id="guidelines" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Contribution Guidelines</h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-muted-foreground">
                      <strong>Follow code style</strong> — use linters and
                      formatters (PEP8 for Python, Prettier for JS)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-muted-foreground">
                      <strong>Write tests</strong> — ensure your code is
                      well-tested
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-muted-foreground">
                      <strong>Document changes</strong> — update relevant
                      documentation
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-muted-foreground">
                      <strong>Small, focused PRs</strong> — easier to review and
                      merge
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-muted-foreground">
                      <strong>Be respectful</strong> — foster a welcoming,
                      inclusive environment
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Resources */}
          <section id="resources" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Resources</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">GitHub Organization</CardTitle>
                  <CardDescription>All our repositories</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="https://github.com/openml" target="_blank">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Github className="h-4 w-4" />
                      Visit GitHub
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Discussions Forum</CardTitle>
                  <CardDescription>Ask questions, share ideas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href="https://github.com/orgs/openml/discussions"
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Join Discussion
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Documentation</CardTitle>
                  <CardDescription>Comprehensive guides</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href="https://docs.openml.org/contributing/"
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Read Docs
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Contact Team</CardTitle>
                  <CardDescription>Get in touch directly</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="mailto:openmlHQ@googlegroups.com">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email Us
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <Card className="from-primary/5 to-primary/10 border-primary/20 bg-linear-to-br">
            <CardContent className="pt-6 text-center">
              <h3 className="mb-4 text-2xl font-bold">Ready to Contribute?</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Your contribution — no matter how small — helps build the future
                of open machine learning. 🚀
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="https://github.com/openml" target="_blank">
                  <Button size="lg" className="gap-2">
                    <Github className="h-5 w-5" />
                    Start on GitHub
                  </Button>
                </Link>
                <Link href="mailto:openmlHQ@googlegroups.com">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Mail className="h-5 w-5" />
                    Ask Questions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table of Contents Sidebar */}
        <aside className="hidden shrink-0 xl:block">
          <TableOfContents items={tocItems} />
        </aside>
      </div>
    </div>
  );
}
