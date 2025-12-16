"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";

interface CoreTeamMember {
  user_id: number;
  first_name: string;
  last_name: string;
  bio: string;
  image: string;
}

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function CoreTeamMemberCard({ member }: { member: CoreTeamMember }) {
  const fullName = `${member.first_name} ${member.last_name}`;
  const initials = getInitials(member.first_name, member.last_name);

  return (
    <Card className="group transition-all hover:shadow-lg">
      <CardContent className="flex flex-col items-center pt-8 pb-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 blur-lg transition-opacity group-hover:opacity-40" />
          <Avatar className="relative h-24 w-24 border-4 border-white shadow-xl">
            <AvatarImage src={member.image} alt={fullName} />
            <AvatarFallback className="bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 text-xl font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <h3 className="mb-2 text-center text-lg font-semibold">{fullName}</h3>
        <p className="text-muted-foreground line-clamp-3 text-center text-sm">
          {member.bio}
        </p>
      </CardContent>
    </Card>
  );
}

function ContributorCard({ contributor }: { contributor: Contributor }) {
  if (contributor.login.includes("[bot]")) return null;

  return (
    <Link
      href={contributor.html_url}
      target="_blank"
      className="group flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <Avatar className="h-10 w-10 transition-transform group-hover:scale-110">
        <AvatarImage src={contributor.avatar_url} alt={contributor.login} />
        <AvatarFallback>
          {contributor.login.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 truncate">
        <p className="text-sm font-medium">{contributor.login}</p>
        <p className="text-muted-foreground text-xs">
          {contributor.contributions} contributions
        </p>
      </div>
      <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

export function TeamSection() {
  const [coreTeam, setCoreTeam] = useState<CoreTeamMember[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock core team data - in production this would come from the API
  useEffect(() => {
    const mockCoreTeam: CoreTeamMember[] = [
      {
        user_id: 1,
        first_name: "Joaquin",
        last_name: "Vanschoren",
        bio: "Project Lead, Associate Professor at TU Eindhoven. Founded OpenML to democratize machine learning research.",
        image: "/avatars/joaquin.jpg",
      },
      {
        user_id: 2,
        first_name: "Pieter",
        last_name: "Gijsbers",
        bio: "Core Developer, PhD candidate at TU Eindhoven. Focuses on AutoML and reproducible machine learning workflows.",
        image: "/avatars/pieter.jpg",
      },
      {
        user_id: 3,
        first_name: "Jan",
        last_name: "van Rijn",
        bio: "Core Contributor, Assistant Professor at LIACS, Leiden University. Expert in meta-learning and algorithm selection.",
        image: "/avatars/jan.jpg",
      },
      {
        user_id: 4,
        first_name: "Bernd",
        last_name: "Bischl",
        bio: "Core Contributor, Professor at LMU Munich. Leads research in statistical learning, optimization, and AutoML.",
        image: "/avatars/bernd.jpg",
      },
      {
        user_id: 5,
        first_name: "Matthias",
        last_name: "Feurer",
        bio: "Core Contributor, Senior Researcher at Freiburg University. Develops Auto-sklearn and contributes to AutoML research.",
        image: "/avatars/matthias.jpg",
      },
      {
        user_id: 6,
        first_name: "Giuseppe",
        last_name: "Casalicchio",
        bio: "Core Contributor, Researcher at LMU Munich. Works on interpretable machine learning and AutoML systems.",
        image: "/avatars/giuseppe.jpg",
      },
    ];

    setCoreTeam(mockCoreTeam);
  }, []);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const repos = [
          "OpenML",
          "openml.org",
          "openml-python",
          "openml-r",
          "openml-java",
          "openml-data",
          "blog",
          "docs",
          "openml-tensorflow",
          "openml-pytorch",
          "benchmark-suites",
          "automlbenchmark",
          "server-api",
        ];

        const responses = await Promise.all(
          repos.map((repo) =>
            fetch(
              `https://api.github.com/repos/openml/${repo}/contributors`,
            ).then((res) => (res.ok ? res.json() : [])),
          ),
        );

        const contributorsMap = new Map<string, Contributor>();

        responses
          .flat()
          .filter((c) => c && c.login)
          .forEach((contributor) => {
            if (contributorsMap.has(contributor.login)) {
              const existing = contributorsMap.get(contributor.login)!;
              existing.contributions += contributor.contributions;
            } else {
              contributorsMap.set(contributor.login, {
                login: contributor.login,
                avatar_url: contributor.avatar_url,
                html_url: contributor.html_url,
                contributions: contributor.contributions,
              });
            }
          });

        const sortedContributors = Array.from(contributorsMap.values()).sort(
          (a, b) => b.contributions - a.contributions,
        );

        setContributors(sortedContributors);
      } catch (err) {
        setError("Failed to load contributors. Please try again later.");
        console.error("Error fetching contributors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  return (
    <div className="space-y-16">
      {/* Core Team */}
      <div>
        <div className="mb-8">
          <h2 className="mb-3 text-3xl font-bold">Core Team</h2>
          <p className="text-muted-foreground text-lg">
            The dedicated researchers and developers maintaining OpenML, from
            institutions worldwide.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coreTeam.map((member) => (
            <CoreTeamMemberCard key={member.user_id} member={member} />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="https://docs.openml.org/Governance/"
            target="_blank"
            className="text-primary inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <Github className="h-4 w-4" />
            Learn about our governance model
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Contributors */}
      <div>
        <div className="mb-8">
          <h2 className="mb-3 text-3xl font-bold">Contributors</h2>
          <p className="text-muted-foreground mb-4 text-lg">
            OpenML is made possible by {contributors.length}+ amazing
            contributors across all our repositories.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="https://github.com/openml/openml.org/graphs/contributors"
              target="_blank"
            >
              <Badge variant="outline" className="gap-1 hover:bg-slate-100">
                <Github className="h-3 w-3" />
                Website
              </Badge>
            </Link>
            <Link
              href="https://github.com/openml/OpenML/graphs/contributors"
              target="_blank"
            >
              <Badge variant="outline" className="gap-1 hover:bg-slate-100">
                <Github className="h-3 w-3" />
                Backend
              </Badge>
            </Link>
            <Link
              href="https://github.com/openml/openml-python/graphs/contributors"
              target="_blank"
            >
              <Badge variant="outline" className="gap-1 hover:bg-slate-100">
                <Github className="h-3 w-3" />
                Python API
              </Badge>
            </Link>
            <Link
              href="https://github.com/openml/openml-r/graphs/contributors"
              target="_blank"
            >
              <Badge variant="outline" className="gap-1 hover:bg-slate-100">
                <Github className="h-3 w-3" />R API
              </Badge>
            </Link>
            <Link
              href="https://github.com/openml/openml-java/graphs/contributors"
              target="_blank"
            >
              <Badge variant="outline" className="gap-1 hover:bg-slate-100">
                <Github className="h-3 w-3" />
                Java API
              </Badge>
            </Link>
          </div>
        </div>

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-destructive text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {contributors.slice(0, 30).map((contributor) => (
                  <ContributorCard
                    key={contributor.login}
                    contributor={contributor}
                  />
                ))}
              </div>
              {contributors.length > 30 && (
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    And {contributors.length - 30} more contributors...
                  </p>
                  <Link
                    href="https://github.com/orgs/openml/people"
                    target="_blank"
                    className="text-primary mt-2 inline-flex items-center gap-2 text-sm font-medium hover:underline"
                  >
                    View all contributors on GitHub
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
