import { setRequestLocale, getTranslations } from "next-intl/server";
import { TableOfContents } from "@/components/about/table-of-contents";
import { Card, CardContent } from "@/components/ui/card";
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
  Database,
  MessageSquare,
  Globe,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Heart,
  Layers,
  PenTool,
  Megaphone,
  CircleDollarSign,
  Handshake,
  Medal,
  Shirt,
  PartyPopper,
  UserCog,
  Rocket,
  Briefcase,
  HandHeart,
} from "lucide-react";
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
    { id: "overview", title: "Anyone Can Change the World", level: 2 },
    { id: "contribute", title: "Contribute to OpenML", level: 2 },
    { id: "code", title: "Code", level: 3 },
    { id: "design", title: "Design & UX", level: 3 },
    { id: "documentation", title: "Documentation", level: 3 },
    { id: "data", title: "Data & Experiments", level: 3 },
    { id: "community", title: "Community", level: 3 },
    { id: "donate", title: "Make a Donation", level: 2 },
    { id: "sponsor", title: "Become a Sponsor", level: 2 },
  ];

  const roleCards = [
    {
      title: "Are you a developer?",
      description:
        "We want to make OpenML ridiculously easy to use and empowering. Contribute your skill and expertise to make OpenML better for yourself and others, either online (on GitHub) or during one of our coding sprints.",
      icon: UserCog,
      color: "from-red-500 to-rose-600",
      borderColor: "border-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      textColor: "text-red-600 dark:text-red-400",
      cta: { label: "Get started", href: "#contribute" },
    },
    {
      title: "Are you a scientist?",
      description:
        "We want to empower people to change the world for the better. You can help by creating or sharing useful datasets and machine learning pipelines, or by extending OpenML to make it more useful in science and discovery.",
      icon: Rocket,
      color: "from-orange-500 to-amber-600",
      borderColor: "border-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      textColor: "text-orange-600 dark:text-orange-400",
      cta: { label: "Get started", href: "#contribute" },
    },
    {
      title: "Are you an executive?",
      description:
        "OpenML helps your team discover machine learning assets and automate processes. You can encourage your developers to help out, host a coding sprint, become an official sponsor, or partner with us. Legendary.",
      icon: Briefcase,
      color: "from-blue-500 to-indigo-600",
      borderColor: "border-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      textColor: "text-blue-600 dark:text-blue-400",
      cta: { label: "Become a sponsor", href: "#sponsor" },
    },
    {
      title: "All help is welcome",
      description:
        "OpenML depends on all of us. You can help keep OpenML free and support our community by making a donation. You can also join us at an OpenML event, or organize one yourself! Or maybe you have another great idea?",
      icon: HandHeart,
      color: "from-emerald-500 to-green-600",
      borderColor: "border-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
      cta: { label: "Make a donation", href: "#donate" },
    },
  ];

  return (
    <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative flex min-h-screen gap-8">
        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Hero Section — Matching homepage hero style */}
          <div className="dark:bg-muted/30 relative mb-12 overflow-hidden rounded-2xl bg-slate-50 px-8 py-12 md:px-12 md:py-16">
            <div className="text-center">
              <div className="mb-2 inline-block rounded-sm bg-slate-100 px-4 py-1 text-sm font-medium dark:bg-slate-800">
                <span className="gradient-text">Open Source Community</span>
              </div>
              <h1 className="gradient-text my-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {t("title")}
              </h1>
              <div className="mx-auto max-w-2xl space-y-1 text-lg leading-relaxed text-slate-700 dark:text-slate-300 md:text-xl">
                <p>Here&apos;s to the crazy ones.</p>
                <p>The ones who want to set machine learning free.</p>
                <p>They&apos;re not fond of hype, or irreproducible claims.</p>
                <p>They believe that only openness will push us forward.</p>
                <p>And by sharing the best data and models,</p>
                <p className="gradient-text font-semibold">
                  we will make the world better, together.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link href="https://github.com/openml" target="_blank">
                  <button className="gradient-bg glow-effect text-bold inline-flex transform gap-2 rounded-lg px-6 py-3 text-white transition hover:scale-105 hover:opacity-90">
                    <Github className="h-5 w-5" />
                    <span>Start on GitHub</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
                <Link href="#donate">
                  <button className="text-bold flex items-center space-x-2 rounded-lg bg-white px-6 py-3 text-sm text-slate-900 shadow-sm outline -outline-offset-1 outline-slate-200 transition hover:scale-105 hover:opacity-90 dark:bg-slate-800 dark:text-white dark:outline-white/10">
                    <CircleDollarSign className="h-5 w-5" />
                    <span>Support OpenML</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* "Anyone can change the world" — Role-based cards */}
          <section id="overview" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">
              Anyone Can Change the World
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {roleCards.map((card) => (
                <Card
                  key={card.title}
                  className={`overflow-hidden border-l-4 ${card.borderColor} transition-shadow hover:shadow-lg`}
                >
                  <CardContent className="pt-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bgColor}`}
                      >
                        <card.icon className={`h-6 w-6 ${card.textColor}`} />
                      </div>
                      <h3 className="text-lg font-semibold">{card.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {card.description}
                    </p>
                    <Link href={card.cta.href}>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`gap-1.5 ${card.textColor} hover:${card.bgColor}`}
                      >
                        {card.cta.label}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Contribute to OpenML */}
          <section id="contribute" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Contribute to OpenML</h2>

            {/* Code — Blue */}
            <div id="code" className="mb-5 scroll-mt-20">
              <Card className="overflow-hidden border-l-4 border-l-blue-500 transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/50">
                      <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        Good at coding?
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Please see the issue trackers of the different OpenML
                        components that you can contribute to.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        label: "Website",
                        href: "https://github.com/openml/openml.org/issues",
                        icon: Globe,
                      },
                      {
                        label: "REST API",
                        href: "https://github.com/openml/OpenML/issues",
                        icon: Layers,
                      },
                      {
                        label: "Python API",
                        href: "https://github.com/openml/openml-python/issues",
                        icon: Code,
                      },
                      {
                        label: "R API",
                        href: "https://github.com/openml/openml-r/issues",
                        icon: Code,
                      },
                      {
                        label: "Java API",
                        href: "https://github.com/openml/openml-java/issues",
                        icon: Code,
                      },
                      {
                        label: "Docs",
                        href: "https://docs.openml.org/Website/",
                        icon: BookOpen,
                      },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        target="_blank"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
                        >
                          <item.icon className="h-3.5 w-3.5" />
                          {item.label}
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Web Design / UX — Purple */}
            <div id="design" className="mb-5 scroll-mt-20">
              <Card className="overflow-hidden border-l-4 border-l-purple-500 transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/50">
                      <PenTool className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        Good at web design / UX?
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Please help us improve the website to make it nicer and
                        more intuitive for everyone.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="https://docs.openml.org/Website/"
                      target="_blank"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/30"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        Website docs
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                    <Link
                      href="https://github.com/openml/openml.org/issues"
                      target="_blank"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/30"
                      >
                        <Github className="h-3.5 w-3.5" />
                        Website code and issues
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Documentation — Amber */}
            <div id="documentation" className="mb-5 scroll-mt-20">
              <Card className="overflow-hidden border-l-4 border-l-amber-500 transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/50">
                      <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        Good at explaining things?
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        OpenML should be easy to understand for everyone. Please
                        help us improve the documentation whenever something is
                        not 100% clear.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href="https://docs.openml.org" target="_blank">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        OpenML docs
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                    <Link
                      href="https://docs.openml.org/OpenML-Docs/"
                      target="_blank"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                      >
                        <Github className="h-3.5 w-3.5" />
                        How to update the docs
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Datasets — Green */}
            <div id="data" className="mb-5 scroll-mt-20">
              <Card className="overflow-hidden border-l-4 border-l-emerald-500 transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50">
                      <Database className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        Do you care about good datasets?
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        High quality datasets are crucial for machine learning.
                        Please add new interesting datasets or help check the
                        quality of the existing ones.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="https://github.com/openml/openml-data/issues"
                    target="_blank"
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                    >
                      <Github className="h-3.5 w-3.5" />
                      Dataset issue tracker
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Community Ambassador — Rose */}
            <div id="community" className="mb-5 scroll-mt-20">
              <Card className="overflow-hidden border-l-4 border-l-rose-400 transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/50">
                      <Megaphone className="h-6 w-6 text-rose-500 dark:text-rose-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        Help us build a stronger community
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Become an OpenML ambassador! Help us make OpenML better
                        known in your community, write about OpenML and how you
                        use it, or give us a shout-out.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="https://github.com/orgs/openml/discussions"
                      target="_blank"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/30"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        OpenML Discussions
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                    <Link
                      href="https://twitter.com/open_ml"
                      target="_blank"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/30"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        OpenML on X/Twitter
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Make a Donation */}
          <section id="donate" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">Make a Donation</h2>
            <Card className="overflow-hidden border-l-4 border-l-sky-500">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950/50">
                    <CircleDollarSign className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="text-xl font-semibold">You are awesome!</h3>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  By making a donation, small or large, you help us run coding
                  sprints and outreach activities, keep our community happy and
                  engaged, and ensure that we have the basic infrastructure to
                  keep the platform free for everyone. You can sponsor us via
                  OpenCollective or GitHub. All donors are celebrated in our hall
                  of fame, and we are fully transparent on how your
                  contributions are used.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="https://opencollective.com/openml"
                    target="_blank"
                  >
                    <Button
                      size="lg"
                      className="gap-2 bg-sky-600 hover:bg-sky-700"
                    >
                      <Heart className="h-5 w-5" />
                      Donate via OpenCollective
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href="https://github.com/sponsors/openml"
                    target="_blank"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 border-sky-300 text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-400 dark:hover:bg-sky-950/30"
                    >
                      <Github className="h-5 w-5" />
                      GitHub Sponsors
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Become a Sponsor */}
          <section id="sponsor" className="mb-16 scroll-mt-20">
            <h2 className="mb-6 text-3xl font-bold">
              Become an Official Sponsor
            </h2>

            {/* Why */}
            <Card className="mb-5 overflow-hidden border-l-4 border-l-violet-500">
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/50">
                    <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Why?</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Simply put, without our generous sponsors, OpenML would not be
                  able to make all its resources and services available for free
                  to the entire world. By donating to OpenML you further the
                  project&apos;s mission to democratize machine learning
                  research. Your donations will be used to run engaging community
                  events (which require venues, food, and swag), support our
                  community manager and developer, and run our infrastructure
                  (including servers and storage).
                </p>
              </CardContent>
            </Card>

            {/* What do we offer */}
            <Card className="mb-5 overflow-hidden border-l-4 border-l-violet-500">
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/50">
                    <Handshake className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-xl font-semibold">What do we offer?</h3>
                </div>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  We are open to many forms of sponsorship. While we have a few
                  sponsorship levels on our Open Collective page, we would also
                  love to hear from you and learn how we could better align with
                  your goals. Below are examples of possible benefits:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      icon: Medal,
                      text: "Your logo on our website and in our presentations, shown more prominently for larger sponsors.",
                    },
                    {
                      icon: Shirt,
                      text: "We will send you OpenML T-shirts, stickers... Or, you can send us materials to hand out at our events.",
                    },
                    {
                      icon: MessageSquare,
                      text: "We will mention your support in talks and videos. We'll work with you to get the right message across.",
                    },
                    {
                      icon: PartyPopper,
                      text: "Come give a talk at one of our coding sprints or events, or simply come to work together with us.",
                    },
                    {
                      icon: Lightbulb,
                      text: "Let us know what you would like to see developed on OpenML, and we'll realize it together.",
                    },
                    {
                      icon: Users,
                      text: "Become a partner. If you support a full time developer, or let your own developers contribute, you can help shape the future of OpenML.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-3 rounded-lg bg-violet-50/50 p-3 dark:bg-violet-950/20"
                    >
                      <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
                      <p className="text-muted-foreground text-sm">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <Link href="mailto:openmlHQ@googlegroups.com">
                    <Button
                      variant="outline"
                      className="gap-2 border-violet-300 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-950/30"
                    >
                      <Mail className="h-4 w-4" />
                      Get in touch
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* How */}
            <Card className="overflow-hidden border-l-4 border-l-violet-500">
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/50">
                    <CircleDollarSign className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-xl font-semibold">How?</h3>
                </div>
                <p className="text-muted-foreground mb-5 leading-relaxed">
                  You can sponsor us through Open Collective or GitHub. All
                  sponsors and the amount of sponsoring are acknowledged in our
                  hall of fame, and we&apos;ll be fully transparent on how your
                  sponsorship makes OpenML better every day. This collective is
                  fiscally hosted by our not-for-profit Open Machine Learning
                  Foundation. If preferred, you can also donate directly to the
                  Foundation.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="https://opencollective.com/openml"
                    target="_blank"
                  >
                    <Button
                      size="lg"
                      className="gap-2 bg-violet-600 hover:bg-violet-700"
                    >
                      <Heart className="h-5 w-5" />
                      OpenCollective
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href="https://github.com/sponsors/openml"
                    target="_blank"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 border-violet-300 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-950/30"
                    >
                      <Github className="h-5 w-5" />
                      GitHub Sponsors
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Final Call to Action */}
          <div className="overflow-hidden rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-center text-white shadow-lg md:p-12">
            <h3 className="mb-3 text-3xl font-bold">Ready to Contribute?</h3>
            <p className="mx-auto mb-8 max-w-lg text-lg text-indigo-100">
              Your contribution &mdash; no matter how small &mdash; helps build
              the future of open machine learning.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="https://github.com/openml" target="_blank">
                <Button
                  size="lg"
                  className="gap-2 bg-white text-indigo-700 hover:bg-indigo-50"
                >
                  <Github className="h-5 w-5" />
                  Start on GitHub
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="mailto:openmlHQ@googlegroups.com">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/40 text-white hover:bg-white/10"
                >
                  <Mail className="h-5 w-5" />
                  Ask Questions
                </Button>
              </Link>
              <Link
                href="https://opencollective.com/openml"
                target="_blank"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/40 text-white hover:bg-white/10"
                >
                  <Heart className="h-5 w-5" />
                  Donate
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Table of Contents Sidebar */}
        <aside className="hidden shrink-0 xl:block">
          <TableOfContents items={tocItems} />
        </aside>
      </div>
    </div>
  );
}
