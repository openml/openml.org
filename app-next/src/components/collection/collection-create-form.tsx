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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, PlusCircle, AlertCircle } from "lucide-react";

export function CollectionCreateForm() {
  const { data: _session } = useSession();
  const router = useRouter();

  const [collectionName, setCollectionName] = useState("");
  const [description, setDescription] = useState("");
  const [taskIds, setTaskIds] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionName || !taskIds) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      // const payload = {
      //   collectionname: collectionName,
      //   description: description,
      //   taskids: taskIds,
      //   benchmark: 0 // Default or selected?
      // };

      // await fetch("/api/collections/create", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload)
      // });

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push("/collections");
      router.refresh();
    } catch (err) {
      setError("Failed to create collection. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <PlusCircle className="text-primary h-6 w-6" />
          Create Collection
        </CardTitle>
        <CardDescription>
          Create a new collection (benchmark suite) of tasks.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 pb-6">
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
                className="min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taskIds">Task IDs *</Label>
              <Textarea
                id="taskIds"
                placeholder="1, 2, 3, 4, 5"
                value={taskIds}
                onChange={(e) => setTaskIds(e.target.value)}
                required
              />
              <p className="text-muted-foreground text-sm">
                Comma-separated list of Task IDs to include in this collection.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/20 flex justify-between border-t pt-6">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Collection"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
