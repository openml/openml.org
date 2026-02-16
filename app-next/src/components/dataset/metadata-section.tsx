"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  Quote,
  Scroll,
  Scale,
  Calendar,
  ExternalLink,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { cn } from "@/lib/utils";
import type { Dataset } from "@/types/dataset";

interface MetadataSectionProps {
  dataset: Dataset;
}

interface MetadataItemProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  forceOpen?: boolean | null; // null = use local state, true = force open, false = force closed
  onIndividualToggle?: () => void; // Called when user clicks individual item
  children: React.ReactNode;
}

/**
 * MetadataSection Component (kggl-style)
 *
 * Expandable metadata sections similar to kggl's layout.
 * Includes: Authors, DOI/Citation, Provenance, License, Tags
 */
export function MetadataSection({ dataset }: MetadataSectionProps) {
  // null = use individual item states, true = all expanded, false = all collapsed
  const [globalState, setGlobalState] = useState<boolean | null>(null);

  const toggleGlobal = () => {
    if (globalState === true) {
      // Currently all expanded -> collapse all
      setGlobalState(false);
    } else {
      // Currently collapsed or mixed -> expand all
      setGlobalState(true);
    }
  };

  // Extract relevant metadata
  const creator = dataset.creator; // string or undefined
  const licence = dataset.licence;
  const defaultTargetAttribute = dataset.default_target_attribute;
  const collectionDate = dataset.collection_date;
  const paperUrl = dataset.paper_url;
  const originalDataUrl = dataset.original_data_url;
  const citation = dataset.citation;
  const tags = dataset.tags || [];

  // Only show if there's meaningful metadata
  const hasMetadata =
    creator ||
    licence ||
    paperUrl ||
    originalDataUrl ||
    citation ||
    tags.length > 0;

  if (!hasMetadata) {
    return null;
  }

  return (
    <CollapsibleSection
      id="metadata"
      title="Metadata"
      description="Authors, license, citation, and tags"
      icon={<Scroll className="h-4 w-4 text-gray-500" />}
      defaultOpen={true}
      headerExtra={
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            toggleGlobal();
          }}
        >
          {globalState === true ? "Collapse All" : "Expand All"}
        </Button>
      }
    >
      <div className="space-y-0 divide-y p-4">
        {/* Authors/Creators */}
        {creator && (
          <MetadataItem
            title="Authors"
            icon={<User className="h-4 w-4" />}
            defaultOpen={true}
            forceOpen={globalState}
            onIndividualToggle={() => setGlobalState(null)}
          >
            <Badge variant="secondary" className="text-xs">
              {creator}
            </Badge>
          </MetadataItem>
        )}

        {/* Target Attribute */}
        {defaultTargetAttribute && (
          <MetadataItem
            title="Default Target"
            icon={<MapPin className="h-4 w-4" />}
            forceOpen={globalState}
            onIndividualToggle={() => setGlobalState(null)}
          >
            <code className="bg-muted rounded px-2 py-1 text-sm">
              {defaultTargetAttribute}
            </code>
          </MetadataItem>
        )}

        {/* Citation */}
        {citation && (
          <MetadataItem
            title="Citation"
            icon={<Quote className="h-4 w-4" />}
            defaultOpen={true}
            forceOpen={globalState}
            onIndividualToggle={() => setGlobalState(null)}
          >
            <p className="text-muted-foreground text-sm italic">{citation}</p>
          </MetadataItem>
        )}

        {/* DOI / Paper URL */}
        {paperUrl && (
          <MetadataItem
            title="Paper"
            icon={<Quote className="h-4 w-4" />}
            forceOpen={globalState}
            onIndividualToggle={() => setGlobalState(null)}
          >
            <Link
              href={paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary flex items-center gap-1 text-sm hover:underline"
            >
              {paperUrl.length > 60 ? paperUrl.slice(0, 60) + "..." : paperUrl}
              <ExternalLink className="h-3 w-3" />
            </Link>
          </MetadataItem>
        )}

        {/* Provenance / Original Data */}
        {originalDataUrl && (
          <MetadataItem
            title="Provenance"
            icon={<Scroll className="h-4 w-4" />}
            forceOpen={globalState}
            onIndividualToggle={() => setGlobalState(null)}
          >
            <div className="text-sm">
              <span className="text-muted-foreground">Original source: </span>
              <Link
                href={originalDataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center gap-1 hover:underline"
              >
                {originalDataUrl.length > 50
                  ? originalDataUrl.slice(0, 50) + "..."
                  : originalDataUrl}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </MetadataItem>
        )}

        {/* License */}
        {licence && (
          <MetadataItem
            title="License"
            icon={<Scale className="h-4 w-4" />}
            defaultOpen={true}
            forceOpen={globalState}
            onIndividualToggle={() => setGlobalState(null)}
          >
            <Badge variant="outline" className="text-xs">
              {licence}
            </Badge>
          </MetadataItem>
        )}

        {/* Collection Date */}
        {collectionDate && (
          <MetadataItem
            title="Collection Date"
            icon={<Calendar className="h-4 w-4" />}
            forceOpen={globalState}
            onIndividualToggle={() => setGlobalState(null)}
          >
            <span className="text-sm">{collectionDate}</span>
          </MetadataItem>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <MetadataItem
            title="Tags"
            icon={<Tag className="h-4 w-4" />}
            defaultOpen={true}
            forceOpen={globalState}
            onIndividualToggle={() => setGlobalState(null)}
          >
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <Link
                  key={idx}
                  href={`/search?type=data&tags.tag=${encodeURIComponent(tag.tag)}`}
                  className="bg-muted hover:bg-muted/80 rounded-full px-2 py-1 text-xs transition-colors"
                >
                  {tag.tag}
                </Link>
              ))}
            </div>
          </MetadataItem>
        )}
      </div>
    </CollapsibleSection>
  );
}

// Collapsible Metadata Item
function MetadataItem({
  title,
  icon,
  defaultOpen = false,
  forceOpen,
  onIndividualToggle,
  children,
}: MetadataItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // forceOpen: null = use local state, true = force open, false = force closed
  const effectiveOpen = forceOpen !== null ? forceOpen : isOpen;

  const handleClick = () => {
    // Toggle based on current effective state
    const newState = !effectiveOpen;
    setIsOpen(newState);
    // Notify parent to reset global state so individual control works
    if (onIndividualToggle) {
      onIndividualToggle();
    }
  };

  return (
    <div className="py-3">
      <button
        onClick={handleClick}
        className="flex w-full items-center justify-between text-left transition-opacity hover:opacity-80"
      >
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <span className="text-sm font-medium">{title}</span>
        </div>
        {effectiveOpen ? (
          <ChevronUp className="text-muted-foreground h-4 w-4" />
        ) : (
          <ChevronDown className="text-muted-foreground h-4 w-4" />
        )}
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          effectiveOpen
            ? "mt-3 max-h-96 pl-6 opacity-100"
            : "max-h-0 opacity-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}
