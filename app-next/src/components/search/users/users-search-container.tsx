"use client";

import { useState } from "react";
import Link from "next/link";
import { WithSearch, Paging } from "@elastic/react-search-ui";
import { FilterBar } from "../shared/filter-bar";
import { ControlsBar } from "../shared/controls-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { entityColors } from "@/constants/entityColors";
import {
  Database,
  Cog,
  FlaskConical,
  Building2,
  Calendar,
  Search,
} from "lucide-react";

interface UserResult {
  user_id?: { raw: string | number };
  username?: { raw: string };
  first_name?: { raw: string };
  last_name?: { raw: string };
  bio?: { snippet?: string; raw?: string };
  image?: { raw: string };
  affiliation?: { raw: string };
  country?: { raw: string };
  date?: { raw: string };
  datasets_uploaded?: { raw: number };
  flows_uploaded?: { raw: number };
  tasks_uploaded?: { raw: number };
  runs_uploaded?: { raw: number };
  downloads_received_data?: { raw: number };
  downloads_received_flow?: { raw: number };
  likes_received_data?: { raw: number };
  likes_received_flow?: { raw: number };
  [key: string]: unknown;
}

const searchFacets = [
  { label: "Country", field: "country.keyword" },
  { label: "Affiliation", field: "affiliation.keyword" },
];

const sortOptions = [
  {
    name: "Most Recent",
    value: [{ field: "date", direction: "desc" }],
    id: "recent",
  },
  {
    name: "Most Datasets",
    value: [{ field: "datasets_uploaded", direction: "desc" }],
    id: "datasets",
  },
  {
    name: "Most Flows",
    value: [{ field: "flows_uploaded", direction: "desc" }],
    id: "flows",
  },
  {
    name: "Most Active",
    value: [{ field: "runs_uploaded", direction: "desc" }],
    id: "active",
  },
];

// Convert country code to flag emoji
function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

interface UsersSearchContainerProps {
  searchScope: "all" | "names" | "tags";
  onSearchScopeChange: (scope: "all" | "names" | "tags") => void;
}

