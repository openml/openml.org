// Localized pathname configuration for next-intl
// Maps internal route names to translated URLs per locale

export const pathnames = {
  // Home
  "/": "/",

  // Explore section - base routes
  "/datasets": {
    en: "/datasets",
    nl: "/datasets",
    fr: "/ensembles-de-donnees",
    de: "/datensatze",
  },
  "/datasets/[id]": {
    en: "/datasets/[id]",
    nl: "/datasets/[id]",
    fr: "/ensembles-de-donnees/[id]",
    de: "/datensatze/[id]",
  },
  "/tasks": {
    en: "/tasks",
    nl: "/taken",
    fr: "/taches",
    de: "/aufgaben",
  },
  "/tasks/[id]": {
    en: "/tasks/[id]",
    nl: "/taken/[id]",
    fr: "/taches/[id]",
    de: "/aufgaben/[id]",
  },
  "/flows": {
    en: "/flows",
    nl: "/stromen",
    fr: "/flux",
    de: "/flusse",
  },
  "/flows/[id]": {
    en: "/flows/[id]",
    nl: "/stromen/[id]",
    fr: "/flux/[id]",
    de: "/flusse/[id]",
  },
  "/runs": {
    en: "/runs",
    nl: "/runs",
    fr: "/executions",
    de: "/laufe",
  },
  "/runs/[id]": {
    en: "/runs/[id]",
    nl: "/runs/[id]",
    fr: "/executions/[id]",
    de: "/laufe/[id]",
  },

  // Benchmarks
  "/benchmarks/tasks-suites": {
    en: "/benchmarks/tasks-suites",
    nl: "/benchmarks/taak-suites",
    fr: "/benchmarks/suites-de-taches",
    de: "/benchmarks/aufgaben-suiten",
  },
  "/benchmarks/run-studies": {
    en: "/benchmarks/run-studies",
    nl: "/benchmarks/run-studies",
    fr: "/benchmarks/etudes-d-executions",
    de: "/benchmarks/lauf-studien",
  },

  // Collections
  "/collections/tasks": {
    en: "/collections/tasks",
    nl: "/collecties/taken",
    fr: "/collections/taches",
    de: "/sammlungen/aufgaben",
  },
  "/collections/runs": {
    en: "/collections/runs",
    nl: "/collecties/runs",
    fr: "/collections/executions",
    de: "/sammlungen/laufe",
  },

  // Measures
  "/measures/data-qualities": {
    en: "/measures/data-qualities",
    nl: "/metingen/data",
    fr: "/mesures/donnees",
    de: "/massnahmen/daten",
  },
  "/measures/model-evaluation": {
    en: "/measures/model-evaluation",
    nl: "/metingen/evaluatie",
    fr: "/mesures/evaluation",
    de: "/massnahmen/bewertung",
  },
  "/measures/procedures": {
    en: "/measures/procedures",
    nl: "/metingen/procedures",
    fr: "/mesures/procedure",
    de: "/massnahmen/verfahren",
  },

  // Learn section
  "/documentation": {
    en: "/documentation",
    nl: "/documentatie",
    fr: "/documentation",
    de: "/dokumentation",
  },
  "/api": {
    en: "/api",
    nl: "/api",
    fr: "/api",
    de: "/api",
  },
  "/contribute": {
    en: "/contribute",
    nl: "/bijdragen",
    fr: "/contribuer",
    de: "/beitragen",
  },
  "/terms": {
    en: "/terms",
    nl: "/voorwaarden",
    fr: "/conditions",
    de: "/bedingungen",
  },

  // Community section
  "/about": {
    en: "/about",
    nl: "/over",
    fr: "/a-propos",
    de: "/uber",
  },
  "/team": {
    en: "/team",
    nl: "/team",
    fr: "/equipe",
    de: "/team",
  },
  "/publications": {
    en: "/publications",
    nl: "/publicaties",
    fr: "/publications",
    de: "/publikationen",
  },
  "/blog": {
    en: "/blog",
    nl: "/blog",
    fr: "/blog",
    de: "/blog",
  },
  "/contact": {
    en: "/contact",
    nl: "/contact",
    fr: "/contact",
    de: "/kontakt",
  },
  "/meet-us": {
    en: "/meet-us",
    nl: "/ontmoet-ons",
    fr: "/rencontrez-nous",
    de: "/treffen-sie-uns",
  },

  // Legal pages
  "/privacy": {
    en: "/privacy",
    nl: "/privacy",
    fr: "/confidentialite",
    de: "/datenschutz",
  },
  "/imprint": {
    en: "/imprint",
    nl: "/colofon",
    fr: "/mentions-legales",
    de: "/impressum",
  },

  // Auth section
  "/auth/sign-in": {
    en: "/auth/sign-in",
    nl: "/auth/inloggen",
    fr: "/auth/connexion",
    de: "/auth/anmelden",
  },
  "/auth/sign-up": {
    en: "/auth/sign-up",
    nl: "/auth/aanmelden",
    fr: "/auth/inscription",
    de: "/auth/registrieren",
  },
  "/auth/reset-password": {
    en: "/auth/reset-password",
    nl: "/auth/wachtwoord-reset",
    fr: "/auth/reinitialisation-mot-de-passe",
    de: "/auth/passwort-zurucksetzen",
  },
} as const;

export type Pathnames = typeof pathnames;
export type Pathname = keyof Pathnames;
