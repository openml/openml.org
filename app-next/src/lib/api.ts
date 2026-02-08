import axios, { AxiosInstance, AxiosError } from "axios";
import type {
  Dataset,
  Task,
  Flow,
  Run,
  SearchableEntity,
  EntityType,
} from "@/types";

/**
 * OpenML API Client - Type-safe wrapper around OpenML REST API
 *
 * This client provides methods to interact with the OpenML REST API directly,
 * bypassing Flask backend for improved performance.
 *
 * API Documentation: https://www.openml.org/apis
 */
class OpenMLAPIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_OPENML_API_URL || "https://www.openml.org",
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Request interceptor (for adding auth tokens, logging, etc.)
    this.client.interceptors.request.use(
      (config) => {
        // Add authentication token if available
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor (for error normalization)
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Normalize error messages
        if (error.response) {
          // Server responded with error status
          console.error(
            "API Error:",
            error.response.status,
            error.response.data,
          );
        } else if (error.request) {
          // No response received
          console.error("Network Error:", error.message);
        } else {
          // Error setting up request
          console.error("Request Error:", error.message);
        }
        return Promise.reject(error);
      },
    );
  }

  /**
   * Fetch a single dataset by ID
   */
  async getDataset(id: number): Promise<Dataset> {
    const { data } = await this.client.get<Dataset>(`/api/v1/data/${id}`);
    return data;
  }

  /**
   * Fetch a single task by ID
   */
  async getTask(id: number): Promise<Task> {
    const { data } = await this.client.get<Task>(`/api/v1/task/${id}`);
    return data;
  }

  /**
   * Fetch a single flow by ID
   */
  async getFlow(id: number): Promise<Flow> {
    const { data } = await this.client.get<Flow>(`/api/v1/flow/${id}`);
    return data;
  }

  /**
   * Fetch a single run by ID
   */
  async getRun(id: number): Promise<Run> {
    const { data } = await this.client.get<Run>(`/api/v1/run/${id}`);
    return data;
  }

  /**
   * Generic search method
   */
  async search<T extends SearchableEntity>(
    entityType: EntityType,
    query: string,
    filters?: Record<string, unknown>,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<{ results: T[]; total: number }> {
    const { data } = await this.client.post(`/api/search/${entityType}`, {
      query,
      filters,
      page,
      page_size: pageSize,
    });
    return data;
  }

  /**
   * Search datasets
   */
  async searchDatasets(
    query: string,
    filters?: Record<string, unknown>,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<{ results: Dataset[]; total: number }> {
    return this.search<Dataset>("data", query, filters, page, pageSize);
  }

  /**
   * Search tasks
   */
  async searchTasks(
    query: string,
    filters?: Record<string, unknown>,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<{ results: Task[]; total: number }> {
    return this.search<Task>("task", query, filters, page, pageSize);
  }

  /**
   * Search flows
   */
  async searchFlows(
    query: string,
    filters?: Record<string, unknown>,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<{ results: Flow[]; total: number }> {
    return this.search<Flow>("flow", query, filters, page, pageSize);
  }

  /**
   * Search runs
   */
  async searchRuns(
    query: string,
    filters?: Record<string, unknown>,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<{ results: Run[]; total: number }> {
    return this.search<Run>("run", query, filters, page, pageSize);
  }
}

// Export singleton instance
export const apiClient = new OpenMLAPIClient();