export function UsersSearchContainer({
  searchScope,
  onSearchScopeChange,
}: UsersSearchContainerProps) {
  const [view, setView] = useState("list");

  const handleSearchScopeChange = (scope: string) => {
    onSearchScopeChange(scope as "all" | "names" | "tags");
  };

  const searchScopeOptions = [
    { value: "all", label: "All fields" },
    { value: "names", label: "Names only" },
    { value: "tags", label: "Tags only" },
  ];

  return (
    <WithSearch
      mapContextToProps={({
        isLoading,
        error,
        searchTerm,
        totalResults,
        setSearchTerm,
      }) => ({
        isLoading,
        error,
        searchTerm,
        totalResults,
        setSearchTerm,
      })}
    >
      {({ isLoading, error, searchTerm, totalResults, setSearchTerm }) => (
        <div className="w-full max-w-full space-y-0 overflow-x-hidden">
          {isLoading && (
            <div className="bg-primary/20 h-1 w-full overflow-hidden">
              <div className="bg-primary h-full w-1/3 animate-pulse" />
            </div>
          )}
          {error && (
            <div className="bg-destructive/10 border-destructive/20 m-4 rounded-md border p-4">
              <p className="text-destructive text-sm">
                Error:{" "}
                {typeof error === "string"
                  ? error
                  : (error as Error).message || "Unknown error"}
              </p>
            </div>
          )}
          <FilterBar
            facets={searchFacets}
            showSearch={true}
            searchScopeOptions={searchScopeOptions}
            onSearchScopeChange={handleSearchScopeChange}
            defaultSearchScope={searchScope}
          />{" "}
          {/* Search Results Summary */}
          {searchTerm && (
            <div className="border-b bg-slate-50 px-4 py-3 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      <span className="text-muted-foreground text-sm">
                        Searching for "{searchTerm}"...
                      </span>
                    </div>
                  ) : (
                    <>
                      {(totalResults ?? 0) > 0 ? (
                        <span className="text-sm">
                          Found{" "}
                          <span className="text-primary font-semibold">
                            {totalResults}
                          </span>{" "}
                          {totalResults === 1 ? "user" : "users"} matching "
                          <span className="font-medium">{searchTerm}</span>"
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Search className="text-muted-foreground h-4 w-4" />
                          <span className="text-muted-foreground text-sm">
                            No users found matching "
                            <span className="text-foreground font-medium">
                              {searchTerm}
                            </span>
                            "
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          <ControlsBar
            view={view}
            onViewChange={setView}
            sortOptions={sortOptions}
          />
          <div className="p-4">
            <WithSearch mapContextToProps={({ results }) => ({ results })}>
              {({ results }) => (
                <>
                  <div
                    className={
                      view === "grid"
                        ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        : "w-full space-y-0"
                    }
                  >
                    {results && results.length > 0 ? (
                      results.map((result: UserResult, index: number) => {
                        const userId = result.user_id?.raw;
                        const firstName = result.first_name?.raw || "";
                        const lastName = result.last_name?.raw || "";
                        const fullName = `${firstName} ${lastName}`.trim();
                        const initials =
                          `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
                        const username = result.username?.raw;
                        const bio = result.bio?.snippet || result.bio?.raw;
                        const totalUploads =
                          (result.datasets_uploaded?.raw || 0) +
                          (result.flows_uploaded?.raw || 0) +
                          (result.tasks_uploaded?.raw || 0) +
                          (result.runs_uploaded?.raw || 0);

                        // Grid View Card
                        if (view === "grid") {
                          return (
                            <Link
                              key={userId || index}
                              href={`/users/${userId}`}
                              className="hover:border-primary group relative flex flex-col items-center rounded-lg border bg-white p-6 transition-all hover:shadow-lg dark:bg-slate-800"
                            >
                              <Avatar className="h-20 w-20">
                                <AvatarImage
                                  src={result.image?.raw}
                                  alt={fullName}
                                />
                                <AvatarFallback className="gradient-bg text-2xl font-bold text-white">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>

                              <h3 className="mt-3 text-center text-base font-semibold">
                                {fullName || username || "Anonymous"}
                              </h3>
                              {username && (
                                <p className="text-muted-foreground text-sm">
                                  @{username}
                                </p>
                              )}

                              {bio && (
                                <p className="text-muted-foreground mt-2 line-clamp-2 text-center text-sm">
                                  {bio}
                                </p>
                              )}

                              <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs">
                                {result.datasets_uploaded?.raw !==
                                  undefined && (
                                  <span className="flex items-center gap-1">
                                    <Database className="h-3 w-3 text-green-600" />
                                    <span className="font-medium">
                                      {result.datasets_uploaded.raw}
                                    </span>
                                  </span>
                                )}
                                {result.flows_uploaded?.raw !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <Cog className="h-3 w-3 text-orange-600" />
                                    <span className="font-medium">
                                      {result.flows_uploaded.raw}
                                    </span>
                                  </span>
                                )}
                                {result.runs_uploaded?.raw !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <FlaskConical className="h-3 w-3 text-red-600" />
                                    <span className="font-medium">
                                      {result.runs_uploaded.raw}
                                    </span>
                                  </span>
                                )}
                              </div>

                              <Badge variant="outline" className="mt-3 text-xs">
                                {totalUploads} total uploads
                              </Badge>
                            </Link>
                          );
                        }

                        // List View (existing)
                        return (
                          <div
                            key={userId || index}
                            className="hover:bg-accent relative flex items-start gap-4 border-b p-4 transition-colors"
                          >
                            <Avatar className="h-16 w-16 shrink-0">
                              <AvatarImage
                                src={result.image?.raw}
                                alt={fullName}
                              />
                              <AvatarFallback className="gradient-bg text-lg font-bold text-white">
                                {initials}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-start justify-between gap-3">
                                <div>
                                  <h3 className="text-base font-semibold">
                                    {fullName || username || "Anonymous"}
                                  </h3>
                                  {username && (
                                    <p className="text-muted-foreground text-sm">
                                      @{username}
                                    </p>
                                  )}
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                  title="Total uploads"
                                >
                                  {totalUploads} uploads
                                </Badge>
                              </div>

                              {bio && (
                                <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                                  {bio}
                                </p>
                              )}

                              <div className="text-muted-foreground mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                {result.affiliation?.raw && (
                                  <span className="flex items-center gap-1.5">
                                    <Building2 className="h-3 w-3" />
                                    {result.affiliation.raw}
                                  </span>
                                )}
                                {result.country?.raw && (
                                  <span className="flex items-center gap-1.5">
                                    <span className="text-base">
                                      {getCountryFlag(result.country.raw)}
                                    </span>
                                    {result.country.raw}
                                  </span>
                                )}
                                {result.date?.raw && (
                                  <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(
                                      result.date.raw,
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                    })}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                {result.datasets_uploaded?.raw !==
                                  undefined && (
                                  <span className="flex items-center gap-1.5">
                                    <Database className="h-3 w-3 text-green-600" />
                                    <span className="font-medium">
                                      {result.datasets_uploaded.raw}
                                    </span>
                                    <span className="text-muted-foreground">
                                      datasets
                                    </span>
                                  </span>
                                )}
                                {result.flows_uploaded?.raw !== undefined && (
                                  <span className="flex items-center gap-1.5">
                                    <Cog className="h-3 w-3 text-orange-600" />
                                    <span className="font-medium">
                                      {result.flows_uploaded.raw}
                                    </span>
                                    <span className="text-muted-foreground">
                                      flows
                                    </span>
                                  </span>
                                )}
                                {result.runs_uploaded?.raw !== undefined && (
                                  <span className="flex items-center gap-1.5">
                                    <FlaskConical className="h-3 w-3 text-red-600" />
                                    <span className="font-medium">
                                      {result.runs_uploaded.raw}
                                    </span>
                                    <span className="text-muted-foreground">
                                      runs
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Invisible overlay link for entire row clickability */}
                            <Link
                              href={`/users/${userId}`}
                              className="absolute inset-0"
                              aria-label={`View profile of ${fullName || username}`}
                            >
                              <span className="sr-only">
                                View profile of {fullName || username}
                              </span>
                            </Link>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-16 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                          <Search className="text-muted-foreground h-8 w-8" />
                        </div>
                        {searchTerm ? (
                          <>
                            <h3 className="mb-2 text-lg font-semibold">
                              No users found
                            </h3>
                            <p className="text-muted-foreground mb-4 text-sm">
                              We couldn't find any users matching "
                              <span className="text-foreground font-medium">
                                {searchTerm}
                              </span>
                              "
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Try adjusting your search terms or check for typos
                            </p>
                          </>
                        ) : (
                          <>
                            <h3 className="mb-2 text-lg font-semibold">
                              No users found
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Try adjusting your filters to see more results
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  <WithSearch
                    mapContextToProps={({
                      pagingStart,
                      pagingEnd,
                      resultSearchTerm,
                      totalResults,
                      current,
                      resultsPerPage,
                      setCurrent,
                    }) => ({
                      pagingStart,
                      pagingEnd,
                      resultSearchTerm,
                      totalResults,
                      current,
                      resultsPerPage,
                      setCurrent,
                    })}
                  >
                    {({
                      pagingStart,
                      pagingEnd,
                      resultSearchTerm,
                      totalResults,
                      current,
                      resultsPerPage,
                      setCurrent,
                    }) => {
                      if (
                        !totalResults ||
                        !resultsPerPage ||
                        !current ||
                        !setCurrent
                      ) {
                        return null;
                      }

                      const MAX_RESULT_WINDOW = 10000;
                      const pageSize = resultsPerPage || 20;
                      const MAX_ACCESSIBLE_PAGE = Math.floor(
                        MAX_RESULT_WINDOW / pageSize,
                      );
                      const SHOW_WARNING_FROM = Math.max(
                        1,
                        MAX_ACCESSIBLE_PAGE - 1,
                      );

                      return (
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="text-muted-foreground text-sm">
                              Showing {pagingStart} - {pagingEnd} of{" "}
                              {totalResults.toLocaleString()}{" "}
                              {resultSearchTerm ? "results" : "users"}
                            </div>

                            <Paging
                              view={({ current, totalPages, onChange }) => {
                                if (!onChange || !current) {
                                  return null;
                                }

                                const PAGES_TO_SHOW = 5;
                                let startPage = Math.max(
                                  1,
                                  current - Math.floor(PAGES_TO_SHOW / 2),
                                );
                                let endPage = Math.min(
                                  totalPages,
                                  startPage + PAGES_TO_SHOW - 1,
                                );

                                if (endPage - startPage < PAGES_TO_SHOW - 1) {
                                  startPage = Math.max(
                                    1,
                                    endPage - PAGES_TO_SHOW + 1,
                                  );
                                }

                                const pages = [];
                                for (let i = startPage; i <= endPage; i++) {
                                  pages.push(i);
                                }

                                const isPageAccessible = (page: number) =>
                                  page <= MAX_ACCESSIBLE_PAGE;
                                const isCurrentBeyondLimit =
                                  current > MAX_ACCESSIBLE_PAGE;

                                return (
                                  <div className="flex flex-col items-center gap-3">
                                    {current >= SHOW_WARNING_FROM && (
                                      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                                        ⚠️ Elasticsearch limit: Only{" "}
                                        {MAX_ACCESSIBLE_PAGE.toLocaleString()}{" "}
                                        pages (
                                        {MAX_RESULT_WINDOW.toLocaleString()}{" "}
                                        results) can be accessed.{" "}
                                        {isCurrentBeyondLimit
                                          ? `Page ${current} is not accessible.`
                                          : `Showing page ${current.toLocaleString()} of ${totalPages.toLocaleString()} total pages.`}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => onChange(current - 1)}
                                        disabled={current === 1}
                                        className="hover:bg-muted rounded border px-3 py-1 disabled:opacity-50"
                                      >
                                        Previous
                                      </button>
                                      {startPage > 1 && (
                                        <>
                                          <button
                                            onClick={() => onChange(1)}
                                            className="hover:bg-muted rounded border px-3 py-1"
                                          >
                                            1
                                          </button>
                                          {startPage > 2 && (
                                            <span className="px-2">...</span>
                                          )}
                                        </>
                                      )}
                                      {pages.map((page) => {
                                        const isAccessible =
                                          isPageAccessible(page);
                                        const isCurrent = page === current;
                                        return (
                                          <button
                                            key={page}
                                            onClick={() =>
                                              isAccessible && onChange(page)
                                            }
                                            disabled={!isAccessible}
                                            className={`rounded border px-3 py-1 ${
                                              isCurrent
                                                ? "text-white"
                                                : isAccessible
                                                  ? "hover:bg-muted dark:hover:bg-slate-700"
                                                  : "cursor-not-allowed line-through opacity-30"
                                            }`}
                                            style={
                                              isCurrent
                                                ? {
                                                    backgroundColor:
                                                      entityColors.auth,
                                                  }
                                                : undefined
                                            }
                                            title={
                                              !isAccessible
                                                ? `Page ${page} exceeds ES limit (max: ${MAX_ACCESSIBLE_PAGE})`
                                                : ""
                                            }
                                          >
                                            {page}
                                          </button>
                                        );
                                      })}
                                      {endPage < totalPages && (
                                        <>
                                          {endPage < totalPages - 1 && (
                                            <span className="px-2">...</span>
                                          )}
                                          <button
                                            onClick={() =>
                                              isPageAccessible(totalPages) &&
                                              onChange(totalPages)
                                            }
                                            disabled={
                                              !isPageAccessible(totalPages)
                                            }
                                            className={`rounded border px-3 py-1 ${
                                              isPageAccessible(totalPages)
                                                ? "hover:bg-muted"
                                                : "cursor-not-allowed line-through opacity-30"
                                            }`}
                                            title={
                                              !isPageAccessible(totalPages)
                                                ? `Page ${totalPages} exceeds ES limit (max: ${MAX_ACCESSIBLE_PAGE})`
                                                : ""
                                            }
                                          >
                                            {totalPages}
                                          </button>
                                        </>
                                      )}
                                      <button
                                        onClick={() => onChange(current + 1)}
                                        disabled={current === totalPages}
                                        className="hover:bg-muted rounded border px-3 py-1 disabled:opacity-50"
                                      >
                                        Next
                                      </button>
                                    </div>
                                  </div>
                                );
                              }}
                            />
                          </div>
                        </div>
                      );
                    }}
                  </WithSearch>
                </>
              )}
            </WithSearch>
          </div>
        </div>
      )}
    </WithSearch>
  );
}
