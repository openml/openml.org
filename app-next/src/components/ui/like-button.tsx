"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  likeDataset,
  unlikeDataset,
  likeFlow,
  unlikeFlow,
  likeTask,
  unlikeTask,
  likeRun,
  unlikeRun,
  getOpenMLApiKey,
} from "@/services/likes";

type EntityType = "dataset" | "flow" | "task" | "run";

interface LikeButtonProps {
  entityType: EntityType;
  entityId: number;
  initialLikes?: number;
  initialIsLiked?: boolean;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

const likeFunctions = {
  dataset: { like: likeDataset, unlike: unlikeDataset },
  flow: { like: likeFlow, unlike: unlikeFlow },
  task: { like: likeTask, unlike: unlikeTask },
  run: { like: likeRun, unlike: unlikeRun },
};

export function LikeButton({
  entityType,
  entityId,
  initialLikes = 0,
  initialIsLiked = false,
  size = "md",
  showCount = true,
  className,
}: LikeButtonProps) {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = React.useState(initialIsLiked);
  const [likesCount, setLikesCount] = React.useState(initialLikes);
  const [isLoading, setIsLoading] = React.useState(false);
  const [apiKey, setApiKey] = React.useState<string | null>(null);

  // Get API key when user is authenticated
  React.useEffect(() => {
    async function fetchApiKey() {
      console.log(
        "[LikeButton] Status:",
        status,
        "Session:",
        session?.user?.email,
        "AccessToken exists:",
        !!session?.accessToken,
      );

      if (status === "authenticated" && session?.accessToken) {
        try {
          const key = await getOpenMLApiKey(session.accessToken);
          console.log(
            "[LikeButton] API Key fetched:",
            key ? "success" : "null",
          );
          setApiKey(key);
        } catch (error) {
          // Silently fail - user can still view the page, just can't like
          console.warn("Could not fetch API key for likes:", error);
        }
      }
    }
    fetchApiKey();
  }, [status, session?.accessToken]);

  const handleLike = async () => {
    // Wait for session to load
    if (status === "loading") {
      toast({
        title: "Please wait",
        description: "Loading session...",
      });
      return;
    }

    if (status !== "authenticated" || !session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like this " + entityType,
        variant: "destructive",
      });
      return;
    }

    // If API key is not ready yet, try to fetch it now
    let currentApiKey = apiKey;
    if (!currentApiKey && session?.accessToken) {
      try {
        currentApiKey = await getOpenMLApiKey(session.accessToken);
        if (currentApiKey) {
          setApiKey(currentApiKey);
        }
      } catch (error) {
        console.warn("Could not fetch API key:", error);
      }
    }

    if (!currentApiKey) {
      toast({
        title: "Likes temporarily unavailable",
        description:
          "The backend server is not running. Start the Flask backend to enable likes.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { like, unlike } = likeFunctions[entityType];
    const action = isLiked ? unlike : like;
    const result = await action(entityId, currentApiKey);

    if (result.success) {
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      toast({
        title: isLiked ? "Removed from favorites" : "Added to favorites",
        description: isLiked
          ? `You unliked this ${entityType}`
          : `You liked this ${entityType}`,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Something went wrong",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-1", className)}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                sizeClasses[size],
                "rounded-full transition-all",
                isLiked
                  ? "text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                  : "text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950",
              )}
              onClick={handleLike}
              disabled={isLoading}
            >
              <Heart
                size={iconSizes[size]}
                className={cn(
                  "transition-all",
                  isLiked && "fill-current",
                  isLoading && "animate-pulse",
                )}
              />
              <span className="sr-only">
                {isLiked ? "Unlike" : "Like"} this {entityType}
              </span>
            </Button>
            {showCount && (
              <span
                className={cn(
                  "text-sm tabular-nums",
                  isLiked
                    ? "font-medium text-red-500"
                    : "text-muted-foreground",
                )}
              >
                {likesCount}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {status !== "authenticated"
              ? "Sign in to like"
              : isLiked
                ? "Click to unlike"
                : "Click to like"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
