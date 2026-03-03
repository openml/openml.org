/**
 * OpenML Flow Entity
 * Represents a machine learning workflow/pipeline in the OpenML platform
 */
export interface Flow {
  // Core identifiers
  flow_id: number;
  full_name?: string;
  name: string;
  custom_name?: string;
  className_name?: string;
  version: string;
  external_version?: string;

  // Metadata
  description?: string;
  uploader: string; // uploader name
  uploader_id: number;
  upload_date?: string;
  creator?: string;
  contributor?: string;

  // Dependencies
  dependencies?: string;

  // Parameters
  parameter?: Array<{
    name: string;
    data_type: string;
    default_value: string;
    description?: string;
  }>;

  // Components (for complex flows)
  components?: {
    component: Array<{
      identifier: string;
      flow: Flow; // Recursive definition for nested flows
    }>;
  };

  // Statistics
  runs?: number;
  nr_of_likes?: number;
  nr_of_downvotes?: number;
  nr_of_issues?: number;
  nr_of_downloads?: number;
  total_downloads?: number;
  reach?: number;
  impact?: number;

  // Date
  date?: string;

  // Tags
  tag?: string[];
  tags?: Array<{
    tag: string;
    uploader: string;
  }>;

  // Binary information
  binary?: {
    format: string;
    md5_checksum: string;
  };
}

/**
 * Flow search result (includes Elasticsearch metadata)
 */
export interface FlowSearchResult extends Flow {
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
