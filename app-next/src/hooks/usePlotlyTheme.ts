"use client";

import { useTheme } from "next-themes";

/**
 * Shared Plotly layout theme values — keeps all charts visually consistent
 * across dark and light mode.
 */
export function usePlotlyTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return {
    isDark,
    font: {
      color: isDark ? "rgba(250,250,250,0.7)" : "rgba(0,0,0,0.7)",
    },
    gridcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    zerolinecolor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
    paper_bgcolor: "transparent" as const,
    plot_bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
    // Hover tooltip: always white text and border so it's readable on any marker colour
    hoverlabel: {
      font: { color: "white" },
      bordercolor: "white",
    },
  };
}
