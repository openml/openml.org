/**
 * OpenML Task Entity
 * Represents a machine learning task in the OpenML platform
 */
export interface Task {
  // Core identifiers
  task_id: number;
  task_type_id: number;
  task_type: string;

  // Stats
  nr_of_likes?: number;
  nr_of_downvotes?: number;
  nr_of_issues?: number;
  nr_of_downloads?: number;

  // Metadata
  name?: string;
  source_data: {
    data_id: number;
    name: string;
  };
  source_data_name?: string; // For backward compatibility

  // Task configuration
  target_feature?: string;
  estimation_procedure?: {
    type: string;
    name?: string;
    parameters: Record<string, string>;
  };
  evaluation_measures?: string[];
  cost_matrix?: number[][];

  // Task type details
  tasktype?: {
    name: string;
    description?: string;
  };

  // Statistics
  runs?: number;

  // Related entities
  input?: {
    source_data: {
      data_set: {
        data_set_id: number;
        target_feature: string;
      };
    };
    estimation_procedure: {
      type: string;
      data_splits_url: string;
      parameters: Record<string, string>;
    };
    evaluation_measures: {
      evaluation_measure: string[];
    };
  };

  // Tags
  tag?: string[];

  // Quality metrics
  quality?: Record<string, string>;

  // Dates
  // Dates
  upload_date?: string;
  date?: string;
}

/**
 * Task search result (includes Elasticsearch metadata)
 */
export interface TaskSearchResult extends Task {
  _meta?: {
    score: number;
    rawHit: {
      _index: string;
      _type: string;
      _id: string;
      _score: number;
    };
  };
}
