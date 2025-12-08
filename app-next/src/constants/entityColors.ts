export const entityColors = {
  data: "#66bb6a", // green[400]
  task: "#f9a825", // yellow[800]
  flow: "#2f65cb", // customBlue[800]
  run: "#ef5350", // red[400]
  collections: "#ec407a", // pink[400]
  benchmarks: "#ab47bc", // purple[400]
  measures: "#7e57c2", // deepPurple[400]
  docs: "#66bb6a", // green[400]
  discussions: "#1565c0", // blue[800]
  apis: "#ef5350", // red[400]
  contribute: "#ab47bc", // purple[400]
  meet: "#f9a825", // yellow[800]
  about: "#66bb6a", // green[400]
  terms: "#42a5f5", // blue[400]
  auth: "#29b6f6", // lightBlue[500]
} as const;

export type EntityKey = keyof typeof entityColors;
