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
  Scale,
  Heart,
  FileText,
  Award,
  ShieldCheck,
  EyeOff,
  Layers,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import type { Metadata } from "next";
import { CitationCard } from "@/components/terms";

// BibTeX citations
const bibtex = {
  openml: `@article{OpenML2013,
  author = {Joaquin Vanschoren and Jan N. van Rijn and Bernd Bischl and Luis Torgo},
  title = {OpenML: networked science in machine learning},
  journal = {SIGKDD Explorations},
  volume = {15},
  number = {2},
  year = {2013},
  pages = {49-60},
  url = {http://doi.acm.org/10.1145/2641190.2641198},
  doi = {10.1145/2641190.2641198},
  publisher = {ACM}
}`,
  python: `@article{OpenMLPython2021,
  author = {Matthias Feurer and Jan N. van Rijn and Arlind Kadra and Pieter Gijsbers and Neeratyoy Mallik and Sahithya Ravi and Andreas Mueller and Joaquin Vanschoren and Frank Hutter},
  title = {OpenML-Python: an extensible Python API for OpenML},
  journal = {Journal of Machine Learning Research},
  volume = {22},
  number = {100},
  year = {2021},
  pages = {1-5},
  url = {https://jmlr.org/papers/v22/19-920.html}
}`,
  r: `@article{OpenMLR2017,
  author = {Giuseppe Casalicchio and Jakob Bossek and Michel Lang and Dominik Kirchhoff and Pascal Kerschke and Benjamin Hofner and Heidi Seibold and Joaquin Vanschoren and Bernd Bischl},
  title = {OpenML: An R package to connect to the machine learning platform OpenML},
  journal = {Computational Statistics},
  volume = {32},
  number = {3},
  year = {2017},
  pages = {1-15},
  url = {http://doi.acm.org/10.1007/s00180-017-0742-2},
  doi = {10.1007/s00180-017-0742-2},
  publisher = {Springer Nature}
}`,
  benchmark: `@article{OpenMLBenchmarking2021,
  author = {Bernd Bischl and Giuseppe Casalicchio and Matthias Feurer and Pieter Gijsbers and Frank Hutter and Michel Lang and Rafael Gomes Mantovani and Jan N. van Rijn and Joaquin Vanschoren},
  title = {OpenML Benchmarking Suites},
  journal = {NeurIPS Datasets and Benchmarks Track},
  year = {2021},
  url = {https://openreview.net/forum?id=OCrD8ycKjG}
}`,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = (await getTranslations({
    locale,
    namespace: "home.terms.meta",
  })) as (key: string) => string;

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "terms",
      "citation",
      "license",
      "OpenML citation",
      "BibTeX",
      "Creative Commons",
      "open source",
      "machine learning",
      "academic citation",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home.terms");

  const tocItems = [
    { id: "licenses", title: "Licenses", level: 2 },
    { id: "citation", title: "Citation", level: 2 },
    { id: "cite-openml", title: "Cite OpenML", level: 3 },
    { id: "cite-python", title: "Cite Python API", level: 3 },
    { id: "cite-r", title: "Cite R API", level: 3 },
    { id: "cite-benchmark", title: "Cite Benchmarking", level: 3 },
    { id: "terms-of-use", title: "Terms of Use", level: 2 },
    { id: "honor-code", title: "Honor Code", level: 3 },
    { id: "usage-terms", title: "Usage Terms", level: 3 },
    { id: "privacy", title: "Privacy Policy", level: 3 },
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

          {/* Licenses Section */}
          <section id="licenses" className="mb-16 scroll-mt-20">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <Scale className="text-primary h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold">{t("licenses.title")}</h2>
            </div>

            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-6 text-lg">
                  {t("licenses.description")}
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  {/* CC-BY 4.0 */}
                  <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <span className="text-2xl">🅭</span>
                        CC-BY 4.0
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3 text-sm">
                        {t("licenses.ccby")}
                      </p>
                      <Link
                        href="http://creativecommons.org/licenses/by/4.0/"
                        target="_blank"
                      >
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="h-3 w-3" />
                          View License
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* CC0 */}
                  <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <span className="text-2xl">🄍</span>
                        CC0 Public Domain
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3 text-sm">
                        {t("licenses.cc0")}
                      </p>
                      <Link
                        href="https://creativecommons.org/publicdomain/zero/1.0/"
                        target="_blank"
                      >
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="h-3 w-3" />
                          View License
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* BSD-3 */}
                  <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <span className="text-2xl">⚖️</span>
                        BSD-3-Clause
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3 text-sm">
                        {t("licenses.bsd")}
                      </p>
                      <Link
                        href="https://opensource.org/licenses/BSD-3-Clause"
                        target="_blank"
                      >
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="h-3 w-3" />
                          View License
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Citation Section */}
          <section id="citation" className="mb-16 scroll-mt-20">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950/50">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{t("citation.title")}</h2>
                <p className="text-muted-foreground">
                  {t("citation.subtitle")}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Cite OpenML */}
              <div id="cite-openml" className="scroll-mt-20">
                <CitationCard
                  title={t("citation.openml.title")}
                  description={t("citation.openml.description")}
                  icon={<Layers className="h-6 w-6 text-green-500" />}
                  paperUrl="https://www.kdd.org/exploration_files/15-2-2013-12.pdf#page=51"
                  bibtex={bibtex.openml}
                />
              </div>

              {/* Cite Python */}
              <div id="cite-python" className="scroll-mt-20">
                <CitationCard
                  title={t("citation.python.title")}
                  description={t("citation.python.description")}
                  icon={
                    <svg
                      className="h-6 w-6 text-yellow-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z" />
                    </svg>
                  }
                  paperUrl="https://jmlr.org/papers/v22/19-920.html"
                  bibtex={bibtex.python}
                />
              </div>

              {/* Cite R */}
              <div id="cite-r" className="scroll-mt-20">
                <CitationCard
                  title={t("citation.r.title")}
                  description={t("citation.r.description")}
                  icon={
                    <svg
                      className="h-6 w-6 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2.247C5.935 2.247.854 7.328.854 13.393c0 5.035 3.381 9.273 8.001 10.567v-2.812H6.502c-.812 0-1.463-.652-1.463-1.463 0-.812.652-1.463 1.463-1.463h2.353v-1.963H6.502c-1.89 0-3.426 1.536-3.426 3.426 0 1.89 1.536 3.426 3.426 3.426h2.353v.802c.515.066 1.04.1 1.573.1h.427v-4.328h1.463V6.428h2.39c.89 0 1.609.72 1.609 1.608 0 .89-.72 1.609-1.609 1.609h-.927v1.963h.927c1.97 0 3.572-1.602 3.572-3.572 0-1.97-1.602-3.572-3.572-3.572h-2.39v-.39c0-.812-.651-1.463-1.463-1.463h-.927v-.39c2.727-.312 4.854-2.633 4.854-5.454 0-3.034-2.46-5.494-5.494-5.494zm0 1.963c1.95 0 3.531 1.582 3.531 3.531 0 1.95-1.582 3.531-3.531 3.531-1.95 0-3.531-1.582-3.531-3.531 0-1.95 1.582-3.531 3.531-3.531z" />
                    </svg>
                  }
                  paperUrl="https://arxiv.org/abs/1701.01293"
                  bibtex={bibtex.r}
                />
              </div>

              {/* Cite Benchmark */}
              <div id="cite-benchmark" className="scroll-mt-20">
                <CitationCard
                  title={t("citation.benchmark.title")}
                  description={t("citation.benchmark.description")}
                  icon={<BarChart3 className="h-6 w-6 text-purple-500" />}
                  paperUrl="https://datasets-benchmarks-proceedings.neurips.cc/paper_files/paper/2021/hash/c7e1249ffc03eb9ded908c236bd1996d-Abstract-round2.html"
                  bibtex={bibtex.benchmark}
                />
              </div>
            </div>
          </section>

          {/* Terms of Use Section */}
          <section id="terms-of-use" className="mb-16 scroll-mt-20">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/50">
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
              <h2 className="text-3xl font-bold">{t("termsOfUse.title")}</h2>
            </div>

            <div className="space-y-6">
              {/* Honor Code */}
              <div id="honor-code" className="scroll-mt-20">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950/50">
                        <Award className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <CardTitle>{t("termsOfUse.honorCode.title")}</CardTitle>
                        <CardDescription>
                          {t("termsOfUse.honorCode.subtitle")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-muted-foreground space-y-3">
                      <li className="flex gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>{t("termsOfUse.honorCode.items.cite")}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>{t("termsOfUse.honorCode.items.share")}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>{t("termsOfUse.honorCode.items.respect")}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>{t("termsOfUse.honorCode.items.quality")}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>{t("termsOfUse.honorCode.items.feedback")}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Usage Terms */}
              <div id="usage-terms" className="scroll-mt-20">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/50">
                        <ShieldCheck className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <CardTitle>
                          {t("termsOfUse.usageTerms.title")}
                        </CardTitle>
                        <CardDescription>
                          {t("termsOfUse.usageTerms.subtitle")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground space-y-4">
                      <p>{t("termsOfUse.usageTerms.intro")}</p>
                      <ul className="space-y-2">
                        <li className="flex gap-2">
                          <span className="text-primary">→</span>
                          <span>{t("termsOfUse.usageTerms.items.free")}</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">→</span>
                          <span>{t("termsOfUse.usageTerms.items.api")}</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">→</span>
                          <span>{t("termsOfUse.usageTerms.items.abuse")}</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">→</span>
                          <span>
                            {t("termsOfUse.usageTerms.items.warranty")}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Privacy Policy */}
              <div id="privacy" className="scroll-mt-20">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/50">
                        <EyeOff className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <CardTitle>{t("termsOfUse.privacy.title")}</CardTitle>
                        <CardDescription>
                          {t("termsOfUse.privacy.subtitle")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground space-y-4">
                      <p>{t("termsOfUse.privacy.intro")}</p>
                      <ul className="space-y-2">
                        <li className="flex gap-2">
                          <span className="text-primary">→</span>
                          <span>{t("termsOfUse.privacy.items.collect")}</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">→</span>
                          <span>{t("termsOfUse.privacy.items.usage")}</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">→</span>
                          <span>{t("termsOfUse.privacy.items.share")}</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">→</span>
                          <span>{t("termsOfUse.privacy.items.cookies")}</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <Card className="from-primary/5 to-primary/10 border-primary/20 bg-linear-to-br">
            <CardContent className="pt-6 text-center">
              <h3 className="mb-4 text-2xl font-bold">{t("contact.title")}</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                {t("contact.description")}
              </p>
              <Link href="mailto:openmlHQ@googlegroups.com">
                <Button size="lg" className="gap-2">
                  {t("contact.button")}
                </Button>
              </Link>
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
