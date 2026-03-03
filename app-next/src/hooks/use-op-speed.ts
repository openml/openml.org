"use client";

import { useEffect, useRef } from "react";

/**
 * A hook to measure operation speed and rendering performance.
 *
 * @param operationName - The name of the operation being monitored.
 * @param dependencies - An array of dependencies to trigger the measurement (like useEffect/useMemo).
 */
export function useOpSpeed(operationName: string) {
  const renderCount = useRef(0);

  // Use layout effect to capture "start" of rendering phases for updates
  // Note: This isn't perfect "render start" but close enough for React dev tools equivalent
  // without breaking purity rules.
  // Ideally, we'd use the Profiler API, but that's for heavy instrumentation.
  useEffect(() => {
    // This runs after the render is committed.
    const now =
      typeof performance !== "undefined" ? performance.now() : Date.now();

    // We can't easily measure "render start" safely inside the render function
    // because it must be pure.
    // Instead, we just mark that a render completed.

    // If you need precise "render logic" timing, you should wrap the expensive logic
    // in the measure() function returned below.

    renderCount.current += 1;

    if (process.env.NODE_ENV === "development") {
      // We log that a commit happened
      console.log(
        `[OpSpeed] ${operationName} committed update #${renderCount.current} at ${now.toFixed(2)}ms`,
      );
    }
  });

  // Return a function to manually measure specific code blocks
  return {
    measure: <T>(fn: () => T, label?: string): T => {
      // It IS safe to call performance.now() inside an event handler or effect-triggered function,
      // just not during the render phase itself.
      // If this is called during render (e.g. in useMemo), it will still trigger the warning if inspected by strict tooling,
      // but is generally the only way to measure synchronous code blocks.
      const start =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      const result = fn();
      const end =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[OpSpeed] ${operationName}${label ? `:${label}` : ""} execution time: ${(
            end - start
          ).toFixed(2)}ms`,
        );
      }
      return result;
    },
  };
}
