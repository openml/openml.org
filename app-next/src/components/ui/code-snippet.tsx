import React from "react";

interface CodeSnippetProps {
  code: string;
  language?: string;
  className?: string;
}

/**
 * CodeSnippet component for displaying formatted code blocks
 */
export function CodeSnippet({
  code,
  language = "python",
  className = "",
}: CodeSnippetProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-slate-950 ${className}`}
    >
      {/* Language badge */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2">
        <span className="text-xs font-medium text-slate-400 uppercase">
          {language}
        </span>
      </div>

      {/* Code content */}
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-sm leading-relaxed text-slate-100">
          {code}
        </code>
      </pre>
    </div>
  );
}
