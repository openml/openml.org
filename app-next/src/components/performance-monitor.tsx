"use client";

import { useReportWebVitals } from "next/web-vitals";

// Helper to rate the metric value based on Core Web Vitals thresholds
function getRating(name: string, value: number) {
  switch (name) {
    case "FCP":
      return value <= 1800
        ? "🟢 Good"
        : value <= 3000
          ? "jm Needs Improvement"
          : "🔴 Poor";
    case "LCP":
      return value <= 2500
        ? "🟢 Good"
        : value <= 4000
          ? "🟡 Needs Improvement"
          : "🔴 Poor";
    case "CLS":
      return value <= 0.1
        ? "🟢 Good"
        : value <= 0.25
          ? "🟡 Needs Improvement"
          : "🔴 Poor";
    case "FID":
      return value <= 100
        ? "🟢 Good"
        : value <= 300
          ? "🟡 Needs Improvement"
          : "🔴 Poor";
    case "INP":
      return value <= 200
        ? "🟢 Good"
        : value <= 500
          ? "🟡 Needs Improvement"
          : "🔴 Poor";
    case "TTFB":
      return value <= 800
        ? "🟢 Good"
        : value <= 1800
          ? "🟡 Needs Improvement"
          : "🔴 Poor";
    default:
      return "";
  }
}

export function PerformanceMonitor() {
  useReportWebVitals((metric) => {
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      const rating = getRating(metric.name, metric.value);
      const logMsg = `[Performance] ${metric.name}: ${Math.round(metric.value)}${metric.name === "CLS" ? "" : "ms"} ${rating}`;

      switch (metric.name) {
        case "FCP":
          console.log(
            `${logMsg} (First Contentful Paint - Time until first text/image appears)`,
          );
          break;
        case "LCP":
          console.log(
            `${logMsg} (Largest Contentful Paint - Time until main content appears)`,
          );
          break;
        case "CLS":
          console.log(
            `${logMsg} (Cumulative Layout Shift - How much the page jumps around)`,
          );
          break;
        case "FID":
          console.log(
            `${logMsg} (First Input Delay - Speed of first interaction)`,
          );
          break;
        case "INP":
          console.log(
            `${logMsg} (Interaction to Next Paint - Responsiveness to clicks/typing)`,
          );
          break;
        case "TTFB":
          console.log(`${logMsg} (Time to First Byte - Server response time)`);
          break;
      }
    }
  });

  return null;
}
