// Example usage of localized routing in Next.js components

import { Link } from "@/config/routing";
import { useRouter, usePathname } from "@/config/routing";

// ============================================
// Example 1: Basic Link Usage
// ============================================
export function NavigationExample() {
  return (
    <nav>
      {/* Simple links - automatically localized */}
      <Link href="/datasets">Datasets</Link>
      {/* Renders:
          EN: /datasets
          NL: /datasets
          FR: /ensembles-de-donnees
          DE: /datensatze
      */}

      <Link href="/tasks">Tasks</Link>
      {/* Renders:
          EN: /tasks
          NL: /taken
          FR: /taches
          DE: /aufgaben
      */}
    </nav>
  );
}

// ============================================
// Example 2: Dynamic Routes with Parameters
// ============================================
export function DatasetCard({ id }: { id: string }) {
  return (
    <Link
      href={{
        pathname: "/datasets/[id]",
        params: { id },
      }}
    >
      View Dataset {id}
    </Link>
    /* Renders:
       EN: /datasets/123
       NL: /datasets/123
       FR: /ensembles-de-donnees/123
       DE: /datensatze/123
    */
  );
}

// ============================================
// Example 3: Programmatic Navigation
// ============================================
export function SearchResults() {
  const router = useRouter();

  const handleDatasetClick = (id: string) => {
    // Navigate programmatically - automatically localized
    router.push({
      pathname: "/datasets/[id]",
      params: { id },
    });
  };

  return (
    <button onClick={() => handleDatasetClick("456")}>Go to Dataset</button>
  );
}

// ============================================
// Example 4: Get Current Pathname
// ============================================
export function ActiveNavItem() {
  const pathname = usePathname();
  // Returns internal pathname: "/datasets" (not the localized URL)

  const isActive = pathname === "/datasets";

  return <div className={isActive ? "active" : ""}>Datasets</div>;
}

// ============================================
// Example 5: Nested Routes
// ============================================
export function BenchmarksMenu() {
  return (
    <ul>
      <li>
        <Link href="/benchmarks/tasks-suites">Task Suites</Link>
        {/* Renders:
            EN: /benchmarks/tasks-suites
            NL: /benchmarks/taak-suites
            FR: /benchmarks/suites-de-taches
            DE: /benchmarks/aufgaben-suiten
        */}
      </li>
      <li>
        <Link href="/benchmarks/run-studies">Run Studies</Link>
        {/* Renders:
            EN: /benchmarks/run-studies
            NL: /benchmarks/run-studies
            FR: /benchmarks/etudes-d-executions
            DE: /benchmarks/lauf-studien
        */}
      </li>
    </ul>
  );
}

// ============================================
// Example 6: Auth Routes
// ============================================
export function AuthButtons() {
  return (
    <div>
      <Link href="/auth/sign-in">Sign In</Link>
      {/* Renders:
          EN: /auth/sign-in
          NL: /auth/inloggen
          FR: /auth/connexion
          DE: /auth/anmelden
      */}

      <Link href="/auth/sign-up">Sign Up</Link>
      {/* Renders:
          EN: /auth/sign-up
          NL: /auth/aanmelden
          FR: /auth/inscription
          DE: /auth/registrieren
      */}
    </div>
  );
}

// ============================================
// Example 7: Server-Side Redirect
// ============================================
import { redirect } from "@/config/routing";

export default async function ProtectedPage() {
  const session = await getSession();

  if (!session) {
    // Redirect with automatic localization
    redirect("/auth/sign-in");
  }

  return <div>Protected content</div>;
}

// ============================================
// Example 8: Complex Navigation with Search Params
// ============================================
export function FilteredDatasets() {
  const router = useRouter();

  const applyFilters = (filters: Record<string, string>) => {
    const searchParams = new URLSearchParams(filters);

    router.push({
      pathname: "/datasets",
      // @ts-ignore - search params support
      query: Object.fromEntries(searchParams),
    });
  };

  return (
    <button onClick={() => applyFilters({ status: "active" })}>
      Apply Filters
    </button>
  );
}

// ============================================
// Example 9: Language Switcher
// ============================================
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div>
      {/* Current locale: {locale} */}
      {/* To switch languages, use <Link> with locale prop */}
      <Link href={pathname} locale="nl">
        Nederlands
      </Link>
      <Link href={pathname} locale="fr">
        Français
      </Link>
      <Link href={pathname} locale="de">
        Deutsch
      </Link>
    </div>
  );
}

// ============================================
// Testing URLs
// ============================================
/*
Test these URLs in your browser:

English (default - no prefix):
- http://localhost:3050/datasets
- http://localhost:3050/tasks
- http://localhost:3050/datasets/123
- http://localhost:3050/benchmarks/tasks-suites
- http://localhost:3050/auth/sign-in

Dutch (nl prefix):
- http://localhost:3050/nl/datasets
- http://localhost:3050/nl/taken
- http://localhost:3050/nl/datasets/123
- http://localhost:3050/nl/benchmarks/taak-suites
- http://localhost:3050/nl/auth/inloggen

French (fr prefix + localized URLs):
- http://localhost:3050/fr/ensembles-de-donnees
- http://localhost:3050/fr/taches
- http://localhost:3050/fr/ensembles-de-donnees/123
- http://localhost:3050/fr/benchmarks/suites-de-taches
- http://localhost:3050/fr/auth/connexion

German (de prefix + localized URLs):
- http://localhost:3050/de/datensatze
- http://localhost:3050/de/aufgaben
- http://localhost:3050/de/datensatze/123
- http://localhost:3050/de/benchmarks/aufgaben-suiten
- http://localhost:3050/de/auth/anmelden
*/
