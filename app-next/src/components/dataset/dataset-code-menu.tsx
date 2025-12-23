"use client";

import * as React from "react";
import { useState } from "react";
import {
  Code2,
  Download,
  Check,
  Copy,
  ChevronDown,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface DatasetCodeMenuProps {
  datasetId: number;
  datasetName: string;
  datasetUrl: string;
  className?: string;
}

type Language = "python" | "r" | "julia" | "curl";

interface CodeSnippet {
  language: Language;
  label: string;
  icon: React.ReactNode;
  code: string;
}

/**
 * DatasetCodeMenu - Kaggle-style dropdown for downloading data and code snippets
 *
 * Provides multiple options:
 * - Download raw dataset
 * - Copy code snippets for Python (openml, scikit-learn), R, Julia, cURL
 */
export function DatasetCodeMenu({
  datasetId,
  datasetName,
  datasetUrl,
  className,
}: DatasetCodeMenuProps) {
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  // Code snippets for different languages/methods
  const codeSnippets: CodeSnippet[] = [
    {
      language: "python",
      label: "Python (OpenML)",
      icon: <PythonIcon className="h-4 w-4" />,
      code: `import openml

# Load dataset by ID
dataset = openml.datasets.get_dataset(${datasetId})

# Get data as pandas DataFrame
X, y, categorical_indicator, attribute_names = dataset.get_data(
    target=dataset.default_target_attribute,
    dataset_format="dataframe"
)

print(f"Dataset: {dataset.name}")
print(f"Shape: {X.shape}")
print(X.head())`,
    },
    {
      language: "python",
      label: "Python (scikit-learn)",
      icon: <PythonIcon className="h-4 w-4" />,
      code: `from sklearn.datasets import fetch_openml

# Fetch dataset from OpenML
dataset = fetch_openml(data_id=${datasetId}, as_frame=True, parser="auto")

X = dataset.data
y = dataset.target

print(f"Dataset: ${datasetName}")
print(f"Shape: {X.shape}")
print(X.head())`,
    },
    {
      language: "r",
      label: "R",
      icon: <RIcon className="h-4 w-4" />,
      code: `library(OpenML)

# Set API key (optional for public datasets)
# setOMLConfig(apikey = "YOUR_API_KEY")

# Load dataset by ID
dataset <- getOMLDataSet(data.id = ${datasetId})

# Access the data
data <- dataset$data
print(head(data))
print(dim(data))`,
    },
    {
      language: "julia",
      label: "Julia",
      icon: <JuliaIcon className="h-4 w-4" />,
      code: `using OpenML

# Load dataset by ID
dataset = OpenML.load(${datasetId})

# Convert to DataFrame
using DataFrames
df = DataFrame(dataset)

println("Dataset: ${datasetName}")
println("Shape: ", size(df))
first(df, 5)`,
    },
    {
      language: "curl",
      label: "cURL / API",
      icon: <Terminal className="h-4 w-4" />,
      code: `# Get dataset metadata
curl "https://www.openml.org/api/v1/json/data/${datasetId}"

# Download dataset file (ARFF format)
curl -O "${datasetUrl}"

# Get dataset features
curl "https://www.openml.org/api/v1/json/data/features/${datasetId}"

# Get dataset qualities
curl "https://www.openml.org/api/v1/json/data/qualities/${datasetId}"`,
    },
  ];

  const copyToClipboard = async (code: string, tabId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedTab(tabId);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="lg"
            className={cn("gap-2", className)}
          >
            <Download className="h-4 w-4" />
            Download
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Download Options</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <a href={datasetUrl} download className="cursor-pointer">
                <Download className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>Download Dataset</span>
                  <span className="text-muted-foreground text-xs">
                    Original ARFF/CSV file
                  </span>
                </div>
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Code Snippets</DropdownMenuLabel>

          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setCodeDialogOpen(true)}
              className="cursor-pointer"
            >
              <Code2 className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>Show Code</span>
                <span className="text-muted-foreground text-xs">
                  Python, R, Julia, cURL
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Quick copy options */}
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() =>
                copyToClipboard(
                  `import openml\ndataset = openml.datasets.get_dataset(${datasetId})`,
                  "quick-python",
                )
              }
              className="cursor-pointer"
            >
              <PythonIcon className="mr-2 h-4 w-4" />
              <span className="flex-1">Quick Copy (Python)</span>
              {copiedTab === "quick-python" ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 opacity-50" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                copyToClipboard(
                  `library(OpenML)\ndataset <- getOMLDataSet(data.id = ${datasetId})`,
                  "quick-r",
                )
              }
              className="cursor-pointer"
            >
              <RIcon className="mr-2 h-4 w-4" />
              <span className="flex-1">Quick Copy (R)</span>
              {copiedTab === "quick-r" ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 opacity-50" />
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Code Snippets Dialog */}
      <Dialog open={codeDialogOpen} onOpenChange={setCodeDialogOpen}>
        <DialogContent className="max-h-[80vh] max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Load Dataset: {datasetName}
            </DialogTitle>
            <DialogDescription>
              Use these code snippets to load this dataset in your preferred
              programming language
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="python-openml" className="mt-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="python-openml">
                <PythonIcon className="mr-1.5 h-4 w-4" />
                OpenML
              </TabsTrigger>
              <TabsTrigger value="python-sklearn">
                <PythonIcon className="mr-1.5 h-4 w-4" />
                sklearn
              </TabsTrigger>
              <TabsTrigger value="r">
                <RIcon className="mr-1.5 h-4 w-4" />R
              </TabsTrigger>
              <TabsTrigger value="julia">
                <JuliaIcon className="mr-1.5 h-4 w-4" />
                Julia
              </TabsTrigger>
              <TabsTrigger value="curl">
                <Terminal className="mr-1.5 h-4 w-4" />
                API
              </TabsTrigger>
            </TabsList>

            {codeSnippets.map((snippet, index) => {
              const tabValue =
                index === 0
                  ? "python-openml"
                  : index === 1
                    ? "python-sklearn"
                    : snippet.language;
              return (
                <TabsContent key={tabValue} value={tabValue} className="mt-4">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => copyToClipboard(snippet.code, tabValue)}
                    >
                      {copiedTab === tabValue ? (
                        <>
                          <Check className="mr-1.5 h-4 w-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1.5 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <pre className="bg-muted/50 overflow-x-auto rounded-lg p-4 text-sm">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>

                  {/* Installation hint */}
                  <div className="mt-3 rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950/30">
                    <p className="font-medium text-blue-700 dark:text-blue-300">
                      📦 Installation
                    </p>
                    <code className="text-xs text-blue-600 dark:text-blue-400">
                      {snippet.language === "python" && "pip install openml"}
                      {snippet.language === "r" && 'install.packages("OpenML")'}
                      {snippet.language === "julia" &&
                        'using Pkg; Pkg.add("OpenML")'}
                      {snippet.language === "curl" &&
                        "No installation required - uses REST API"}
                    </code>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Language icons
function PythonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0C5.373 0 5.997 2.825 5.997 2.825l.007 2.925h6.12v.875H3.87S0 6.05 0 12.125s3.372 5.875 3.372 5.875h2.01v-2.825s-.108-3.372 3.316-3.372h5.705s3.21.052 3.21-3.103V3.603S18.197 0 12 0zm-2.77 2.135a1.106 1.106 0 11-.001 2.213 1.106 1.106 0 01.001-2.213z" />
      <path d="M12 24c6.627 0 6.003-2.825 6.003-2.825l-.007-2.925h-6.12v-.875h8.254S24 17.95 24 11.875s-3.372-5.875-3.372-5.875h-2.01v2.825s.108 3.372-3.316 3.372H9.597s-3.21-.052-3.21 3.103v5.097S5.803 24 12 24zm2.77-2.135a1.106 1.106 0 110-2.213 1.106 1.106 0 010 2.213z" />
    </svg>
  );
}

function RIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 14.5h-2v-9h4c2.21 0 4 1.79 4 4 0 1.86-1.28 3.41-3 3.86l3 5.14h-2.28l-2.78-4.75h-.94v4.75zm0-6.75h2c1.1 0 2-.9 2-2s-.9-2-2-2h-2v4z" />
    </svg>
  );
}

function JuliaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="7.5" cy="7.5" r="4" fill="#CB3C33" />
      <circle cx="16.5" cy="7.5" r="4" fill="#389826" />
      <circle cx="12" cy="16" r="4" fill="#9558B2" />
    </svg>
  );
}
