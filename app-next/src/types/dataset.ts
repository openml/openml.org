/**
 * OpenML Dataset Entity
 * Represents a dataset in the OpenML platform
 */
export interface Dataset {
  // Core identifiers
  data_id: number;
  name: string;
  version: string;
  version_label?: string;

  // Metadata
  description: string;
  format: string;
  uploader: number;
  uploader_name: string;
  upload_date: string;
  status: "active" | "deactivated" | "in_preparation";
  visibility: "public" | "private";

  // Target and ID attributes
  row_id_attribute?: string;
  default_target_attribute?: string;
  ignore_attribute?: string;

  // Tags and categorization
  tag: string[];

  // Dataset statistics
  instances: number;
  features: number;
  missing_values: number;

  // Quality metrics (dynamic, can have any numeric property)
  qualities?: Record<string, number>;

  // File information
  file_id?: number;
  md5_checksum?: string;
  url?: string;

  // Related entities
  tasks?: number[];
  runs?: number[];

  // Processing metadata
  processing_date?: string;
  original_data_url?: string;
  paper_url?: string;
  citation?: string;
  licence?: string;
  collection_date?: string;
  language?: string;
}

/**
 * Dataset search result (includes Elasticsearch metadata)
 */
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
