"use client";
import Link from "next/link";
import {
  Github,
  Mail,
  X,
  Slack,
  // Users,
  // BookOpen,
  // Globe,
  // Code,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";

export function OpenMLFooter() {
  return (
    <footer className="gradient relative overflow-hidden border-t border-slate-800 bg-slate-950">
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-purple-950/20" />

      <div className="relative container mx-auto max-w-7xl px-4 py-16 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/logo_openML_dark-bkg.png"
                alt="OpenML"
                width={160}
                height={53}
                className="h-auto w-40"
                priority
              />
            </Link>

            <p className="text-sm leading-relaxed text-slate-400">
              Building a seamless, open ecosystem of machine learning data,
              models, and benchmarks—advancing AI openly for the benefit of
              humanity.{" "}
              <span className="text-acforeground font-semibold">
                Simple. Accessible. Collaborative.
              </span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-100">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  href="/datasets"
                  className="transition-colors hover:text-slate-100"
                >
                  Datasets
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className="transition-colors hover:text-slate-100"
                >
                  Tasks
                </Link>
              </li>
              <li>
                <Link
                  href="/flows"
                  className="transition-colors hover:text-slate-100"
                >
                  Flows
                </Link>
              </li>
              <li>
                <Link
                  href="/runs"
                  className="transition-colors hover:text-slate-100"
                >
                  Runs
                </Link>
              </li>
              <li>
                <Link
                  href="/studies"
                  className="transition-colors hover:text-slate-100"
                >
                  Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-100">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  href="/docs"
                  className="transition-colors hover:text-slate-100"
                >
                  API Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="transition-colors hover:text-slate-100"
                >
                  Quickstarts
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/openml"
                  className="transition-colors hover:text-slate-100"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="/contribute"
                  className="transition-colors hover:text-slate-100"
                >
                  Contribute
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Contact */}
          <div className="lg:text-right">
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-100">
              Get Involved
            </h4>
            <div className="space-y-3">
              <div className="flex w-full items-center justify-between gap-2">
                <a
                  href="mailto:openmlhq@googlegroups.com"
                  target="_blank"
                  aria-label="Email"
                  className="block rounded-sm p-1 text-slate-400 transition-all duration-200 hover:scale-115 hover:bg-transparent"
                >
                  <Image
                    src="/icons/email.png"
                    alt="Email"
                    className="size-6 brightness-0 invert filter transition-all duration-200 hover:brightness-150 hover:filter"
                    width={24}
                    height={24}
                  />
                </a>
                <a
                  href="https://github.com/openml"
                  target="_blank"
                  aria-label="GitHub"
                  className="block rounded-sm p-1 text-slate-400 transition-all duration-200 hover:scale-115 hover:bg-transparent"
                >
                  <Image
                    src="/icons/github.png"
                    alt="GitHub"
                    className="size-6 brightness-0 invert filter transition-all duration-200 hover:brightness-150 hover:filter"
                    width={24}
                    height={24}
                  />
                </a>
                <a
                  href="https://join.slack.com/t/openml/shared_invite/enQtODg4NjgzNTE4NjU3LTYwZDFhNzQ5NmE0NjIyNmM3NDMyMjFkZDQ0YWZkYWYxMTIxODFmMDhhMTUzMGYzMmM4NjIzYTZlYjBkOGE5MTQ"
                  target="_blank"
                  aria-label="GitHub"
                  className="block rounded-sm p-1 text-slate-400 transition-all duration-200 hover:scale-115 hover:bg-transparent"
                >
                  <Image
                    src="/icons/slack.png"
                    alt="Slack"
                    className="size-6 brightness-0 invert filter transition-all duration-200 hover:brightness-150 hover:filter"
                    width={24}
                    height={24}
                  />
                </a>
                <a
                  href="https://docs.openml.org/help/#:~:text=X%20(formerly%20Twitter)-,Post%20something%20now,-Technical%20questions"
                  target="_blank"
                  aria-label="X"
                  className="block rounded-sm p-1 text-slate-400 transition-all duration-200 hover:scale-115 hover:bg-transparent"
                >
                  <Image
                    src="/icons/x.png"
                    alt="X"
                    className="size-6 brightness-0 invert filter transition-all duration-200 hover:brightness-150 hover:filter"
                    width={24}
                    height={24}
                  />
                </a>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-400">
                Join workshops and study groups[attached_file:1]
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-200/50 pt-8 dark:border-slate-400">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © 2025 OpenML. Open source under AGPL-3.0. Hosted on GitHub.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link
                href="/privacy"
                className="transition-colors hover:text-slate-100"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-slate-100"
              >
                Terms
              </Link>
              <Link
                href="/conduct"
                className="transition-colors hover:text-slate-100"
              >
                Code of Conduct
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface IconRowProps {
  icons: Array<{
    Icon: LucideIcon;
    label: string;
    description: string;
  }>;
}

const IconRow: React.FC<IconRowProps> = ({ icons }) => {
  return (
    <div className="mx-auto flex max-w-4xl items-center justify-center gap-8 px-4 py-16">
      {icons.map(({ Icon, label, description }, index) => (
        <div
          key={label}
          className="group flex flex-col items-center gap-3"
          role="img"
          aria-label={`${label}: ${description}`}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-100 p-5 shadow-lg transition-all duration-300 group-hover:shadow-xl hover:border-blue-200">
            <Icon
              className="h-12 w-12 text-blue-600 transition-colors duration-200 group-hover:text-blue-700"
              strokeWidth={2}
            />
          </div>
          <div className="max-w-xs text-center">
            <h3 className="text-lg leading-tight font-semibold text-gray-900">
              {label}
            </h3>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
