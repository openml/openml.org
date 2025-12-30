/**
 * Entity color hex values for inline styles and dynamic coloring
 */
export const entityColors = {
  data: "#66bb6a", // green-400 - Datasets
  task: "#f97316", // orange-500 - Tasks (aligned with Tailwind)
  flow: "#2f65cb", // blue-600 - Flows
  run: "#ef5350", // red-400 - Runs
  collections: "#ec407a", // pink-400 - Collections
  benchmarks: "#ab47bc", // purple-400 - Benchmarks
  measures: "#7e57c2", // violet-400 - Measures
  docs: "#66bb6a", // green-400 - Documentation
  discussions: "#1565c0", // blue-800 - Discussions
  apis: "#ef5350", // red-400 - APIs
  contribute: "#ab47bc", // purple-400 - Contribute
  meet: "#f97316", // orange-500 - Meet Up (aligned with Tailwind)
  about: "#66bb6a", // green-400 - About
  terms: "#42a5f5", // blue-400 - Terms
  auth: "#29b6f6", // sky-400 - Auth
} as const;

/**
 * Tailwind CSS class mappings for entity colors
 * Use these for className-based styling (text, bg, border)
 */
export const entityTailwindColors = {
  data: {
    text: "text-green-500",
    bg: "bg-green-500",
    border: "border-green-500",
  },
  task: {
    text: "text-orange-500",
    bg: "bg-orange-500",
    border: "border-orange-500",
  },
  flow: { text: "text-blue-600", bg: "bg-blue-600", border: "border-blue-600" },
  run: { text: "text-red-500", bg: "bg-red-500", border: "border-red-500" },
  collections: {
    text: "text-pink-500",
    bg: "bg-pink-500",
    border: "border-pink-500",
  },
  benchmarks: {
    text: "text-purple-500",
    bg: "bg-purple-500",
    border: "border-purple-500",
  },
  measures: {
    text: "text-violet-500",
    bg: "bg-violet-500",
    border: "border-violet-500",
  },
} as const;

export type EntityKey = keyof typeof entityColors;
export type EntityColorKey = keyof typeof entityTailwindColors;
