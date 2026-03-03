/**
 * openML Runtime Configuration Utility
 * * This helper ensures we don't hardcode NEXT_PUBLIC_ variables at build time.
 * It prioritizes the injected window.__ENV__ on the client and
 * standard process.env on the server.
 */

// 1. Define the interface for your environment variables
interface RuntimeEnv {
  [key: string]: string | undefined;
}

// 2. Extend the global Window interface
declare global {
  interface Window {
    __ENV__: RuntimeEnv;
  }
}

/**
 * openML Runtime Configuration Utility
 */
export const getConfig = (key: string): string => {
  // Client-side: Read from the injected window object
  if (typeof window !== "undefined") {
    // No more 'any' error here! TypeScript now knows window.__ENV__ exists.
    return window.__ENV__?.[key] || "";
  }

  // Server-side: Read from the container's process.env
  return process.env[key] || "";
};

// Type-safe helper for commonly used variables
export const APP_CONFIG = {
  get apiUrl() {
    return getConfig("NEXT_PUBLIC_API_URL");
  },
  get esServer() {
    return getConfig("NEXT_PUBLIC_ELASTICSEARCH_SERVER");
  },
  get minioUrl() {
    return getConfig("NEXT_PUBLIC_URL_MINIO");
  },
  get openmlApiUrl() {
    return getConfig("NEXT_PUBLIC_OPENML_API_URL");
  },
  get urlApi() {
    return getConfig("NEXT_PUBLIC_URL_API");
  },
  get siteUrl() {
    return getConfig("NEXT_PUBLIC_URL");
  },
  get esUrl() {
    return getConfig("NEXT_PUBLIC_ELASTICSEARCH_URL");
  },
  get enableEs() {
    return getConfig("NEXT_PUBLIC_ENABLE_ELASTICSEARCH");
  },
};
