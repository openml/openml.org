// Feature information for a dataset
export interface DatasetFeature {
  index: number;
  name: string;
  type: "nominal" | "numeric" | "string" | "date";
  distinct?: number;
  missing?: number;
  target?: string; // "1" if target, undefined otherwise
  min?: string;
  max?: string;
  mean?: string;
  stdev?: string;
  distr?: Array<[string, number]>;
}

// Tag information
export interface DatasetTag {
  tag: string;
  uploader?: number;
  window?: number;
}

// OpenML Dataset Entity
export interface Dataset {
  // Core identifiers
  data_id: number;
  name: string;
  version: number;
  version_label?: string;

  // Metadata
  description: string;
  format: string;

  // Uploader information
  uploader: string; // uploader name
  uploader_id: number;

  // Dates
  date: string; // upload date
  upload_date?: string;
  processing_date?: string;

  // Status and visibility
  status: "active" | "deactivated" | "in_preparation";
  visibility?: "public" | "private";

  // License
  licence: string;

  // Target and ID attributes
  row_id_attribute?: string;
  default_target_attribute?: string;
  ignore_attribute?: string;

  // Tags and categorization
  tags: DatasetTag[];
  tag?: string[]; // Alternative format

  // Dataset statistics (summary)
  instances?: number;
  missing_values?: number;

  // Features - detailed feature information
  features: DatasetFeature[];

  // Quality metrics (meta-features)
  qualities: Record<string, number>;

  // File information
  file_id?: number;
  md5_checksum?: string;
  url: string;
  parquet_url?: string;

  // Social metrics
  nr_of_likes: number;
  nr_of_downloads: number;
  nr_of_issues: number;
  runs?: number; // number of runs

  // Related entities
  tasks?: number[];

  // Processing metadata
  original_data_url?: string;
  paper_url?: string;
  citation?: string;
  collection_date?: string;
  language?: string;
  creator?: string;
}

// Dataset search result (includes Elasticsearch metadata)
export interface DatasetSearchResult extends Dataset {
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
