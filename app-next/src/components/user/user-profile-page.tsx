"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useFormatter } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Building2,
  Heart,
  Download,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { ENTITY_ICONS, entityColors } from "@/constants";
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

interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  loading: boolean;
}

const PAGE_SIZE = 10;

const DATASET_SORT_OPTIONS = [
  { label: "Most Recent", value: "date_desc" },
  { label: "Most Runs", value: "runs_desc" },
  { label: "Most Likes", value: "likes_desc" },
  { label: "Most Downloads", value: "downloads_desc" },
  { label: "Name (A–Z)", value: "name_asc" },
];

const FLOW_SORT_OPTIONS = [
  { label: "Most Recent", value: "date_desc" },
  { label: "Most Runs", value: "runs_desc" },
  { label: "Most Likes", value: "likes_desc" },
  { label: "Most Downloads", value: "downloads_desc" },
  { label: "Name (A–Z)", value: "name_asc" },
];

const TASK_SORT_OPTIONS = [
  { label: "Most Recent", value: "date_desc" },
  { label: "Most Runs", value: "runs_desc" },
  { label: "Name (A–Z)", value: "name_asc" },
];

interface PaginationControlsProps {
  page: number;
  total: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const PaginationControls = ({
  page,
  total,
  pageSize,
  loading,
  onPageChange,
}: PaginationControlsProps) => {
  const t = useTranslations("userProfile");

  if (total <= pageSize) return null;

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex items-center justify-between border-t pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || loading}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        {t("pagination.previous")}
      </Button>
      <span className="text-muted-foreground text-sm">
        {t("pagination.pageOf", { page, totalPages })}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages || loading}
      >
        {t("pagination.next")}
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export function UserProfilePage({ userId }: { userId: string }) {
  const t = useTranslations("userProfile");
  const format = useFormatter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [datasets, setDatasets] = useState<PaginatedData<Upload>>({
    items: [],
    total: 0,
    page: 1,
    loading: false,
  });
  const [flows, setFlows] = useState<PaginatedData<Upload>>({
    items: [],
    total: 0,
    page: 1,
    loading: false,
  });
  const [tasks, setTasks] = useState<PaginatedData<Upload>>({
    items: [],
    total: 0,
    page: 1,
    loading: false,
  });
  const [recentUploads, setRecentUploads] = useState<
    (Upload & { type: "dataset" | "flow" | "task" })[]
  >([]);
  const [recentLikes, setRecentLikes] = useState<
    (Upload & { type: "dataset" | "flow" | "task" })[]
  >([]);
  const [recentDownloads, setRecentDownloads] = useState<
    (Upload & { type: "dataset" | "flow" | "task" })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [datasetsSort, setDatasetsSort] = useState("date_desc");
  const [flowsSort, setFlowsSort] = useState("date_desc");
  const [tasksSort, setTasksSort] = useState("date_desc");

  const getSortLabel = (value: string) => {
    switch (value) {
      case "date_desc":
        return t("listing.sortOptions.recent");
      case "runs_desc":
        return t("listing.sortOptions.runs");
      case "likes_desc":
        return t("listing.sortOptions.likes");
      case "downloads_desc":
        return t("listing.sortOptions.downloads");
      case "name_asc":
        return t("listing.sortOptions.name");
      default:
        return value;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from ElasticSearch via API
        const response = await fetch(`/api/user/${userId}`);

        if (!response.ok) {
          if (response.status === 404) {
            // console.log("User not found:", userId);
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

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        // Fetch recent uploads (datasets, flows, tasks)
        const [datasetsRes, flowsRes, tasksRes] = await Promise.all([
          fetch(
            `/api/user/${userId}/datasets?page=1&size=6&sort=date_desc`,
          ).then((r) => r.json()),
          fetch(`/api/user/${userId}/flows?page=1&size=6&sort=date_desc`).then(
            (r) => r.json(),
          ),
          fetch(`/api/user/${userId}/tasks?page=1&size=6&sort=date_desc`).then(
            (r) => r.json(),
          ),
        ]);

        type DatasetItem = {
          data_id: number;
          date?: string;
          nr_of_likes?: number;
          nr_of_downloads?: number;
          [key: string]: unknown;
        };
        type FlowItem = {
          flow_id: number;
          upload_date?: string;
          nr_of_likes?: number;
          nr_of_downloads?: number;
          [key: string]: unknown;
        };
        type TaskItem = {
          task_id: number;
          date?: string;
          [key: string]: unknown;
        };
        const recentUploadsList = [
          ...(datasetsRes.datasets || []).map((d: DatasetItem) => ({
            ...d,
            type: "dataset" as const,
            id: d.data_id,
            likes: d.nr_of_likes,
            downloads: d.nr_of_downloads,
          })),
          ...(flowsRes.flows || []).map((f: FlowItem) => ({
            ...f,
            type: "flow" as const,
            id: f.flow_id,
            date: f.upload_date,
            likes: f.nr_of_likes,
            downloads: f.nr_of_downloads,
          })),
          ...(tasksRes.tasks || []).map((t: TaskItem) => ({
            ...t,
            type: "task" as const,
            id: t.task_id,
          })),
        ]
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .slice(0, 6);

        setRecentUploads(recentUploadsList);

        // Fetch most liked uploads (datasets, flows)
        const [likedDatasetsRes, likedFlowsRes] = await Promise.all([
          fetch(
            `/api/user/${userId}/datasets?page=1&size=6&sort=likes_desc`,
          ).then((r) => r.json()),
          fetch(`/api/user/${userId}/flows?page=1&size=6&sort=likes_desc`).then(
            (r) => r.json(),
          ),
        ]);

        const topLikedList = [
          ...(likedDatasetsRes.datasets || []).map((d: DatasetItem) => ({
            ...d,
            type: "dataset" as const,
            id: d.data_id,
            likes: d.nr_of_likes,
            downloads: d.nr_of_downloads,
          })),
          ...(likedFlowsRes.flows || []).map((f: FlowItem) => ({
            ...f,
            type: "flow" as const,
            id: f.flow_id,
            date: f.upload_date,
            likes: f.nr_of_likes,
            downloads: f.nr_of_downloads,
          })),
        ]
          .sort((a, b) => (b.likes || 0) - (a.likes || 0))
          .slice(0, 6);

        setRecentLikes(topLikedList);

        // Fetch most downloaded uploads (datasets, flows)
        const [downloadedDatasetsRes, downloadedFlowsRes] = await Promise.all([
          fetch(
            `/api/user/${userId}/datasets?page=1&size=6&sort=downloads_desc`,
          ).then((r) => r.json()),
          fetch(
            `/api/user/${userId}/flows?page=1&size=6&sort=downloads_desc`,
          ).then((r) => r.json()),
        ]);

        const topDownloadedList = [
          ...(downloadedDatasetsRes.datasets || []).map((d: DatasetItem) => ({
            ...d,
            type: "dataset" as const,
            id: d.data_id,
            likes: d.nr_of_likes,
            downloads: d.nr_of_downloads,
          })),
          ...(downloadedFlowsRes.flows || []).map((f: FlowItem) => ({
            ...f,
            type: "flow" as const,
            id: f.flow_id,
            date: f.upload_date,
            likes: f.nr_of_likes,
            downloads: f.nr_of_downloads,
          })),
        ]
          .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
          .slice(0, 6);

        setRecentDownloads(topDownloadedList);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    };

    if (activeTab === "overview") {
      fetchOverviewData();
    }
  }, [userId, activeTab]);

  // Fetch datasets with pagination + sort
  const fetchDatasets = async (page: number, sort = datasetsSort) => {
    setDatasets((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch(
        `/api/user/${userId}/datasets?page=${page}&size=${PAGE_SIZE}&sort=${sort}`,
      );
      if (response.ok) {
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedDatasets = (data.datasets || []).map((d: any) => ({
          id: d.data_id,
          name: d.name,
          description: d.description,
          date: d.date,
          runs: d.runs || 0,
          likes: d.nr_of_likes || 0,
          downloads: d.nr_of_downloads || 0,
        }));
        setDatasets({
          items: mappedDatasets,
          total: data.total || mappedDatasets.length,
          page,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching datasets:", error);
      setDatasets((prev) => ({ ...prev, loading: false }));
    }
  };

  // Fetch flows with pagination + sort
  const fetchFlows = async (page: number, sort = flowsSort) => {
    setFlows((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch(
        `/api/user/${userId}/flows?page=${page}&size=${PAGE_SIZE}&sort=${sort}`,
      );
      if (response.ok) {
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedFlows = (data.flows || []).map((f: any) => ({
          id: f.flow_id,
          name: f.name,
          description: f.description,
          date: f.date || f.upload_date,
          runs: f.runs || 0,
          likes: f.nr_of_likes || 0,
          downloads: f.nr_of_downloads || 0,
        }));
        setFlows({
          items: mappedFlows,
          total: data.total || mappedFlows.length,
          page,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching flows:", error);
      setFlows((prev) => ({ ...prev, loading: false }));
    }
  };

  // Fetch tasks with pagination + sort
  const fetchTasks = async (page: number, sort = tasksSort) => {
    setTasks((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch(
        `/api/user/${userId}/tasks?page=${page}&size=${PAGE_SIZE}&sort=${sort}`,
      );
      if (response.ok) {
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedTasks = (data.tasks || []).map((taskItem: any) => ({
          id: taskItem.task_id,
          name: t("listing.taskName", {
            taskType:
              taskItem.tasktype?.name ||
              taskItem.task_type ||
              t("listing.unknownTask"),
            dataset: taskItem.source_data?.name || t("listing.unknownDataset"),
          }),
          description: `Task ID: ${taskItem.task_id} • ${
            taskItem.target_feature
              ? t("listing.target", { target: taskItem.target_feature })
              : ""
          }`,
          date:
            taskItem.date || taskItem.upload_date || new Date().toISOString(),
          runs: taskItem.runs || 0,
          likes: taskItem.nr_of_likes || 0,
          downloads: taskItem.nr_of_downloads || 0,
        }));
        setTasks({
          items: mappedTasks,
          total: data.total || mappedTasks.length,
          page,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks((prev) => ({ ...prev, loading: false }));
    }
  };

  // Fetch user's content when tab changes
  useEffect(() => {
    if (!user) return;

    if (activeTab === "datasets" && datasets.items.length === 0) {
      fetchDatasets(1);
    } else if (activeTab === "flows" && flows.items.length === 0) {
      fetchFlows(1);
    } else if (activeTab === "tasks" && tasks.items.length === 0) {
      fetchTasks(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user, userId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground mt-4">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">{t("notFound.title")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("notFound.description")}
          </p>
        </div>
      </div>
    );
  }

  // Construct proper avatar URL
  const avatarUrl = user.image
    ? user.image.startsWith("http")
      ? user.image
      : `https://www.openml.org/img/${user.image}`
    : null;

  const fullName = `${user.first_name} ${user.last_name}`;

  // Calculate initials safely
  let initials = "OP";
  if (user.first_name && user.last_name) {
    initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  } else if (fullName && fullName.trim().length > 0) {
    const nameParts = fullName.split(" ").filter((n: string) => n.length > 0);
    if (nameParts.length >= 2) {
      initials = `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
      initials = nameParts[0].substring(0, 2).toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length === 1) {
      initials = nameParts[0][0].toUpperCase();
    }
  }

  const memberSince = format.dateTime(new Date(user.date), {
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
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Profile Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl sm:h-40 sm:w-40 dark:border-slate-700">
                  <AvatarImage
                    src={avatarUrl || undefined}
                    alt={fullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="gradient-bg text-4xl font-bold text-white sm:text-5xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
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
                  <span>{t("joined", { date: memberSince })}</span>
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
                      {t("stats.uploads")}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-green-200 dark:border-green-900">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {totalDownloads.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {t("stats.downloads")}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-purple-200 dark:border-purple-900">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {totalLikes}
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {t("stats.likes")}
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
                  {t("stats.uploads")}
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-200 dark:border-green-900">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalDownloads.toLocaleString()}
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  {t("stats.downloads")}
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-200 dark:border-purple-900">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {totalLikes}
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  {t("stats.likes")}
                </div>
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
                  {t("contributions.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Datasets */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-full bg-green-100 p-2 dark:bg-green-900/30"
                      style={{
                        backgroundColor: `${entityColors.data}20`, // 20 simulates tailwind bg-opacity-10/20
                      }}
                    >
                      <FontAwesomeIcon
                        icon={ENTITY_ICONS.dataset}
                        className="h-5 w-5"
                        style={{ color: entityColors.data }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {t("contributions.datasets")}
                      </div>
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
                    <div
                      className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30"
                      style={{
                        backgroundColor: `${entityColors.flow}20`,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={ENTITY_ICONS.flow}
                        className="h-5 w-5"
                        style={{ color: entityColors.flow }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {t("contributions.flows")}
                      </div>
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
                    <div
                      className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30"
                      style={{
                        backgroundColor: `${entityColors.task}20`,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={ENTITY_ICONS.task}
                        className="h-5 w-5"
                        style={{ color: entityColors.task }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {t("contributions.tasks")}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {t("contributions.mlChallenges")}
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
                    <div
                      className="rounded-full bg-red-100 p-2 dark:bg-red-900/30"
                      style={{
                        backgroundColor: `${entityColors.run}20`,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={ENTITY_ICONS.run}
                        className="h-5 w-5"
                        style={{ color: entityColors.run }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {t("contributions.runs")}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {t("contributions.experiments")}
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
                <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
                <TabsTrigger value="datasets" className="gap-1.5">
                  <FontAwesomeIcon
                    icon={ENTITY_ICONS.dataset}
                    className="h-3.5 w-3.5"
                    style={{ color: entityColors.data }}
                  />
                  {t("tabs.datasets")}
                  <span className="rounded-full bg-black/10 px-1.5 text-[10px] font-bold">
                    {user.datasets_uploaded}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="flows" className="gap-1.5">
                  <FontAwesomeIcon
                    icon={ENTITY_ICONS.flow}
                    className="h-3.5 w-3.5"
                    style={{ color: entityColors.flow }}
                  />
                  {t("tabs.flows")}
                  <span className="rounded-full bg-black/10 px-1.5 text-[10px] font-bold">
                    {user.flows_uploaded}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="tasks" className="gap-1.5">
                  <FontAwesomeIcon
                    icon={ENTITY_ICONS.task}
                    className="h-3.5 w-3.5"
                    style={{ color: entityColors.task }}
                  />
                  {t("tabs.tasks")}
                  <span className="rounded-full bg-black/10 px-1.5 text-[10px] font-bold">
                    {user.tasks_uploaded}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <TrendingUp className="h-5 w-5" />
                      {t("overview.recentActivity")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Recent Uploads Section */}
                    <div className="space-y-4">
                      <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                        {t("overview.recentUploads")}
                      </h3>
                      <div className="grid gap-3">
                        {recentUploads.length > 0 ? (
                          recentUploads.map((item) => (
                            <Link
                              key={`${item.type}-${item.id}`}
                              href={`/${item.type}s/${item.id}`}
                              className="group hover:bg-muted/50 flex items-center justify-between rounded-md border p-3 transition-colors"
                            >
                              <div className="flex min-w-0 flex-1 items-center gap-3 pr-4">
                                <FontAwesomeIcon
                                  icon={ENTITY_ICONS[item.type]}
                                  className="h-4 w-4 shrink-0"
                                  style={{ color: entityColors[item.type] }}
                                />
                                <div className="min-w-0 flex-1">
                                  <div
                                    className="max-w-[200px] truncate font-medium transition-colors group-hover:text-[(--hover-color)] sm:max-w-[300px] md:max-w-[400px]"
                                    style={
                                      {
                                        "--hover-color":
                                          entityColors[item.type],
                                      } as React.CSSProperties
                                    }
                                  >
                                    {item.name}
                                  </div>
                                  <div className="text-muted-foreground mt-1 flex truncate text-xs">
                                    <span className="capitalize">
                                      {item.type}
                                    </span>
                                    <span className="mx-1">•</span>
                                    <span>ID: {item.id}</span>
                                    <span className="mx-1">•</span>
                                    <span className="truncate">
                                      {new Date(item.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-muted-foreground flex shrink-0 items-center gap-3 text-xs">
                                {item.likes !== undefined && item.likes > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    {item.likes}
                                  </span>
                                )}
                                {item.downloads !== undefined &&
                                  item.downloads > 0 && (
                                    <span className="flex items-center gap-1">
                                      <Download className="h-3 w-3" />
                                      {item.downloads.toLocaleString()}
                                    </span>
                                  )}
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="text-muted-foreground py-4 text-center text-sm">
                            {t("overview.noUploads")}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Most Downloaded Section (Only show if there are items with downloads) */}
                    {recentDownloads.some(
                      (item) => (item.downloads || 0) > 0,
                    ) && (
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                          {t("overview.mostDownloaded")}
                        </h3>
                        <div className="grid gap-3">
                          {recentDownloads
                            .filter((item) => (item.downloads || 0) > 0)
                            .map((item) => (
                              <Link
                                key={`${item.type}-${item.id}`}
                                href={`/${item.type}s/${item.id}`}
                                className="group hover:bg-muted/50 flex items-center justify-between rounded-md border p-3 transition-colors"
                              >
                                <div className="flex min-w-0 flex-1 items-center gap-3 pr-4">
                                  <FontAwesomeIcon
                                    icon={ENTITY_ICONS[item.type]}
                                    className="h-4 w-4 shrink-0"
                                    style={{ color: entityColors[item.type] }}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div
                                      className="truncate font-medium transition-colors group-hover:text-[(--hover-color)]"
                                      style={
                                        {
                                          "--hover-color":
                                            entityColors[item.type],
                                        } as React.CSSProperties
                                      }
                                    >
                                      {item.name}
                                    </div>
                                    <div className="text-muted-foreground mt-1 flex truncate text-xs">
                                      <span className="capitalize">
                                        {item.type}
                                      </span>
                                      <span className="mx-1">•</span>
                                      <span>ID: {item.id}</span>
                                      {item.date && (
                                        <>
                                          <span className="mx-1">•</span>
                                          <span className="truncate">
                                            {new Date(
                                              item.date,
                                            ).toLocaleDateString()}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-muted-foreground flex shrink-0 items-center gap-3 text-xs">
                                  {item.likes !== undefined &&
                                    item.likes > 0 && (
                                      <span className="flex items-center gap-1">
                                        <Heart className="h-3 w-3" />
                                        {item.likes}
                                      </span>
                                    )}
                                  <span className="flex items-center gap-1 font-medium text-blue-500">
                                    <Download className="h-3 w-3" />
                                    {(item.downloads || 0).toLocaleString()}
                                  </span>
                                </div>
                              </Link>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Most Liked Section (Only show if there are items with likes) */}
                    {recentLikes.some((item) => (item.likes || 0) > 0) && (
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                          {t("overview.mostLiked")}
                        </h3>
                        <div className="grid gap-3">
                          {recentLikes
                            .filter((item) => (item.likes || 0) > 0)
                            .map((item) => (
                              <Link
                                key={`${item.type}-${item.id}`}
                                href={`/${item.type}s/${item.id}`}
                                className="group hover:bg-muted/50 flex items-center justify-between rounded-md border p-3 transition-colors"
                              >
                                <div className="flex min-w-0 flex-1 items-center gap-3 pr-4">
                                  <FontAwesomeIcon
                                    icon={ENTITY_ICONS[item.type]}
                                    className="h-4 w-4 shrink-0"
                                    style={{ color: entityColors[item.type] }}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div
                                      className="truncate font-medium transition-colors group-hover:text-[(--hover-color)]"
                                      style={
                                        {
                                          "--hover-color":
                                            entityColors[item.type],
                                        } as React.CSSProperties
                                      }
                                    >
                                      {item.name}
                                    </div>
                                    <div className="text-muted-foreground mt-1 flex truncate text-xs">
                                      <span className="capitalize">
                                        {item.type}
                                      </span>
                                      <span className="mx-1">•</span>
                                      <span>ID: {item.id}</span>
                                      {item.date && (
                                        <>
                                          <span className="mx-1">•</span>
                                          <span className="truncate">
                                            {new Date(
                                              item.date,
                                            ).toLocaleDateString()}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-muted-foreground flex shrink-0 items-center gap-3 text-xs">
                                  <span className="flex items-center gap-1 font-medium text-red-500">
                                    <Heart className="h-3 w-3 fill-current" />
                                    {item.likes}
                                  </span>
                                  {item.downloads !== undefined &&
                                    item.downloads > 0 && (
                                      <span className="flex items-center gap-1">
                                        <Download className="h-3 w-3" />
                                        {item.downloads.toLocaleString()}
                                      </span>
                                    )}
                                </div>
                              </Link>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="datasets" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{t("contributions.datasets")}</span>
                      {datasets.total > 0 && (
                        <span className="text-muted-foreground text-sm font-normal">
                          {t("listing.showing", {
                            start: (datasets.page - 1) * PAGE_SIZE + 1,
                            end: Math.min(
                              datasets.page * PAGE_SIZE,
                              datasets.total,
                            ),
                            total: datasets.total,
                          })}
                        </span>
                      )}
                    </CardTitle>
                    {datasets.total > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                          {t("listing.sortBy")}
                        </span>
                        <Select
                          value={datasetsSort}
                          onValueChange={(v) => {
                            setDatasetsSort(v);
                            fetchDatasets(1, v);
                          }}
                        >
                          <SelectTrigger className="h-8 w-[160px] text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DATASET_SORT_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {getSortLabel(opt.value)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {datasets.loading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                      </div>
                    ) : datasets.items.length > 0 ? (
                      <div className="space-y-4">
                        {datasets.items.map((dataset) => (
                          <Link
                            key={dataset.id}
                            href={`/datasets/${dataset.id}`}
                            className="hover:bg-muted/50 group block rounded-lg border p-4 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 items-center gap-2">
                                  <FontAwesomeIcon
                                    icon={ENTITY_ICONS.dataset}
                                    className="h-4 w-4 shrink-0"
                                    style={{ color: entityColors.data }}
                                  />
                                  <h3
                                    className="truncate font-semibold transition-colors"
                                    style={{ color: "inherit" }}
                                    title={dataset.name}
                                  >
                                    <span
                                      className="group-hover:text-[(--hover-color)]"
                                      style={
                                        {
                                          "--hover-color": entityColors.data,
                                        } as React.CSSProperties
                                      }
                                    >
                                      {dataset.name}
                                    </span>
                                  </h3>
                                </div>
                                {dataset.description && (
                                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                                    {dataset.description}
                                  </p>
                                )}
                                <div className="text-muted-foreground mt-2 flex flex-wrap gap-3 text-xs">
                                  {dataset.runs !== undefined &&
                                    dataset.runs > 0 && (
                                      <span className="flex items-center gap-1">
                                        <FontAwesomeIcon
                                          icon={ENTITY_ICONS.run}
                                          className="h-3 w-3"
                                          style={{ color: entityColors.run }}
                                        />
                                        {t("listing.runs", {
                                          count: dataset.runs,
                                        })}
                                      </span>
                                    )}
                                  {dataset.likes !== undefined &&
                                    dataset.likes > 0 && (
                                      <span className="flex items-center gap-1">
                                        <Heart className="h-3 w-3" />
                                        {dataset.likes}
                                      </span>
                                    )}
                                  {dataset.downloads !== undefined &&
                                    dataset.downloads > 0 && (
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
                        {/* Pagination */}
                        <PaginationControls
                          page={datasets.page}
                          total={datasets.total}
                          pageSize={PAGE_SIZE}
                          loading={datasets.loading}
                          onPageChange={(p) => fetchDatasets(p)}
                        />
                      </div>
                    ) : (
                      <div className="text-muted-foreground py-12 text-center">
                        <FontAwesomeIcon
                          icon={ENTITY_ICONS.dataset}
                          className="mx-auto mb-4 h-12 w-12"
                          style={{ color: entityColors.data }}
                        />
                        <p>{t("listing.noDatasets")}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="flows" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{t("contributions.flows")}</span>
                      {flows.total > 0 && (
                        <span className="text-muted-foreground text-sm font-normal">
                          {t("listing.showing", {
                            start: (flows.page - 1) * PAGE_SIZE + 1,
                            end: Math.min(flows.page * PAGE_SIZE, flows.total),
                            total: flows.total,
                          })}
                        </span>
                      )}
                    </CardTitle>
                    {flows.total > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                          {t("listing.sortBy")}
                        </span>
                        <Select
                          value={flowsSort}
                          onValueChange={(v) => {
                            setFlowsSort(v);
                            fetchFlows(1, v);
                          }}
                        >
                          <SelectTrigger className="h-8 w-[160px] text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FLOW_SORT_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {getSortLabel(opt.value)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {flows.loading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                      </div>
                    ) : flows.items.length > 0 ? (
                      <div className="space-y-4">
                        {flows.items.map((flow) => (
                          <Link
                            key={flow.id}
                            href={`/flows/${flow.id}`}
                            className="hover:bg-muted/50 group block rounded-lg border p-4 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 items-center gap-2">
                                  <FontAwesomeIcon
                                    icon={ENTITY_ICONS.flow}
                                    className="h-4 w-4 shrink-0"
                                    style={{ color: entityColors.flow }}
                                  />
                                  <h3
                                    className="truncate font-semibold transition-colors"
                                    style={{ color: "inherit" }}
                                    title={flow.name}
                                  >
                                    <span
                                      className="group-hover:text-[(--hover-color)]"
                                      style={
                                        {
                                          "--hover-color": entityColors.flow,
                                        } as React.CSSProperties
                                      }
                                    >
                                      {flow.name}
                                    </span>
                                  </h3>
                                </div>
                                {flow.description && (
                                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                                    {flow.description}
                                  </p>
                                )}
                                <div className="text-muted-foreground mt-2 flex flex-wrap gap-3 text-xs">
                                  {flow.runs !== undefined && flow.runs > 0 && (
                                    <span className="flex items-center gap-1">
                                      <FontAwesomeIcon
                                        icon={ENTITY_ICONS.run}
                                        className="h-3 w-3"
                                        style={{ color: entityColors.run }}
                                      />
                                      {t("listing.runs", {
                                        count: flow.runs,
                                      })}
                                    </span>
                                  )}
                                  {flow.likes !== undefined &&
                                    flow.likes > 0 && (
                                      <span className="flex items-center gap-1">
                                        <Heart className="h-3 w-3" />
                                        {flow.likes}
                                      </span>
                                    )}
                                  {flow.downloads !== undefined &&
                                    flow.downloads > 0 && (
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
                        {/* Pagination */}
                        <PaginationControls
                          page={flows.page}
                          total={flows.total}
                          pageSize={PAGE_SIZE}
                          loading={flows.loading}
                          onPageChange={(p) => fetchFlows(p)}
                        />
                      </div>
                    ) : (
                      <div className="text-muted-foreground py-12 text-center">
                        <FontAwesomeIcon
                          icon={ENTITY_ICONS.flow}
                          className="mx-auto mb-4 h-12 w-12"
                          style={{ color: entityColors.flow }}
                        />
                        <p>{t("listing.noFlows")}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{t("contributions.tasks")}</span>
                      {tasks.total > 0 && (
                        <span className="text-muted-foreground text-sm font-normal">
                          {t("listing.showing", {
                            start: (tasks.page - 1) * PAGE_SIZE + 1,
                            end: Math.min(tasks.page * PAGE_SIZE, tasks.total),
                            total: tasks.total,
                          })}
                        </span>
                      )}
                    </CardTitle>
                    {tasks.total > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                          {t("listing.sortBy")}
                        </span>
                        <Select
                          value={tasksSort}
                          onValueChange={(v) => {
                            setTasksSort(v);
                            fetchTasks(1, v);
                          }}
                        >
                          <SelectTrigger className="h-8 w-[160px] text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TASK_SORT_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {getSortLabel(opt.value)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {tasks.loading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                      </div>
                    ) : tasks.items.length > 0 ? (
                      <div className="space-y-4">
                        {tasks.items.map((task) => (
                          <Link
                            key={task.id}
                            href={`/tasks/${task.id}`}
                            className="hover:bg-muted/50 group block rounded-lg border p-4 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 items-center gap-2">
                                  <FontAwesomeIcon
                                    icon={ENTITY_ICONS.task}
                                    className="h-4 w-4 shrink-0"
                                    style={{ color: entityColors.task }}
                                  />
                                  <h3
                                    className="truncate font-semibold transition-colors"
                                    style={{ color: "inherit" }}
                                    title={task.name}
                                  >
                                    <span
                                      className="group-hover:text-[(--hover-color)]"
                                      style={
                                        {
                                          "--hover-color": entityColors.task,
                                        } as React.CSSProperties
                                      }
                                    >
                                      {task.name}
                                    </span>
                                  </h3>
                                </div>
                                {task.description && (
                                  <p className="text-muted-foreground mt-1 ml-6 line-clamp-2 text-sm">
                                    {task.description}
                                  </p>
                                )}
                                <div className="text-muted-foreground mt-2 ml-6 flex flex-wrap gap-3 text-xs">
                                  {task.runs !== undefined && task.runs > 0 && (
                                    <span className="flex items-center gap-1">
                                      <FontAwesomeIcon
                                        icon={ENTITY_ICONS.run}
                                        className="h-3 w-3"
                                        style={{ color: entityColors.run }}
                                      />
                                      {t("listing.runs", {
                                        count: task.runs,
                                      })}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(task.date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                        {/* Pagination */}
                        <PaginationControls
                          page={tasks.page}
                          total={tasks.total}
                          pageSize={PAGE_SIZE}
                          loading={tasks.loading}
                          onPageChange={(p) => fetchTasks(p)}
                        />
                      </div>
                    ) : (
                      <div className="text-muted-foreground py-12 text-center">
                        <FontAwesomeIcon
                          icon={ENTITY_ICONS.task}
                          className="mx-auto mb-4 h-12 w-12"
                          style={{ color: entityColors.task }}
                        />
                        <p>{t("listing.noTasks")}</p>
                      </div>
                    )}
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
