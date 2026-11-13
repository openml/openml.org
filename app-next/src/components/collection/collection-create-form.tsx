"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, PlusCircle, AlertCircle, X, ListTodo, FlaskConical, CheckCircle2 } from "lucide-react";

type CollectionType = "tasks" | "runs";

export function CollectionCreateForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [collectionType, setCollectionType] = useState<CollectionType>("tasks");
  const [collectionName, setCollectionName] = useState("");
  const [description, setDescription] = useState("");
  const [ids, setIds] = useState<number[]>([]);
  const [idInput, setIdInput] = useState("");
  const [idInputError, setIdInputError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const LOADING_STEPS = [
    "Submitting to OpenML...",
    "Processing your collection...",
    "Almost done...",
  ];

  const addId = () => {
    const trimmed = idInput.trim().replace(/,$/, "");
    if (!trimmed) return;
    const num = parseInt(trimmed, 10);
    if (isNaN(num) || num <= 0) {
      setIdInputError("Please enter a valid positive integer ID.");
      return;
    }
    if (!ids.includes(num)) {
      setIds((prev) => [...prev, num]);
    }
    setIdInput("");
    setIdInputError(null);
  };

  const removeId = (id: number) => setIds((prev) => prev.filter((n) => n !== id));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addId();
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!collectionName) {
      setError("Collection name is required.");
      return;
    }
    if (ids.length === 0) {
      setError(`Please add at least one ${collectionType === "tasks" ? "task" : "run"} ID.`);
      return;
    }
    if (!session) {
      setError("You must be signed in to create a collection.");
      return;
    }

    setIsLoading(true);
    setLoadingStep(0);
    setError(null);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, 3000);

    try {
      const response = await fetch("/api/collections/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionname: collectionName,
          description: description || undefined,
          collectiontype: collectionType,
          taskids: collectionType === "tasks" ? ids.join(",") : undefined,
          runids: collectionType === "runs" ? ids.join(",") : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        clearInterval(stepInterval);
        setError(data.error || "Failed to create collection. Please try again.");
        setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
        return;
      }

      clearInterval(stepInterval);
      router.push(`/collections/${data.id}`);
      router.refresh();
    } catch {
      clearInterval(stepInterval);
      setError("Failed to create collection. Please try again.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    } finally {
      setIsLoading(false);
    }
  };

  const typeLabel = collectionType === "tasks" ? "task" : "run";

  return (
    <Card className="mx-auto w-full max-w-2xl shadow-lg relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg bg-background/80 backdrop-blur-sm">
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-medium">{LOADING_STEPS[loadingStep]}</p>
            <p className="text-muted-foreground mt-1 text-xs">This may take a few seconds.</p>
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <PlusCircle className="text-primary h-6 w-6" />
          Create Collection
        </CardTitle>
        <CardDescription>
          Create a new benchmark suite or study by grouping tasks or runs.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert ref={errorRef} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Collection Type */}
          <div className="space-y-2">
            <Label>Collection Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setCollectionType("tasks"); setIds([]); }}
                className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                  collectionType === "tasks"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <ListTodo className={`mt-0.5 h-5 w-5 shrink-0 ${collectionType === "tasks" ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className="font-medium text-sm">Benchmark Suite</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Group tasks for comparison</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setCollectionType("runs"); setIds([]); }}
                className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                  collectionType === "runs"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <FlaskConical className={`mt-0.5 h-5 w-5 shrink-0 ${collectionType === "runs" ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className="font-medium text-sm">Study</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Group runs for analysis</p>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Name + Description */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collectionName">Collection Name *</Label>
              <Input
                id="collectionName"
                placeholder="My Benchmark Suite"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this collection..."
                className="min-h-[80px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Step 3: Add IDs */}
          <div className="space-y-3">
            <Label>
              {collectionType === "tasks" ? "Tasks" : "Runs"} *
              {ids.length > 0 && (
                <span className="text-muted-foreground ml-2 font-normal text-xs">
                  {ids.length} selected
                </span>
              )}
            </Label>

            {/* Selected ID badges */}
            {ids.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {ids.map((id) => (
                  <Badge key={id} variant="secondary" className="gap-1 pr-1">
                    #{id}
                    <button
                      type="button"
                      onClick={() => removeId(id)}
                      className="hover:text-destructive ml-0.5 rounded transition-colors"
                      aria-label={`Remove ${typeLabel} ${id}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* ID input */}
            <div className="flex gap-2">
              <Input
                placeholder={`Enter ${typeLabel} ID...`}
                value={idInput}
                onChange={(e) => { setIdInput(e.target.value); setIdInputError(null); }}
                onKeyDown={handleKeyDown}
                className={idInputError ? "border-destructive" : ""}
                type="number"
                min={1}
              />
              <Button type="button" variant="outline" onClick={addId} className="gap-1 shrink-0">
                <X className="h-4 w-4 rotate-45" />
                Add
              </Button>
            </div>
            {idInputError ? (
              <p className="text-destructive text-xs">{idInputError}</p>
            ) : (
              <p className="text-muted-foreground text-xs">
                Press <kbd className="bg-muted rounded px-1 py-0.5 text-xs">Enter</kbd> or{" "}
                <kbd className="bg-muted rounded px-1 py-0.5 text-xs">,</kbd> to add each ID.
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="bg-muted/20 flex justify-between border-t pt-6">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || ids.length === 0 || !collectionName}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Create Collection
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
