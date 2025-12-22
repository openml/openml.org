"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface APICodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function APICodeBlock({
  code,
  language = "bash",
  filename,
  showLineNumbers = false,
  className,
}: APICodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-slate-950 dark:bg-slate-900",
        className,
      )}
    >
      {/* Header */}
      {(filename || language) && (
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 py-2">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-400">
              {filename || language}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Code */}
      <div className="overflow-x-auto p-4">
        <pre className="text-sm leading-relaxed">
          <code className="font-mono text-slate-100">
            {showLineNumbers ? (
              <div className="flex">
                <div className="mr-4 text-right text-slate-600 select-none">
                  {lines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <div>
                  {lines.map((line, i) => (
                    <div key={i}>{line || " "}</div>
                  ))}
                </div>
              </div>
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
