import Link from "next/link";

/**
 * Footer Component - Server Component
 * Site footer with links and copyright information
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">OpenML</h3>
            <p className="text-muted-foreground text-sm">
              Open platform for sharing datasets, algorithms, and experiments.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/datasets"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Datasets
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tasks
                </Link>
              </li>
              <li>
                <Link
                  href="/flows"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Flows
                </Link>
              </li>
              <li>
                <Link
                  href="/runs"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Runs
                </Link>
              </li>
            </ul>
          </div>

          {/* Documentation */}
          <div>
            <h3 className="mb-4 font-semibold">Documentation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://docs.openml.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Getting Started
                </a>
              </li>
              <li>
                <a
                  href="https://docs.openml.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  API Docs
                </a>
              </li>
              <li>
                <Link
                  href="/contribute"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contribute
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-4 font-semibold">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/openml/openml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/open_ml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
          <p>
            © {currentYear} OpenML. Licensed under{" "}
            <a
              href="https://opensource.org/license/bsd-3-clause/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline"
            >
              BSD 3-Clause
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
