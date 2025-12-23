import { setRequestLocale, getTranslations } from "next-intl/server";
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
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Camera,
  Heart,
  Laptop,
  Coffee,
  PartyPopper,
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
    namespace: "home.meetUs.meta",
  })) as (key: string) => string;

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "OpenML hackathon",
      "machine learning events",
      "open science meetup",
      "ML community",
      "data science hackathon",
      "OpenML workshop",
      "machine learning conference",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: "https://www.openml.org/meet-us",
      siteName: "OpenML",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      site: "@open_ml",
    },
  };
}

// Upcoming events data
const upcomingEvents = [
  {
    id: "winter-2026",
    title: "2026 Winter Hackathon",
    date: "February 16-20, 2026",
    location: "Leiden University, Leiden, The Netherlands",
    description:
      "Join us at Leiden University to work on the next generation of OpenML. By day we'll be at the brand new Science Campus creating the next version of OpenML, and by night we'll relax in the cosy city center.",
    registrationUrl: "https://forms.gle/iPAXC6k85k4L3fs46",
    scheduleUrl:
      "https://docs.google.com/document/d/1jtqKIb91sz8ry7FkJVRobSKD8CnGpwzylFSA97ZdSK4/edit?usp=sharing",
    prepareUrl: "https://github.com/openml/openml.org/blob/master/meetups.md",
    venueUrl:
      "https://www.universiteitleiden.nl/en/dossiers/building-projects/gorlaeus-building",
    isFeatured: true,
  },
];

// Past events for reference
const pastEvents = [
  {
    year: "2024",
    events: ["Spring Hackathon - Eindhoven", "Fall Workshop - Online"],
  },
  {
    year: "2023",
    events: ["Summer Hackathon - Munich", "Winter Sprint - Amsterdam"],
  },
];

export default async function MeetUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home.meetUs");

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <Users className="text-primary h-10 w-10" />
        </div>
        <h1 className="gradient-text mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          {t("hero.subtitle")}
        </p>
      </div>

      {/* Why Hackathons */}
      <section id="why" className="mb-16">
        <Card className="border-primary/20 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <PartyPopper className="h-6 w-6 text-orange-500" />
              {t("why.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-lg">
              {t("why.description")}
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Laptop className="text-primary h-5 w-5" />
                <span>{t("why.bringLaptop")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-amber-600" />
                <span>{t("why.drinksSnacks")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>{t("why.greatCompany")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Upcoming Events */}
      <section id="upcoming" className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">{t("upcoming.title")}</h2>

        {upcomingEvents.map((event) => (
          <Card
            key={event.id}
            className={`mb-6 ${event.isFeatured ? "border-primary/30 bg-primary/5" : ""}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{event.title}</CardTitle>
                  <CardDescription className="mt-2 flex flex-wrap gap-4 text-base">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </span>
                  </CardDescription>
                </div>
                {event.isFeatured && (
                  <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-medium">
                    {t("upcoming.featured")}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{event.description}</p>

              {event.venueUrl && (
                <Link
                  href={event.venueUrl}
                  target="_blank"
                  className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
                >
                  {t("upcoming.viewVenue")}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href={event.registrationUrl} target="_blank">
                  <Button className="gap-2">
                    <Calendar className="h-4 w-4" />
                    {t("upcoming.register")}
                  </Button>
                </Link>
                <Link href={event.scheduleUrl} target="_blank">
                  <Button variant="outline" className="gap-2">
                    {t("upcoming.schedule")}
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={event.prepareUrl} target="_blank">
                  <Button variant="ghost" className="gap-2">
                    {t("upcoming.howToPrepare")}
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        <Alert className="bg-blue-50 dark:bg-blue-950/20">
          <Users className="h-4 w-4" />
          <AlertDescription>
            {t("upcoming.slackAlert").split("Slack")[0]}
            <Link
              href="https://join.slack.com/t/openml/shared_invite/zt-2vu6lq7bv-bHlf~k_kWp6q2mz_oqPJYw"
              target="_blank"
              className="text-primary font-medium hover:underline"
            >
              Slack
            </Link>
            {t("upcoming.slackAlert").split("Slack")[1]}
          </AlertDescription>
        </Alert>
      </section>

      {/* Sponsor Section */}
      <section id="sponsor" className="mb-16">
        <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 dark:border-pink-800 dark:from-pink-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Heart className="h-6 w-6 text-pink-500" />
              {t("sponsor.title")}
            </CardTitle>
            <CardDescription className="text-base">
              {t("sponsor.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t("sponsor.description")}</p>
            <p className="text-muted-foreground">
              {t("sponsor.acknowledgment")}
            </p>
            <div className="pt-2">
              <Link href="mailto:openmlHQ@googlegroups.com">
                <Button variant="outline" className="gap-2">
                  {t("sponsor.contactUs")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Past Events & Photos */}
      <section id="memories" className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">{t("memories.title")}</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Past Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("memories.pastEvents")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastEvents.map((year) => (
                  <div key={year.year}>
                    <h4 className="font-semibold">{year.year}</h4>
                    <ul className="text-muted-foreground ml-4 list-disc text-sm">
                      {year.events.map((event, idx) => (
                        <li key={idx}>{event}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photo Gallery Link */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {t("memories.photoGallery")}
              </CardTitle>
              <CardDescription>
                {t("memories.photoDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="https://www.flickr.com/photos/159879889@N02"
                target="_blank"
              >
                <Button variant="outline" className="w-full gap-2">
                  <Camera className="h-4 w-4" />
                  {t("memories.viewPhotos")}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <Card className="bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-950/30 dark:to-yellow-950/30">
          <CardContent className="py-8">
            <h3 className="mb-4 text-2xl font-bold">{t("cta.title")}</h3>
            <p className="text-muted-foreground mb-6">{t("cta.description")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={upcomingEvents[0]?.registrationUrl || "#"}
                target="_blank"
              >
                <Button size="lg" className="gap-2">
                  <Calendar className="h-5 w-5" />
                  {t("cta.registerNext")}
                </Button>
              </Link>
              <Link
                href="https://join.slack.com/t/openml/shared_invite/zt-2vu6lq7bv-bHlf~k_kWp6q2mz_oqPJYw"
                target="_blank"
              >
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="h-5 w-5" />
                  {t("cta.joinSlack")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
