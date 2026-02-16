/**
 * Central export file for all TypeScript types and interfaces
 */

import type { Dataset, DatasetSearchResult } from "./dataset";
import type { Task, TaskSearchResult } from "./task";
import type { Flow, FlowSearchResult } from "./flow";
import type { Run, RunSearchResult } from "./run";

// Re-export entity types
export type { Dataset, DatasetSearchResult } from "./dataset";
export type { Task, TaskSearchResult } from "./task";
export type { Flow, FlowSearchResult } from "./flow";
export type { Run, RunSearchResult } from "./run";

// Elasticsearch types
export type {
  ElasticsearchHit,
  ElasticsearchResponse,
  ElasticsearchQueryBody,
  SearchFacet,
  SearchFilter,
  PaginationState,
} from "./elasticsearch";

// Union type for all searchable entities
export type SearchableEntity = Dataset | Task | Flow | Run;
export type SearchableEntityResult =
  | DatasetSearchResult
  | TaskSearchResult
  | FlowSearchResult
  | RunSearchResult;

// Entity type discriminator
export type EntityType = "data" | "task" | "flow" | "run";

// Entity ID field mapping
export type EntityIdField = {
  data: "data_id";
  task: "task_id";
  flow: "flow_id";
  run: "run_id";
};

// URL path mapping
export type EntityUrlPath = {
  data: "/datasets";
  task: "/tasks";
  flow: "/flows";
  run: "/runs";
};
