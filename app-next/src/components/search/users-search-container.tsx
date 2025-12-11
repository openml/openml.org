"use client";

import { useState } from "react";
import Link from "next/link";
import { WithSearch, Paging } from "@elastic/react-search-ui";
import { FilterBar } from "./filter-bar";
import { ControlsBar } from "./controls-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Database,
  Cog,
  FlaskConical,
  MapPin,
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

export function UsersSearchContainer() {
  const [view, setView] = useState("list");

  return (
    <WithSearch
      mapContextToProps={({ isLoading, error }) => ({
        isLoading,
        error,
      })}
    >
      {({ isLoading, error }) => (
        <div className="w-full space-y-0">
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

          {/* Search Input */}
          <WithSearch
            mapContextToProps={({ searchTerm, setSearchTerm }) => ({
              searchTerm,
              setSearchTerm,
            })}
          >
            {({ searchTerm, setSearchTerm }) => (
              <div className="bg-background border-b p-4">
                <div className="relative max-w-md">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Search users by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm?.(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            )}
          </WithSearch>

          <FilterBar facets={searchFacets} />
          <ControlsBar
            view={view}
            onViewChange={setView}
            sortOptions={sortOptions}
          />

          <div className="p-4">
            <WithSearch mapContextToProps={({ results }) => ({ results })}>
              {({ results }) => (
                <>
                  <div className="w-full space-y-0">
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
                              <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-lg font-bold text-white">
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
                      <div className="py-12 text-center">
                        <p className="text-muted-foreground">
                          No users found. Try adjusting your search or filters.
                        </p>
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

                      const totalPages = Math.ceil(
                        totalResults / resultsPerPage,
                      );
                      const esLimit = 10000;
                      const effectiveMaxPage = Math.min(
                        totalPages,
                        Math.floor(esLimit / resultsPerPage),
                      );
                      const isNearLimit = current >= effectiveMaxPage - 1;

                      return (
                        <div className="mt-6 space-y-4">
                          {isNearLimit && totalResults > esLimit && (
                            <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-sm dark:border-orange-800 dark:bg-orange-950">
                              <p className="text-orange-800 dark:text-orange-200">
                                ⚠️ ElasticSearch has a limit of 10,000 results.
                                Please refine your search or use filters to see
                                more specific results.
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="text-muted-foreground text-sm">
                              Showing {pagingStart} - {pagingEnd} of{" "}
                              {totalResults.toLocaleString()}{" "}
                              {resultSearchTerm ? "results" : "users"}
                            </div>

                            <Paging
                              view={({
                                current: currentPage,
                                totalPages: maxPages,
                              }) => {
                                const pageNumbers = [];
                                for (let i = 1; i <= maxPages; i++) {
                                  pageNumbers.push(i);
                                }

                                return (
                                  <div className="flex items-center gap-1">
                                    {pageNumbers.map((pageNum) => {
                                      const isDisabled =
                                        pageNum > effectiveMaxPage;
                                      return (
                                        <button
                                          key={pageNum}
                                          onClick={() => {
                                            if (!isDisabled)
                                              setCurrent?.(pageNum);
                                          }}
                                          disabled={isDisabled}
                                          className={`h-9 min-w-9 rounded px-2 text-sm transition-colors ${
                                            currentPage === pageNum
                                              ? "bg-primary text-primary-foreground font-semibold"
                                              : isDisabled
                                                ? "text-muted-foreground/30 cursor-not-allowed"
                                                : "hover:bg-muted"
                                          }`}
                                        >
                                          {pageNum}
                                        </button>
                                      );
                                    })}
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
