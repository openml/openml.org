"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Database,
  Trophy,
  Cog,
  FlaskConical,
  Calendar,
  X,
  GraduationCap,
  MessageSquare,
  Flame,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface UserStats {
  datasetsCreated: number;
  notebooksCreated: number;
  competitionsJoined: number;
  discussionsPosted: number;
  coursesCompleted: number;
  loginStreak: number;
  tierProgress: number;
  weeklyActivity: number[];
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
  const [user, setUser] = useState<{
    name: string;
    username: string;
  } | null>(null);
  const [showFocusCards, setShowFocusCards] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    datasetsCreated: 0,
    notebooksCreated: 0,
    competitionsJoined: 0,
    discussionsPosted: 0,
    coursesCompleted: 0,
    loginStreak: 1,
    tierProgress: 0,
    weeklyActivity: [0, 0, 0, 0, 0, 0, 1], // M T W T F S S
  });

  useEffect(() => {
    // Load user from localStorage
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
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // TODO: Fetch real stats from API
    // For now using mock data
  }, []);

  const focusCards: FocusCard[] = [
    {
      id: "competitions",
      title: "Competitions",
      description: "Test your skills against others",
      icon: <Trophy className="h-8 w-8" />,
      color: "from-yellow-400 via-yellow-500 to-green-500",
      href: "/competitions",
    },
    {
      id: "learn",
      title: "Courses",
      description: "Level up your data science skills",
      icon: <GraduationCap className="h-8 w-8" />,
      color: "from-yellow-400 via-green-500 to-blue-500",
      href: "/learn",
    },
    {
      id: "datasets",
      title: "Datasets",
      description: "Explore and share datasets",
      icon: <Database className="h-8 w-8" />,
      color: "from-blue-400 via-blue-500 to-green-500",
      href: "/datasets",
    },
  ];

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8 sm:px-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome, {user.name}!
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            OpenML is the place to learn data science and build a portfolio.
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {/* Login Streak */}
          <Card className="border-2 border-orange-200 bg-white dark:border-orange-800 dark:bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  LOGIN STREAK
                </CardTitle>
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-slate-900 dark:text-white">
                {stats.loginStreak}
              </div>
              <p className="mt-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                day
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                a new record!
              </p>
            </CardContent>
          </Card>

          {/* Tier Progress */}
          <Card className="border-2 border-blue-200 bg-white dark:border-blue-800 dark:bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  TIER PROGRESS
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-slate-900 dark:text-white">
                {stats.tierProgress}%
              </div>
              <p className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                to Expert
              </p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${stats.tierProgress}%` }}
                />
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
                  <div key={day} className="text-center">
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
            </CardContent>
          </Card>
        </div>

        {/* Activity Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {/* Datasets */}
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
                {stats.datasetsCreated}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                total created
              </p>
            </CardContent>
          </Card>

          {/* Notebooks */}
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Cog className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Notebooks
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.notebooksCreated}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                total created
              </p>
            </CardContent>
          </Card>

          {/* Competitions */}
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Competitions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.competitionsJoined}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                total joined
              </p>
            </CardContent>
          </Card>

          {/* Discussions */}
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Discussions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.discussionsPosted}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                total posted
              </p>
            </CardContent>
          </Card>

          {/* Courses */}
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Courses
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.coursesCompleted}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                total completed
              </p>
            </CardContent>
          </Card>
        </div>

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
                      className={`absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity group-hover:opacity-20 ${card.color}`}
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
