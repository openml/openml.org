"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Database,
  Trophy,
  Cog,
  FlaskConical,
  Calendar,
  X,
  MessageSquare,
  TrendingUp,
  LogOut,
  Download,
  Eye,
  FileText,
  Users,
  Star,
  Award,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface UserStats {
  // Contribution counts
  datasetsCreated: number;
  flowsCreated: number;
  runsCreated: number;
  discussionsPosted: number;

  // Impact metrics
  totalDownloads: number;
  totalViews: number;
  totalCitations: number;
  flowReuses: number;

  // Top contributions
  topDataset?: {
    name: string;
    downloads: number;
  };
  topFlow?: {
    name: string;
    reuses: number;
  };

  // Activity
  weeklyActivity: number[];
}

interface ReputationBreakdown {
  downloads: number;
  citations: number;
  flowReuses: number;
  discussions: number;
  total: number;
}

interface FocusCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

export function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    username: string;
    id?: string;
  } | null>(null);
  const [showFocusCards, setShowFocusCards] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    // Contribution counts - start at 0
    datasetsCreated: 0,
    flowsCreated: 0,
    runsCreated: 0,
    discussionsPosted: 0,

    // Impact metrics - start at 0
    totalDownloads: 0,
    totalViews: 0,
    totalCitations: 0,
    flowReuses: 0,

    // Top contributions
    topDataset: undefined,
    topFlow: undefined,

    // Activity
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.openml.org";

  // Fetch user stats from OpenML API
  const fetchUserStats = useCallback(
    async (userId: string) => {
      setIsLoadingStats(true);
      try {
        // Fetch datasets, flows, and runs in parallel
        const [datasetsRes, flowsRes, runsRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/json/data/list?uploader=${userId}`).catch(
            () => null,
          ),
          fetch(`${API_URL}/api/v1/json/flow/list?uploader=${userId}`).catch(
            () => null,
          ),
          fetch(
            `${API_URL}/api/v1/json/run/list?uploader=${userId}&limit=1000`,
          ).catch(() => null),
        ]);

        let datasetsCreated = 0;
        let flowsCreated = 0;
        let runsCreated = 0;
        let topDataset: { name: string; downloads: number } | undefined;
        let topFlow: { name: string; reuses: number } | undefined;
        const totalDownloads = 0;

        // Parse datasets
        if (datasetsRes?.ok) {
          const data = await datasetsRes.json();
          if (data?.data?.dataset) {
            const datasets = Array.isArray(data.data.dataset)
              ? data.data.dataset
              : [data.data.dataset];
            datasetsCreated = datasets.length;

            // Find top dataset (by name for now, downloads not in list response)
            if (datasets.length > 0) {
              topDataset = {
                name: datasets[0].name || "Unknown",
                downloads: 0, // Would need separate API call per dataset
              };
            }
          }
        }

        // Parse flows
        if (flowsRes?.ok) {
          const data = await flowsRes.json();
          if (data?.flows?.flow) {
            const flows = Array.isArray(data.flows.flow)
              ? data.flows.flow
              : [data.flows.flow];
            flowsCreated = flows.length;

            if (flows.length > 0) {
              topFlow = {
                name: flows[0].name || "Unknown",
                reuses: 0,
              };
            }
          }
        }

        // Parse runs
        if (runsRes?.ok) {
          const data = await runsRes.json();
          if (data?.runs?.run) {
            const runs = Array.isArray(data.runs.run)
              ? data.runs.run
              : [data.runs.run];
            runsCreated = runs.length;
          }
        }

        setStats((prev) => ({
          ...prev,
          datasetsCreated,
          flowsCreated,
          runsCreated,
          topDataset,
          topFlow,
          totalDownloads,
        }));
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    },
    [API_URL],
  );

  // Calculate reputation score (StackOverflow style)
  const calculateReputation = (): ReputationBreakdown => {
    const downloads = stats.totalDownloads * 2;
    const citations = stats.totalCitations * 10;
    const flowReuses = stats.flowReuses * 5;
    const discussions = stats.discussionsPosted * 3;

    return {
      downloads,
      citations,
      flowReuses,
      discussions,
      total: downloads + citations + flowReuses + discussions,
    };
  };

  const reputation = calculateReputation();

  useEffect(() => {
    // Wait for session to load before checking auth
    if (status === "loading") {
      return;
    }

    // Redirect to sign-in if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    // Load user from NextAuth session or localStorage fallback
    if (status === "authenticated" && session?.user) {
      const userId = session.user.id;
      const isLocalUser = (session.user as any).isLocalUser;

      setUser({
        name: session.user.name || session.user.username || "User",
        username:
          session.user.username || session.user.email?.split("@")[0] || "user",
        id: userId,
      });

      // Only fetch stats from OpenML API if user exists on openml.org
      // Local-only users (OAuth, local registration) don't have data there
      if (userId && !isLocalUser) {
        fetchUserStats(userId);
      } else {
        // Local user - show zeros, don't fetch incorrect data
        setIsLoadingStats(false);
      }
    } else {
      // Fallback to localStorage for backward compatibility
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const firstName = userData.firstName || "";
          const lastName = userData.lastName || "";
          setUser({
            name:
              `${firstName} ${lastName}`.trim() || userData.username || "User",
            username: userData.username || "user",
            id: userData.id,
          });

          if (userData.id) {
            fetchUserStats(userData.id);
          } else {
            setIsLoadingStats(false);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          setIsLoadingStats(false);
        }
      } else {
        setIsLoadingStats(false);
      }
    }
  }, [session, status, router, fetchUserStats]);

  const focusCards: FocusCard[] = [
    {
      id: "datasets",
      title: "Datasets",
      description: "Explore and share datasets",
      icon: <Database className="h-8 w-8" />,
      color: "from-blue-400 via-blue-500 to-green-500",
      href: "/datasets",
    },
    {
      id: "tasks",
      title: "Tasks",
      description: "Define ML problems and benchmarks",
      icon: <Trophy className="h-8 w-8" />,
      color: "from-yellow-400 via-yellow-500 to-green-500",
      href: "/tasks",
    },
    {
      id: "flows",
      title: "Flows",
      description: "Share ML workflows and models",
      icon: <FlaskConical className="h-8 w-8" />,
      color: "from-yellow-400 via-green-500 to-blue-500",
      href: "/flows",
    },
  ];

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8 sm:px-6">
        {/* Welcome Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome, {user.name}!
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              OpenML is the place to share datasets, workflows, and collaborate
              on machine learning research.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Stats Cards Row - Reputation & Activity */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {/* Reputation Score */}
          <Card className="border-2 border-amber-200 bg-white dark:border-amber-800 dark:bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  REPUTATION
                </CardTitle>
                {isLoadingStats ? (
                  <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                ) : (
                  <Award className="h-5 w-5 text-amber-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-slate-900 dark:text-white">
                {isLoadingStats ? "..." : reputation.total.toLocaleString()}
              </div>
              <p className="mt-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                research impact score
              </p>
              <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Downloads</span>
                  <span className="font-medium">
                    {isLoadingStats ? "-" : reputation.downloads}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Citations</span>
                  <span className="font-medium">
                    {isLoadingStats ? "-" : reputation.citations}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Flow Reuses</span>
                  <span className="font-medium">
                    {isLoadingStats ? "-" : reputation.flowReuses}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Discussions</span>
                  <span className="font-medium">
                    {isLoadingStats ? "-" : reputation.discussions}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Public Activity */}
          <Card className="border-2 border-green-200 bg-white dark:border-green-800 dark:bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  PUBLIC ACTIVITY
                </CardTitle>
                <Calendar className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {weekDays.map((day, index) => (
                  <div key={`day-${index}`} className="text-center">
                    <div className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {day}
                    </div>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        stats.weeklyActivity[index] > 0
                          ? "bg-green-500"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                {stats.weeklyActivity.filter((d) => d > 0).length} active days
                this week
              </p>
            </CardContent>
          </Card>

          {/* Contributions Summary */}
          <Card className="border-2 border-blue-200 bg-white dark:border-blue-800 dark:bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  TOTAL CONTRIBUTIONS
                </CardTitle>
                {isLoadingStats ? (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-slate-900 dark:text-white">
                {isLoadingStats
                  ? "..."
                  : stats.datasetsCreated +
                    stats.flowsCreated +
                    stats.runsCreated +
                    stats.discussionsPosted}
              </div>
              <p className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                total contributions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Impact & Contribution Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Datasets with Impact */}
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Datasets
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {isLoadingStats ? "..." : stats.datasetsCreated}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                created
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Download className="h-3 w-3" />
                  <span>
                    {isLoadingStats
                      ? "-"
                      : stats.totalDownloads.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Eye className="h-3 w-3" />
                  <span>
                    {isLoadingStats ? "-" : stats.totalViews.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flows with Reuse */}
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Flows
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {isLoadingStats ? "..." : stats.flowsCreated}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                created
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                <Users className="h-3 w-3" />
                <span>
                  {isLoadingStats ? "-" : stats.flowReuses} reuses by others
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Runs */}
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Cog className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Runs
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {isLoadingStats ? "..." : stats.runsCreated}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                experiments
              </p>
            </CardContent>
          </Card>

          {/* Citations */}
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Citations
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {isLoadingStats ? "..." : stats.totalCitations}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                in publications
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                <MessageSquare className="h-3 w-3" />
                <span>
                  {isLoadingStats ? "-" : stats.discussionsPosted} discussions
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Contributions */}
        {!isLoadingStats && (stats.topDataset || stats.topFlow) && (
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
              Your Top Contributions
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {stats.topDataset && (
                <Card className="border-2 border-green-200 bg-linear-to-br from-green-50 to-white dark:border-green-800 dark:from-green-950/20 dark:to-slate-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                          <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-slate-900 dark:text-white">
                            Most Downloaded Dataset
                          </CardTitle>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {stats.topDataset.name}
                          </p>
                        </div>
                      </div>
                      <Trophy className="h-6 w-6 text-amber-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {stats.topDataset.downloads.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        downloads
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {stats.topFlow && (
                <Card className="border-2 border-blue-200 bg-linear-to-br from-blue-50 to-white dark:border-blue-800 dark:from-blue-950/20 dark:to-slate-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <FlaskConical className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-slate-900 dark:text-white">
                            Most Reused Flow
                          </CardTitle>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {stats.topFlow.name}
                          </p>
                        </div>
                      </div>
                      <Star className="h-6 w-6 text-amber-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {stats.topFlow.reuses}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        reuses
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Focus Cards */}
        {showFocusCards && (
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  How to start: Choose a focus for today
                </h2>
                <p className="text-muted-foreground text-sm">
                  Help us make relevant suggestions for you
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFocusCards(false)}
                className="shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {focusCards.map((card) => (
                <Link key={card.id} href={card.href}>
                  <Card className="group relative overflow-hidden border-2 bg-white transition-all hover:scale-105 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800">
                    <div
                      className={`absolute inset-0 bg-linear-to-br opacity-10 transition-opacity group-hover:opacity-20 ${card.color}`}
                    />
                    <CardContent className="relative flex items-center gap-4 p-8">
                      <div className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-slate-900 bg-white dark:border-white dark:bg-slate-900">
                        {card.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {card.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {card.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Hide Stats Link */}
        <div className="text-right">
          <Button variant="ghost" size="sm" className="text-sm">
            Hide stats
          </Button>
        </div>
      </div>
    </div>
  );
}
