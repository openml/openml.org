import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Dataset, Task, Flow, Run } from "@/types";

/**
 * React Query hook for fetching a dataset by ID
 *
 * @example
 * const { data: dataset, isLoading, error } = useDataset(123);
 */
export function useDataset(
  id: number | undefined,
  options?: Omit<UseQueryOptions<Dataset, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<Dataset, Error>({
    queryKey: ["dataset", id],
    queryFn: () => apiClient.getDataset(id!),
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * React Query hook for fetching a task by ID
 */
export function useTask(
  id: number | undefined,
  options?: Omit<UseQueryOptions<Task, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<Task, Error>({
    queryKey: ["task", id],
    queryFn: () => apiClient.getTask(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * React Query hook for fetching a flow by ID
 */
export function useFlow(
  id: number | undefined,
  options?: Omit<UseQueryOptions<Flow, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<Flow, Error>({
    queryKey: ["flow", id],
    queryFn: () => apiClient.getFlow(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * React Query hook for fetching a run by ID
 */
export function useRun(
  id: number | undefined,
  options?: Omit<UseQueryOptions<Run, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<Run, Error>({
    queryKey: ["run", id],
    queryFn: () => apiClient.getRun(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
