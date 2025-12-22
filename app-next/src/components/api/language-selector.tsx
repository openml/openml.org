"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { APICodeBlock } from "./api-code-block";
import {
  PythonIcon,
  RCodeIcon,
  JavaCodeIcon,
  JuliaCodeIcon,
} from "@/components/code-language-svg/logo-svg";
import { Globe } from "lucide-react";

export interface LanguageExample {
  language: string;
  icon: "python" | "r" | "java" | "julia" | "rest";
  installCommand?: string;
  code: string;
  description?: string;
}

interface LanguageSelectorProps {
  examples: LanguageExample[];
  title?: string;
  className?: string;
}

const iconMap = {
  python: PythonIcon,
  r: RCodeIcon,
  java: JavaCodeIcon,
  julia: JuliaCodeIcon,
  rest: Globe,
};

const languageLabels: Record<string, string> = {
  python: "Python",
  r: "R",
  java: "Java",
  julia: "Julia",
  rest: "REST API",
};

export function LanguageSelector({
  examples,
  title,
  className,
}: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    examples[0]?.language || "python",
  );

  const currentExample = examples.find(
    (ex) => ex.language === selectedLanguage,
  );

  return (
    <div className={cn("space-y-4", className)}>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}

      {/* Language Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        {examples.map((example) => {
          const IconComponent = iconMap[example.icon];
          const isSelected = selectedLanguage === example.language;

          return (
            <button
              key={example.language}
              onClick={() => setSelectedLanguage(example.language)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <IconComponent className="h-4 w-4" />
              <span>
                {languageLabels[example.language] || example.language}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {currentExample && (
        <div className="space-y-4">
          {currentExample.description && (
            <p className="text-muted-foreground text-sm">
              {currentExample.description}
            </p>
          )}

          {currentExample.installCommand && (
            <div>
              <p className="text-muted-foreground mb-2 text-sm font-medium">
                Installation
              </p>
              <APICodeBlock
                code={currentExample.installCommand}
                language="bash"
                filename="terminal"
              />
            </div>
          )}

          <div>
            <p className="text-muted-foreground mb-2 text-sm font-medium">
              Example
            </p>
            <APICodeBlock
              code={currentExample.code}
              language={currentExample.language}
              filename={`example.${currentExample.language === "python" ? "py" : currentExample.language === "r" ? "R" : currentExample.language === "java" ? "java" : currentExample.language === "julia" ? "jl" : "sh"}`}
              showLineNumbers
            />
          </div>
        </div>
      )}
    </div>
  );
}
