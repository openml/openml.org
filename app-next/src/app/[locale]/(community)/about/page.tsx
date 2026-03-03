import { setRequestLocale, getTranslations } from "next-intl/server";
import { TableOfContents } from "@/components/about/table-of-contents";
import { TeamSection } from "@/components/about/team-section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, Mail, Users, Heart, Award, Zap } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = (await getTranslations({
    locale,
    namespace: "home.about.meta",
  })) as (key: string) => string;

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "OpenML",
      "about",
      "mission",
      "open science",
      "machine learning community",
      "reproducible research",
      "collaborative ML",
      "open source AI",
    ],
    alternates: {
      canonical: `/${locale}/about`,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `https://www.openml.org/${locale}/about`,
      siteName: "OpenML",
      images: [
        {
          url: "https://www.openml.org/images/og/about.png",
          width: 1200,
          height: 630,
          alt: "About OpenML - Open Science Machine Learning Platform",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      site: "@open_ml",
      images: ["https://www.openml.org/images/og/about.png"],
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home.about.hero");

  const tocItems = [
    { id: "mission", title: "Our Mission", level: 2 },
    { id: "what-is-openml", title: "What is OpenML?", level: 2 },
    { id: "why-openml", title: "Why OpenML?", level: 2 },
    { id: "features", title: "Key Features", level: 2 },
    { id: "community", title: "Community", level: 2 },
    { id: "team", title: "Core Team", level: 2 },
    { id: "get-involved", title: "Get Involved", level: 2 },
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

          {/* Mission */}
          <section id="mission" className="mb-16 scroll-mt-20">
            <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
                  We want to make machine learning and data analysis{" "}
                  <span className="text-primary font-semibold">
                    simple, accessible, collaborative, and open
                  </span>{" "}
                  with an optimal division of labour between computers and
                  humans.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  OpenML is committed to enabling{" "}
                  <span className="text-primary font-semibold">
                    reproducible science
                  </span>
                  , fostering{" "}
                  <span className="text-primary font-semibold">
                    global collaboration
                  </span>
                  , and accelerating AI research through standardized,
                  FAIR-compliant datasets, tasks, and model evaluations.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* What is OpenML */}
          <section id="what-is-openml" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">What is OpenML?</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground text-lg leading-relaxed">
                OpenML is an{" "}
                <strong>
                  open platform for sharing datasets, algorithms, and
                  experiments
                </strong>{" "}
                to build a global machine learning repository. It enables
                researchers and practitioners to automatically share, organize,
                and reuse machine learning experiments at scale.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Think of OpenML as{" "}
                <strong>GitHub for machine learning experiments</strong> — but
                with automatic versioning, metadata tagging, evaluation
                tracking, and collaborative benchmarking built in.
              </p>
            </div>
          </section>

          {/* Why OpenML */}
          <section id="why-openml" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Why OpenML?</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-lg">
                    <Zap className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Reproducibility
                  </h3>
                  <p className="text-muted-foreground">
                    Every experiment is tracked with complete metadata —
                    algorithms, hyperparameters, datasets, metrics, and hardware
                    — ensuring full reproducibility.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="bg-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-lg">
                    <Award className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Standardization
                  </h3>
                  <p className="text-muted-foreground">
                    All datasets and tasks follow uniform protocols with
                    predefined train/test splits, making results directly
                    comparable across studies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="bg-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-lg">
                    <Users className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Collaboration</h3>
                  <p className="text-muted-foreground">
                    Share workflows, compare algorithms, and build on others'
                    work. OpenML connects researchers worldwide in real-time.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="bg-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-lg">
                    <Heart className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Meta-Learning</h3>
                  <p className="text-muted-foreground">
                    Query thousands of runs to discover patterns, understand
                    algorithm behavior, and enable automated model selection.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Key Features */}
          <section id="features" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Key Features</h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-primary mt-1 text-xl">✓</span>
                    <div>
                      <strong className="text-foreground">
                        1000s of FAIR datasets
                      </strong>{" "}
                      <span className="text-muted-foreground">
                        — uniformly formatted, versioned, and ready to load
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1 text-xl">✓</span>
                    <div>
                      <strong className="text-foreground">
                        Standardized tasks
                      </strong>{" "}
                      <span className="text-muted-foreground">
                        — predefined benchmarks with fixed evaluation protocols
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1 text-xl">✓</span>
                    <div>
                      <strong className="text-foreground">
                        Automatic experiment tracking
                      </strong>{" "}
                      <span className="text-muted-foreground">
                        — flows (pipelines) and runs uploaded seamlessly
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1 text-xl">✓</span>
                    <div>
                      <strong className="text-foreground">
                        Extensive APIs
                      </strong>{" "}
                      <span className="text-muted-foreground">
                        — Python, R, Java, REST — integrate OpenML everywhere
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1 text-xl">✓</span>
                    <div>
                      <strong className="text-foreground">
                        DOI generation
                      </strong>{" "}
                      <span className="text-muted-foreground">
                        — make your datasets, flows, and runs citable
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1 text-xl">✓</span>
                    <div>
                      <strong className="text-foreground">
                        Rich metadata & search
                      </strong>{" "}
                      <span className="text-muted-foreground">
                        — machine-readable, queryable experiment logs
                      </span>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Community */}
          <section id="community" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Community</h2>
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              OpenML is built by a global community of researchers, developers,
              and data scientists. We organize regular workshops, contribute to
              open-source tools, and publish research advancing the field.
            </p>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-primary mb-2 text-4xl font-bold">
                      25,000+
                    </div>
                    <div className="text-muted-foreground">Datasets Shared</div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary mb-2 text-4xl font-bold">
                      15M+
                    </div>
                    <div className="text-muted-foreground">Experiments Run</div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary mb-2 text-4xl font-bold">
                      10,000+
                    </div>
                    <div className="text-muted-foreground">Active Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Core Team */}
          <section id="team" className="mb-16 scroll-mt-20">
            <TeamSection />
          </section>

          {/* Get Involved */}
          <section id="get-involved" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Get Involved</h2>
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              OpenML is an open-source project dependent on community
              contributions. Whether you're a researcher, developer, educator,
              or enthusiast — there's a place for you!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="https://github.com/openml" target="_blank">
                <Button size="lg" className="gap-2">
                  <Github className="h-5 w-5" />
                  GitHub
                </Button>
              </Link>
              <Link
                href="https://github.com/orgs/openml/discussions"
                target="_blank"
              >
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="h-5 w-5" />
                  Discussions
                </Button>
              </Link>
              <Link href="mailto:openmlHQ@googlegroups.com">
                <Button size="lg" variant="outline" className="gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </section>
        </div>

        {/* Table of Contents - Right Sidebar */}
        <aside className="hidden shrink-0 xl:block">
          <TableOfContents items={tocItems} />
        </aside>
      </div>
    </div>
  );
}
