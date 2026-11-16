"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format as formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Loader2, UploadCloud, FileText, AlertCircle } from "lucide-react";

const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_EXTENSIONS = [
  ".arff",
  ".xrff",
  ".csv",
  ".json",
  ".parquet",
  ".feather",
];

export function DatasetUploadForm() {
  const { data: _session } = useSession();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // Additional Metadata
  const [creator, setCreator] = useState("");
  const [contributor, setContributor] = useState("");
  const [collectionDate, setCollectionDate] = useState<Date | undefined>();
  const [language, setLanguage] = useState("");
  const [licence, setLicence] = useState("Publicly available");
  const [defaultTargetAttribute, setDefaultTargetAttribute] = useState("");
  const [ignoreAttribute, setIgnoreAttribute] = useState("");
  const [citation, setCitation] = useState("");
  const [tags, setTags] = useState("");
  const [tagsError, setTagsError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const TAG_PATTERN = /^[a-zA-Z0-9_.-]+$/;

  const validateTags = (value: string): string | null => {
    if (!value.trim()) return null;
    const invalid = value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t && !TAG_PATTERN.test(t));
    return invalid.length > 0
      ? `Invalid tag(s): ${invalid.join(", ")} — only letters, numbers, underscores, hyphens, and dots are allowed.`
      : null;
  };

  const validateAndSetFile = (selected: File) => {
    setFileError(null);
    const ext = "." + (selected.name.split(".").pop()?.toLowerCase() ?? "");
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFileError(
        `Unsupported file type "${ext}". Please upload an ARFF file (.arff or .xrff).`,
      );
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setFileError(
        `File is too large (${(selected.size / 1024 / 1024).toFixed(1)} MB). Maximum file size is ${MAX_FILE_SIZE_MB} MB.`,
      );
      setFile(null);
      return;
    }
    setFile(selected);
    if (!name) {
      const fileName = selected.name;
      setName(fileName.substring(0, fileName.lastIndexOf(".")) || fileName);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !name || !description.trim()) {
      setError("Please provide a file, a dataset name, and a description.");
      return;
    }
    const tagValidationError = validateTags(tags);
    if (tagValidationError) {
      setTagsError(tagValidationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("format", "arff");
      formData.append("creator", creator);
      formData.append("contributor", contributor);
      formData.append(
        "collection_date",
        collectionDate ? formatDate(collectionDate, "yyyy-MM-dd") : "",
      );
      formData.append("language", language);
      formData.append("licence", licence);
      formData.append("default_target_attribute", defaultTargetAttribute);
      formData.append("ignore_attribute", ignoreAttribute);
      formData.append("citation", citation);
      formData.append("tags", tags);

      const response = await fetch("/api/datasets/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Upload failed. Please try again.");
        setTimeout(
          () =>
            errorRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            }),
          50,
        );
        return;
      }

      const id = result.id && result.id !== "new" ? result.id : null;
      router.push(id ? `/datasets/${id}` : "/datasets");
      router.refresh();
    } catch (err) {
      setError("Failed to upload dataset. Please try again.");
      setTimeout(
        () =>
          errorRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          }),
        50,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <UploadCloud className="text-primary h-6 w-6" />
          Upload Dataset
        </CardTitle>
        <CardDescription>
          Share your data with the OpenML community. Supported formats: ARFF,
          CSV, JSON, Parquet, Feather.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pb-4">
          {error && (
            <Alert ref={errorRef} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* File Upload Zone */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Dataset File *</Label>
            <div
              className={cn(
                "relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                isDragging
                  ? "border-primary bg-primary/5"
                  : fileError
                    ? "border-destructive bg-destructive/5"
                    : "hover:bg-muted/50",
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                id="file-upload"
                type="file"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleFileChange}
                accept=".arff,.xrff,.csv,.json,.parquet,.feather"
              />
              <div className="pointer-events-none flex flex-col items-center justify-center gap-2">
                {file ? (
                  <>
                    <FileText className="text-primary h-10 w-10" />
                    <span className="text-lg font-medium">{file.name}</span>
                    <span className="text-muted-foreground text-sm">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </>
                ) : isDragging ? (
                  <>
                    <UploadCloud className="text-primary h-10 w-10" />
                    <span className="text-primary font-medium">
                      Drop to upload
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="text-muted-foreground h-10 w-10" />
                    <span className="font-medium">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-muted-foreground text-sm">
                      ARFF, CSV, JSON, Parquet, Feather · Max {MAX_FILE_SIZE_MB}{" "}
                      MB
                    </span>
                  </>
                )}
              </div>
            </div>
            {fileError && (
              <p className="text-destructive flex items-center gap-1.5 text-sm">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {fileError}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Dataset Name *</Label>
                <Input
                  id="name"
                  placeholder="My_Awesome_Dataset"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {name.includes(" ") && (
                  <p className="text-muted-foreground text-xs">
                    Spaces will be saved as underscores:{" "}
                    <span className="font-medium">
                      {name.replace(/ /g, "_")}
                    </span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Format</Label>
                <div className="border-input bg-muted/50 text-muted-foreground flex h-10 w-full items-center rounded-md border px-3 text-sm">
                  ARFF, CSV, JSON, Parquet, Feather
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description *{" "}
                <span className="text-muted-foreground font-normal">
                  (Markdown supported)
                </span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your dataset, its origin, and any preprocessing..."
                className="min-h-40"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="e.g. study_14, classification, tabular"
                value={tags}
                onChange={(e) => {
                  setTags(e.target.value);
                  setTagsError(validateTags(e.target.value));
                }}
                className={tagsError ? "border-destructive" : ""}
              />
              {tagsError ? (
                <p className="text-destructive flex items-center gap-1.5 text-xs">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {tagsError}
                </p>
              ) : (
                <p className="text-muted-foreground -mt-0.5 text-xs">
                  Comma-separated. Only letters, numbers, <code>_</code>{" "}
                  <code>-</code> <code>.</code> allowed.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Metadata</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="creator">Creator</Label>
                <Input
                  id="creator"
                  placeholder="Original creator of the dataset"
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contributor">Contributor(s)</Label>
                <Input
                  id="contributor"
                  placeholder="People who contributed to the dataset"
                  value={contributor}
                  onChange={(e) => setContributor(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Collection Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !collectionDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {collectionDate
                        ? formatDate(collectionDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={collectionDate}
                      onSelect={setCollectionDate}
                      captionLayout="dropdown"
                      startMonth={new Date(1800, 0)}
                      endMonth={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  placeholder="English, French, etc."
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Licence & Citation</h3>
            <div className="space-y-2">
              <Label htmlFor="licence">Licence Type</Label>
              <Select value={licence} onValueChange={setLicence}>
                <SelectTrigger id="licence">
                  <SelectValue placeholder="Select Licence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public Domain (CCO)">
                    Public Domain (CCO)
                  </SelectItem>
                  <SelectItem value="Publicly available">
                    Publicly available
                  </SelectItem>
                  <SelectItem value="Attribution (CC BY)">
                    Attribution (CC BY)
                  </SelectItem>
                  <SelectItem value="Attribution-ShareAlike (CC BY-SA)">
                    Attribution-ShareAlike (CC BY-SA)
                  </SelectItem>
                  <SelectItem value="Attribution-NoDerivs (CC BY-ND)">
                    Attribution-NoDerivs (CC BY-ND)
                  </SelectItem>
                  <SelectItem value="Attribution-NonCommercial (CC BY-NC)">
                    Attribution-NonCommercial (CC BY-NC)
                  </SelectItem>
                  <SelectItem value="Attribution-NonCommercial-ShareAlike (CC BY-NC-SA)">
                    Attribution-NonCommercial-ShareAlike (CC BY-NC-SA)
                  </SelectItem>
                  <SelectItem value="Attribution-NonCommercial-NoDerivs (CC BY-NC-ND)">
                    Attribution-NonCommercial-NoDerivs (CC BY-NC-ND)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="citation">Citation</Label>
              <Textarea
                id="citation"
                placeholder="How to cite this dataset..."
                className="min-h-[80px]"
                value={citation}
                onChange={(e) => setCitation(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Technical Details</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="defaultTargetAttribute">
                  Default Target Attribute
                </Label>
                <Input
                  id="defaultTargetAttribute"
                  placeholder="Class label column name"
                  value={defaultTargetAttribute}
                  onChange={(e) => setDefaultTargetAttribute(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ignoreAttribute">Ignore Attribute</Label>
                <Input
                  id="ignoreAttribute"
                  placeholder="Columns to ignore (comma separated)"
                  value={ignoreAttribute}
                  onChange={(e) => setIgnoreAttribute(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/20 flex flex-col gap-3 border-t pt-6">
          {error && (
            <p className="text-destructive flex w-full items-start gap-1.5 text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}
          <div className="flex w-full justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !file || !name || !description.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Dataset"
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
