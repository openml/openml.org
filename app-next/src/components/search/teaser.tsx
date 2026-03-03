/**
 * Teaser component for cleaning and parsing dataset descriptions
 * Filters out markdown formatting and extracts metadata fields
 * Based on the old app's Teaser.js component
 */

interface TeaserData {
  cleanDescription: string;
  author?: string;
  source?: string;
  citation?: string;
  rawMetadata: Record<string, string>;
}

/**
 * Parse description and extract metadata
 * @param description - Raw description string
 * @param limit - Optional line limit for the clean description
 * @returns Parsed teaser data with clean description and metadata fields
 */
export function parseDescription(
  description: string | undefined,
  limit?: number,
): TeaserData {
  if (!description) {
    return {
      cleanDescription: "No description available",
      rawMetadata: {},
    };
  }

  // Regular expression to match numbered list items
  const listRegex = /^(\d+\.\s+|\-\s+)/;
  const metadataRegex = /^\*\*([^*]+)\*\*:\s*(.+)$/; // Matches **Label**: value
  const plainMetadataRegex = /^([A-Za-z\s]+):\s*(.+)$/; // Matches Label: value

  const metadata: Record<string, string> = {};
  const cleanLines: string[] = [];

  // Process each line
  const lines = description.split("\n").map((line) => line.trim());

  for (const line of lines) {
    if (!line) continue;

    // Check for markdown metadata (**Label**: value)
    const mdMatch = line.match(metadataRegex);
    if (mdMatch) {
      const [, key, value] = mdMatch;
      metadata[key.toLowerCase()] = value.trim();
      continue;
    }

    // Check for plain metadata (Label: value)
    const plainMatch = line.match(plainMetadataRegex);
    if (plainMatch && plainMatch[1].length < 30) {
      // Limit key length to avoid false positives
      const [, key, value] = plainMatch;
      const lowerKey = key.toLowerCase().trim();
      // Only treat as metadata if it's a known pattern
      if (
        lowerKey === "author" ||
        lowerKey === "source" ||
        lowerKey === "please cite" ||
        lowerKey === "citation"
      ) {
        metadata[lowerKey] = value.trim();
        continue;
      }
    }

    // Filter out markdown formatting (headers, lists, code blocks)
    if (
      !line.startsWith("#") && // Remove headers
      !line.startsWith("*") && // Remove bold/italic and bullet lists
      !listRegex.test(line) && // Remove numbered lists
      !line.startsWith("```") && // Remove code blocks
      !line.startsWith("    ") // Remove indented code
    ) {
      cleanLines.push(line);
    }
  }

  // Apply line limit if specified
  const limitedLines = limit ? cleanLines.slice(0, limit) : cleanLines;
  const cleanDescription =
    limitedLines.join("\n").trim() || "No description available";

  return {
    cleanDescription,
    author: metadata.author,
    source: metadata.source,
    citation: metadata["please cite"] || metadata.citation,
    rawMetadata: metadata,
  };
}

/**
 * Hook to use teaser data in components
 */
export function useTeaser(description: string | undefined, limit?: number) {
  return parseDescription(description, limit);
}

/**
 * Simple Teaser component that just returns the clean description
 */
interface TeaserProps {
  description: string | undefined;
  limit?: number;
  className?: string;
}

export function Teaser({ description, limit, className }: TeaserProps) {
  const { cleanDescription } = parseDescription(description, limit);
  return <p className={className}>{cleanDescription}</p>;
}
