"use client";

import React, { useState } from "react";
import { Copy } from "lucide-react";
import {
  PythonIcon,
  RCodeIcon,
  JavaCodeIcon,
  CSharpIcon,
  JuliaCodeIcon,
  JupyterIcon,
  TensorFlowIcon,
  MlrIcon,
  RubyIcon,
} from "@/components/code-language-svg/logo-svg";

export interface CodeExample {
  language: string;
  iconName:
    | "python"
    | "r"
    | "java"
    | "csharp"
    | "julia"
    | "jupyter"
    | "tensorflow"
    | "mlr"
    | "ruby";
  code: string;
}

interface InteractiveCodeSnippetProps {
  examples: CodeExample[];
  githubUrl?: string;
  downloadUrl?: string;
  className?: string;
}

// Icon mapping
const iconMap = {
  python: PythonIcon,
  r: RCodeIcon,
  java: JavaCodeIcon,
  csharp: CSharpIcon,
  julia: JuliaCodeIcon,
  jupyter: JupyterIcon,
  tensorflow: TensorFlowIcon,
  mlr: MlrIcon,
  ruby: RubyIcon,
};

export function InteractiveCodeSnippet({
  examples,
  githubUrl,
  downloadUrl,
  className = "",
}: InteractiveCodeSnippetProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    examples[0]?.language || "",
  );
  const [copied, setCopied] = useState(false);

  const currentExample =
    examples.find((ex) => ex.language === selectedLanguage) || examples[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentExample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Split code into lines for line numbers
  const codeLines = currentExample.code.split("\n");

  return (
    <div className={className}>
      {/* Language Selector - buttons */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        {examples.map((example) => {
          const IconComponent = iconMap[example.iconName];
          const isSelected = selectedLanguage === example.language;

          return (
            <button
              key={example.language}
              onClick={() => setSelectedLanguage(example.language)}
              className="group flex flex-col items-center justify-center gap-1 bg-transparent transition-all"
              title={example.language}
            >
              {/* Icon */}
              <IconComponent
                className={`h-8 w-8 transition-colors ${
                  isSelected
                    ? "text-slate-800 group-hover:text-slate-500 dark:text-slate-400 dark:group-hover:text-slate-100"
                    : "text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-100"
                }`}
              />

              {/* Language name */}
              <span
                className={`flex items-center justify-center text-xs font-medium transition-colors ${
                  isSelected
                    ? "border-b-3 border-slate-900 pt-0.5 text-slate-900 dark:border-slate-200 dark:text-slate-100"
                    : "border-b-3 border-transparent pt-0.5 text-slate-400 group-hover:border-slate-400 group-hover:text-slate-700 dark:group-hover:border-slate-600 dark:group-hover:text-slate-100"
                }`}
              >
                {example.language}
              </span>
            </button>
          );
        })}
      </div>

      {/* Code Container */}
      <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        {/* Header with language badge and copy button */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 py-2">
          <div className="flex items-center gap-2">
            {(() => {
              const IconComponent = iconMap[currentExample.iconName];
              return <IconComponent className="h-4 w-4 text-slate-400" />;
            })()}
            <span className="text-xs font-medium text-slate-400">
              {currentExample.language}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            title="Copy code"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied!" : ""}
          </button>
        </div>

        {/* Code Content with line numbers */}
        <div className="overflow-x-auto">
          <div className="flex min-w-full">
            {/* Line numbers */}
            <div className="bg-slate-0/70 border-r border-slate-800 pt-6 pr-2 pl-4 text-right leading-relaxed text-slate-400 select-none dark:text-slate-400">
              {codeLines.map((_, index) => (
                <div
                  key={index}
                  className="pt-[0.08rem] font-mono text-sm leading-relaxed text-slate-400 dark:text-slate-400"
                >
                  {index + 1}
                </div>
              ))}
            </div>

            {/* Code */}
            <pre className="flex-1 p-6">
              <code className="font-mono text-sm leading-relaxed text-white">
                {currentExample.code}
              </code>
            </pre>
          </div>
        </div>

        {/* Footer Links */}
        {(githubUrl || downloadUrl) && (
          <div className="flex items-center gap-6 border-t border-slate-800 bg-slate-900/50 px-6 py-3">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-100"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            )}
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-100"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download ZIP
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
