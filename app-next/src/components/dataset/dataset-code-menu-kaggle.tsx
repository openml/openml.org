"use client";

import * as React from "react";
import { useState } from "react";
import {
  Code2,
  Check,
  Copy,
  ChevronDown,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DatasetCodeMenuKaggleProps {
  datasetId: number;
  datasetName: string;
  className?: string;
}

type LoadMethod =
  | "python-openml"
  | "python-sklearn"
  | "r"
  | "julia"
  | "mlcroissant";

interface CodeSnippet {
  id: LoadMethod;
  label: string;
  sublabel: string;
  code: string;
  installCommand: string;
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

/**
 * DatasetCodeMenuKaggle - Kaggle-style Code dropdown with language selector
 */
export function DatasetCodeMenuKaggle({
  datasetId,
  datasetName,
  className,
}: DatasetCodeMenuKaggleProps) {
  const [selectedMethod, setSelectedMethod] =
    useState<LoadMethod>("python-openml");
  const [copied, setCopied] = useState(false);

  const codeSnippets: CodeSnippet[] = [
    {
      id: "python-openml",
      label: "openml",
      sublabel: "pandas DataFrame",
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
      installCommand: "pip install openml",
    },
    {
      id: "python-sklearn",
      label: "scikit-learn",
      sublabel: "pandas DataFrame",
      code: `from sklearn.datasets import fetch_openml

# Fetch dataset from OpenML
dataset = fetch_openml(data_id=${datasetId}, as_frame=True, parser="auto")

X = dataset.data
y = dataset.target

print(f"Dataset: ${datasetName}")
print(f"Shape: {X.shape}")
print(X.head())`,
      installCommand: "pip install scikit-learn",
    },
    {
      id: "r",
      label: "R",
      sublabel: "data.frame",
      code: `library(OpenML)

# Set API key (optional for public datasets)
# setOMLConfig(apikey = "YOUR_API_KEY")

# Load dataset by ID
dataset <- getOMLDataSet(data.id = ${datasetId})

# Access the data
data <- dataset$data
print(head(data))
print(dim(data))`,
      installCommand: 'install.packages("OpenML")',
    },
    {
      id: "julia",
      label: "Julia",
      sublabel: "DataFrame",
      code: `using OpenML

# Load dataset by ID
dataset = OpenML.load(${datasetId})

# Convert to DataFrame
using DataFrames
df = DataFrame(dataset)

println("Dataset: ${datasetName}")
println("Shape: ", size(df))
first(df, 5)`,
      installCommand: 'using Pkg; Pkg.add("OpenML")',
    },
    {
      id: "mlcroissant",
      label: "mlcroissant",
      sublabel: "Croissant format",
      code: `import mlcroissant as mlc

# Load dataset using Croissant metadata
croissant_dataset = mlc.Dataset(
    'https://www.openml.org/croissant/dataset/${datasetId}'
)

# Check what record sets are in the dataset
record_sets = croissant_dataset.metadata.record_sets
print(record_sets)

# Fetch the records and put them in a DataFrame
import pandas as pd
record_set_df = pd.DataFrame(croissant_dataset.records(
    record_set=record_sets[0].uuid
))
record_set_df.head()`,
      installCommand: "pip install mlcroissant",
    },
  ];

  const currentSnippet = codeSnippets.find((s) => s.id === selectedMethod)!;

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getIcon = (id: LoadMethod) => {
    switch (id) {
      case "python-openml":
      case "python-sklearn":
      case "mlcroissant":
        return <PythonIcon className="h-4 w-4" />;
      case "r":
        return <RIcon className="h-4 w-4" />;
      case "julia":
        return <JuliaIcon className="h-4 w-4" />;
      default:
        return <Terminal className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("gap-2", className)}>
          <Code2 className="h-4 w-4" />
          Code
          <ChevronDown className="h-4 w-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-96">
        <div className="p-3">
          <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Load via
          </Label>
          <Select
            value={selectedMethod}
            onValueChange={(v) => setSelectedMethod(v as LoadMethod)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {codeSnippets.map((snippet) => (
                <SelectItem key={snippet.id} value={snippet.id}>
                  <div className="flex items-center gap-2">
                    {getIcon(snippet.id)}
                    <span>
                      {snippet.label} -{" "}
                      <span className="font-semibold">{snippet.sublabel}</span>
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DropdownMenuSeparator />

        {/* Code Preview */}
        <div className="p-3">
          <div className="bg-muted/50 relative max-h-64 overflow-auto rounded-lg">
            <pre className="p-3 text-xs">
              <code className="text-foreground/80">{currentSnippet.code}</code>
            </pre>
          </div>

          {/* Installation hint */}
          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
            <span>📦</span>
            <code className="bg-muted rounded px-1.5 py-0.5">
              {currentSnippet.installCommand}
            </code>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Action buttons */}
        <div className="flex gap-2 p-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => copyToClipboard(currentSnippet.code)}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Code
              </>
            )}
          </Button>
        </div>

        <DropdownMenuSeparator />

        {/* Create notebook link */}
        <div className="p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            asChild
          >
            <a
              href={`https://colab.research.google.com/github/openml/openml-colab/blob/main/notebooks/openml_dataset_template.ipynb?datasetId=${datasetId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Create a notebook
            </a>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
