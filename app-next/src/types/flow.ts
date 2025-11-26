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
  uploader: number;
  uploader_name?: string;
  upload_date?: string;

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

  // Tags
  tag?: string[];

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
