/**
 * OpenML Run Entity
 * Represents an experiment run in the OpenML platform
 */
export interface Run {
  // Core identifiers
  run_id: number;
  uploader: number;
  uploader_name?: string;

  // Related entities
  task_id: number;
  task?: {
    task_id: number;
    task_type: string;
    source_data: {
      data_id: number;
      name: string;
    };
  };

  flow_id: number;
  flow?: {
    flow_id: number;
    name: string;
  };
  flow_name?: string; // For backward compatibility

  // Metadata
  upload_time?: string;
  error_message?: string | null;

  // Parameter settings
  parameter_setting?: Array<{
    name: string;
    value: string;
    component?: {
      identifier: string;
      flow_id: number;
    };
  }>;

  // Evaluation results
  evaluations?: Array<{
    measure: string;
    value: number;
    stdev?: number;
    array_data?: string;
  }>;

  // Output files
  output_files?: {
    file: Array<{
      name: string;
      file_id: number;
      url: string;
    }>;
  };

  // Tags
  tag?: string[];

  // Setup information
  setup_id?: number;
  setup_string?: string;
}

/**
 * Run search result (includes Elasticsearch metadata)
 */
export interface RunSearchResult extends Run {
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
