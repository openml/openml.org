"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import { Loader2, UploadCloud, FileText, AlertCircle } from "lucide-react";

export function DatasetUploadForm() {
  const { data: _session } = useSession();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState("arff");

  // Additional Metadata
  const [creator, setCreator] = useState("");
  const [contributor, setContributor] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [language, setLanguage] = useState("");
  const [licence, setLicence] = useState("Publicly available");
  const [defaultTargetAttribute, setDefaultTargetAttribute] = useState("");
  const [ignoreAttribute, setIgnoreAttribute] = useState("");
  const [citation, setCitation] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Auto-fill name if empty
      if (!name) {
        const fileName = e.target.files[0].name;
        setName(fileName.substring(0, fileName.lastIndexOf(".")) || fileName);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) {
      setError("Please provide a file and a dataset name.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate upload for now (or implement actual API call)
      // const formData = new FormData();
      // formData.append("file", file);
      // formData.append("name", name);
      // formData.append("description", description);
      // formData.append("format", format);
      // formData.append("creator", creator);
      // formData.append("contributor", contributor);
      // formData.append("collection_date", collectionDate);
      // formData.append("language", language);
      // formData.append("licence", licence);
      // formData.append("default_target_attribute", defaultTargetAttribute);
      // formData.append("ignore_attribute", ignoreAttribute);
      // formData.append("citation", citation);

      // await fetch("/api/datasets/upload", { method: "POST", body: formData });

      await new Promise((resolve) => setTimeout(resolve, 1500)); // Mock delay

      // Redirect to datasets page upon success
      router.push("/datasets");
      router.refresh(); // Refresh to show new dataset
    } catch (err) {
      setError("Failed to upload dataset. Please try again.");
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
          CSV, Parquet, JSON.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pb-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* File Upload Zone */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Dataset File</Label>
            <div className="hover:bg-muted/50 relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors">
              <input
                id="file-upload"
                type="file"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleFileChange}
                accept=".arff,.csv,.json,.parquet,.xrff"
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
                ) : (
                  <>
                    <UploadCloud className="text-muted-foreground h-10 w-10" />
                    <span className="font-medium">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-muted-foreground text-sm">
                      ARFF, CSV, Parquet, JSON (Max 100MB)
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Dataset Name *</Label>
                <Input
                  id="name"
                  placeholder="My Awesome Dataset"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arff">ARFF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="parquet">Parquet</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description (Markdown supported)
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your dataset, its origin, and any preprocessing..."
                className="min-h-40"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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
                <Label htmlFor="collectionDate">Collection Date</Label>
                <Input
                  id="collectionDate"
                  placeholder="YYYY-MM-DD"
                  value={collectionDate}
                  onChange={(e) => setCollectionDate(e.target.value)}
                />
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

        <CardFooter className="bg-muted/20 flex justify-between border-t pt-6">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !file}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Dataset"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
