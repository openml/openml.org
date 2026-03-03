"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface CitationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor?: string;
  paperUrl: string;
  bibtex: string;
}

export function CitationCard({
  title,
  description,
  icon,
  iconColor = "text-primary",
  paperUrl,
  bibtex,
}: CitationCardProps) {
  const [copied, setCopied] = useState(false);
  const [showBibtex, setShowBibtex] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg",
              iconColor,
            )}
          >
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <a href={paperUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Read Paper
            </Button>
          </a>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy BibTeX
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBibtex(!showBibtex)}
          >
            {showBibtex ? "Hide" : "Show"} BibTeX
          </Button>
        </div>
        {showBibtex && (
          <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
            <code>{bibtex}</code>
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
