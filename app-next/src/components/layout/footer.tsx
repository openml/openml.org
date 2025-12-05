import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Mail, X } from "lucide-react";

/**
 * Footer Component - Unified openml.org + docs.openml.org
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="gradient mt-a relative overflow-hidden border-t border-slate-800 bg-slate-950 p-4">
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-indigo-950/10 to-purple-950/20" />

      <div className="relative container mx-auto max-w-7xl p-16 px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand Section - Takes 2 columns on all breakpoints */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <Link href="/" className="-mt-6 mb-4 inline-block">
              <Image
                src="/logo_openML_dark-bkg.png"
                alt="OpenML"
                width={160}
                height={53}
                className="h-auto w-40"
                priority
              />
            </Link>
            <p className="-mt-3 text-sm leading-relaxed text-slate-400">
              Building a seamless, open ecosystem of machine learning data,
              models, and benchmarks—advancing AI openly for the benefit of
              humanity.{" "}
              <span className="text-acforeground font-semibold">
                Simple. Accessible. Collaborative.
              </span>
            </p>

            {/* Community & Contact - Visible only on lg+ screens, part of Brand Section */}
            <div className="hidden lg:block lg:max-w-[50%]">
              <h4 className="mt-6 mb-4 text-sm font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-100">
                Get Involved
              </h4>
              <div className="space-y-3">
                {/* Social Links */}
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
                    aria-label="Slack"
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
                  Join workshops and study groups
                </p>
              </div>
            </div>
          </div>

          {/* Community & Contact - Separate column, visible only on md and smaller screens */}
          <div className="lg:hidden">
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-100">
              Get Involved
            </h4>
            <div className="space-y-3">
              {/* Social Links */}
              <div className="flex w-[75%] items-center justify-between gap-2">
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
                  aria-label="Slack"
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
                Join workshops and study groups
              </p>
            </div>
          </div>

          {/* Platform */}
          <div className="col-span-1">
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/datasets"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">Datasets</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">Tasks</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/flows"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">Flows</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/runs"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">Runs</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/benchmarks"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">Benchmarks</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Documentation */}
          <div className="col-span-1">
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Documentation
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/docs"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">Getting Started</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/concepts"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">Concepts</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/apis"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">APIs & SDKs</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/python"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">Python</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/r"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">R</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/java"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">Java</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="col-span-1">
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Community
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contributing"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">Contributing</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">Team</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/publications"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">Publications</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">Blog</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="animated-underline">Contact</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-slate-800 pt-3 pb-0">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row">
            <p className="text-center md:text-left">
              © {currentYear} OpenML. Licensed under{" "}
              <a
                href="https://opensource.org/license/bsd-3-clause/"
                target="_blank"
                rel="noopener noreferrer"
                className="animated-underline text-slate-300 transition-colors hover:text-white"
              >
                BSD 3-Clause
              </a>
            </p>

            <div className="flex gap-6 text-xs">
              <Link
                href="/privacy"
                className="animated-underline transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="animated-underline transition-colors hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                href="/imprint"
                className="animated-underline transition-colors hover:text-white"
              >
                Imprint
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute -top-8 -left-12 h-78 w-78 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="absolute -right-46 -bottom-46 h-120 w-120 rounded-full bg-indigo-900/10 blur-3xl" />
    </footer>
  );
}
