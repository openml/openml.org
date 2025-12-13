"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Database,
  Trophy,
  Cog,
  Calendar,
  MapPin,
  Building2,
  Heart,
  Download,
  FlaskConical,
  TrendingUp,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email?: string; // Only shown to authenticated user viewing their own profile
  bio?: string;
  image?: string;
  affiliation?: string;
  country?: string;
  date: string; // Join date
  datasets_uploaded: number;
  flows_uploaded: number;
  tasks_uploaded: number;
  runs_uploaded: number;
  downloads_received_data: number;
  downloads_received_flow: number;
  likes_received_data: number;
  likes_received_flow: number;
  external_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

interface Upload {
  id: number;
  name: string;
  description?: string;
  date: string;
  runs?: number;
  likes?: number;
  downloads?: number;
}

export function UserProfilePage({ userId }: { userId: string }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [datasets, setDatasets] = useState<Upload[]>([]);
  const [flows, setFlows] = useState<Upload[]>([]);
  const [tasks, setTasks] = useState<Upload[]>([]);
  const [runs, setRuns] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from ElasticSearch via API
        const response = await fetch(`/api/user/${userId}`);

        if (!response.ok) {
          if (response.status === 404) {
            console.log("User not found:", userId);
            setUser(null);
            setLoading(false);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Map ElasticSearch data to UserProfile
        const userProfile: UserProfile = {
          id: data.user_id || parseInt(userId),
          username: data.username || `user${userId}`,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email,
          bio: data.bio,
          image: data.image,
          affiliation: data.affiliation,
          country: data.country,
          date: data.date || new Date().toISOString(),
          datasets_uploaded: data.datasets_uploaded || 0,
          flows_uploaded: data.flows_uploaded || 0,
          tasks_uploaded: data.tasks_uploaded || 0,
          runs_uploaded: data.runs_uploaded || 0,
          downloads_received_data: data.downloads_received_data || 0,
          downloads_received_flow: data.downloads_received_flow || 0,
          likes_received_data: data.likes_received_data || 0,
          likes_received_flow: data.likes_received_flow || 0,
          external_links: data.external_links,
        };

        setUser(userProfile);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Fetch user's content when tab changes
  useEffect(() => {
    if (!user) return;

    const fetchContent = async () => {
      try {
        if (activeTab === "datasets" && datasets.length === 0) {
          const response = await fetch(
            `/api/user/${userId}/datasets?page=1&size=10`,
          );
          if (response.ok) {
            const data = await response.json();
            setDatasets(data.datasets || []);
          }
        } else if (activeTab === "flows" && flows.length === 0) {
          const response = await fetch(
            `/api/user/${userId}/flows?page=1&size=10`,
          );
          if (response.ok) {
            const data = await response.json();
            setFlows(data.flows || []);
          }
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
      }
    };

    fetchContent();
  }, [activeTab, user, userId, datasets.length, flows.length]);
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">User Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The user you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`;
  const memberSince = new Date(user.date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const totalUploads =
    user.datasets_uploaded +
    user.flows_uploaded +
    user.tasks_uploaded +
    user.runs_uploaded;
  const totalDownloads =
    user.downloads_received_data + user.downloads_received_flow;
  const totalLikes = user.likes_received_data + user.likes_received_flow;

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <div className="border-b bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Profile Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl sm:h-40 sm:w-40 dark:border-slate-700">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={fullName}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-5xl font-bold text-white">
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight">{fullName}</h1>
              <p className="text-muted-foreground mt-1 text-lg">
                @{user.username}
              </p>

              {user.bio && (
                <p className="mt-4 max-w-3xl text-base leading-relaxed">
                  {user.bio}
                </p>
              )}

              {/* Meta Info */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm lg:justify-start">
                {user.affiliation && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>{user.affiliation}</span>
                  </div>
                )}
                {user.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>{user.country}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Joined {memberSince}</span>
                </div>
              </div>

              {/* Social Links */}
              {user.external_links && (
                <div className="mt-4 flex justify-center gap-3 lg:justify-start">
                  {user.external_links.github && (
                    <a
                      href={user.external_links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FontAwesomeIcon icon={faGithub} className="h-5 w-5" />
                    </a>
                  )}
                  {user.external_links.linkedin && (
                    <a
                      href={user.external_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5" />
                    </a>
                  )}
                  {user.external_links.twitter && (
                    <a
                      href={user.external_links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Stats Cards - Desktop */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-3 gap-3">
                <Card className="border-2 border-blue-200 dark:border-blue-900">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {totalUploads}
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      Uploads
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-green-200 dark:border-green-900">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {totalDownloads.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      Downloads
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-purple-200 dark:border-purple-900">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {totalLikes}
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      Likes
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Stats Cards - Mobile */}
          <div className="mt-8 grid grid-cols-3 gap-3 lg:hidden">
            <Card className="border-2 border-blue-200 dark:border-blue-900">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalUploads}
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  Uploads
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-200 dark:border-green-900">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalDownloads.toLocaleString()}
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  Downloads
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-200 dark:border-purple-900">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {totalLikes}
                </div>
                <div className="text-muted-foreground mt-1 text-xs">Likes</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sidebar - Contribution Stats */}
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Contributions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Datasets */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                      <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Datasets</div>
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Download className="h-3 w-3" />
                        {user.downloads_received_data.toLocaleString()}
                        <Heart className="ml-2 h-3 w-3" />
                        {user.likes_received_data}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    {user.datasets_uploaded}
                  </div>
                </div>

                {/* Flows */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
                      <Cog className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Flows</div>
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Download className="h-3 w-3" />
                        {user.downloads_received_flow.toLocaleString()}
                        <Heart className="ml-2 h-3 w-3" />
                        {user.likes_received_flow}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    {user.flows_uploaded}
                  </div>
                </div>

                {/* Tasks */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/30">
                      <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Tasks</div>
                      <div className="text-muted-foreground text-sm">
                        ML challenges
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    {user.tasks_uploaded}
                  </div>
                </div>

                {/* Runs */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                      <FlaskConical className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Runs</div>
                      <div className="text-muted-foreground text-sm">
                        Experiments
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{user.runs_uploaded}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Tabs */}
          <div className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="datasets">
                  Datasets ({user.datasets_uploaded})
                </TabsTrigger>
                <TabsTrigger value="flows">
                  Flows ({user.flows_uploaded})
                </TabsTrigger>
                <TabsTrigger value="tasks">
                  Tasks ({user.tasks_uploaded})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground py-12 text-center">
                      <p>Activity timeline coming soon...</p>
                      <p className="mt-2 text-sm">
                        This will show recent uploads, likes, and interactions
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="datasets" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Datasets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {datasets.length > 0 ? (
                      <div className="space-y-4">
                        {datasets.map((dataset) => (
                          <Link
                            key={dataset.id}
                            href={`/datasets/${dataset.id}`}
                            className="hover:bg-muted/50 block rounded-lg border p-4 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="hover:text-primary font-semibold">
                                  {dataset.name}
                                </h3>
                                {dataset.description && (
                                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                                    {dataset.description}
                                  </p>
                                )}
                                <div className="text-muted-foreground mt-2 flex flex-wrap gap-3 text-xs">
                                  {dataset.runs && (
                                    <span className="flex items-center gap-1">
                                      <FlaskConical className="h-3 w-3" />
                                      {dataset.runs} runs
                                    </span>
                                  )}
                                  {dataset.likes && (
                                    <span className="flex items-center gap-1">
                                      <Heart className="h-3 w-3" />
                                      {dataset.likes}
                                    </span>
                                  )}
                                  {dataset.downloads && (
                                    <span className="flex items-center gap-1">
                                      <Download className="h-3 w-3" />
                                      {dataset.downloads.toLocaleString()}
                                    </span>
                                  )}
                                  {dataset.date && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(
                                        dataset.date,
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground py-12 text-center">
                        <Database className="mx-auto mb-4 h-12 w-12" />
                        <p>No datasets found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="flows" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Flows</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {flows.length > 0 ? (
                      <div className="space-y-4">
                        {flows.map((flow) => (
                          <Link
                            key={flow.id}
                            href={`/flows/${flow.id}`}
                            className="hover:bg-muted/50 block rounded-lg border p-4 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="hover:text-primary font-semibold">
                                  {flow.name}
                                </h3>
                                {flow.description && (
                                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                                    {flow.description}
                                  </p>
                                )}
                                <div className="text-muted-foreground mt-2 flex flex-wrap gap-3 text-xs">
                                  {flow.runs && (
                                    <span className="flex items-center gap-1">
                                      <FlaskConical className="h-3 w-3" />
                                      {flow.runs} runs
                                    </span>
                                  )}
                                  {flow.likes && (
                                    <span className="flex items-center gap-1">
                                      <Heart className="h-3 w-3" />
                                      {flow.likes}
                                    </span>
                                  )}
                                  {flow.downloads && (
                                    <span className="flex items-center gap-1">
                                      <Download className="h-3 w-3" />
                                      {flow.downloads.toLocaleString()}
                                    </span>
                                  )}
                                  {flow.date && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(flow.date).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground py-12 text-center">
                        <Cog className="mx-auto mb-4 h-12 w-12" />
                        <p>No flows found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground py-12 text-center">
                      <Trophy className="mx-auto mb-4 h-12 w-12" />
                      <p>User's tasks will be listed here</p>
                      <p className="mt-2 text-sm">
                        Fetched from ElasticSearch with uploader_id filter
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
