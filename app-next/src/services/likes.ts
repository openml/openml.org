/**
 * OpenML Likes Service
 * Handles like/unlike operations for datasets, flows, tasks, and runs
 * Uses the existing OpenML API: /api_new/v1/xml/votes/up/{type}/{id}
 */

const OPENML_API_BASE = "https://www.openml.org";

// Entity type mapping for OpenML API
type EntityType = "dataset" | "flow" | "task" | "run";
type EntityTypeShort = "d" | "f" | "t" | "r";

const entityTypeMap: Record<EntityType, EntityTypeShort> = {
  dataset: "d",
  flow: "f",
  task: "t",
  run: "r",
};

export interface LikeResponse {
  success: boolean;
  error?: string;
}

export interface UserLikeStatus {
  isLiked: boolean;
  error?: string;
}

/**
 * Get the user's OpenML API key from the Flask backend
 * Uses Next.js API route to avoid CORS issues
 *
 * @deprecated The API key is now returned during OAuth login and stored in session.
 * Use `session.apikey` instead of calling this function.
 *
 * Note: This requires the local Flask backend to be running with your user.
 * If using production OpenML, the user must exist locally for likes to work.
 */
export async function getOpenMLApiKey(
  jwtToken: string,
): Promise<string | null> {
  try {
    // Use Next.js API route proxy to avoid CORS issues
    const response = await fetch("/api/user/api-key", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Silently fail - likes just won't be available
      // This is expected when using production OpenML but local Flask backend
      return null;
    }

    const data = await response.json();
    return data.apikey || null;
  } catch (error) {
    // Silently fail - likes just won't be available
    return null;
  }
}

/**
 * Like a dataset
 */
export async function likeDataset(
  datasetId: number,
  apiKey: string,
): Promise<LikeResponse> {
  return likeEntity("dataset", datasetId, apiKey);
}

/**
 * Unlike a dataset
 */
export async function unlikeDataset(
  datasetId: number,
  apiKey: string,
): Promise<LikeResponse> {
  return unlikeEntity("dataset", datasetId, apiKey);
}

/**
 * Like a flow
 */
export async function likeFlow(
  flowId: number,
  apiKey: string,
): Promise<LikeResponse> {
  return likeEntity("flow", flowId, apiKey);
}

/**
 * Unlike a flow
 */
export async function unlikeFlow(
  flowId: number,
  apiKey: string,
): Promise<LikeResponse> {
  return unlikeEntity("flow", flowId, apiKey);
}

/**
 * Like a task
 */
export async function likeTask(
  taskId: number,
  apiKey: string,
): Promise<LikeResponse> {
  return likeEntity("task", taskId, apiKey);
}

/**
 * Unlike a task
 */
export async function unlikeTask(
  taskId: number,
  apiKey: string,
): Promise<LikeResponse> {
  return unlikeEntity("task", taskId, apiKey);
}

/**
 * Like a run
 */
export async function likeRun(
  runId: number,
  apiKey: string,
): Promise<LikeResponse> {
  return likeEntity("run", runId, apiKey);
}

/**
 * Unlike a run
 */
export async function unlikeRun(
  runId: number,
  apiKey: string,
): Promise<LikeResponse> {
  return unlikeEntity("run", runId, apiKey);
}

/**
 * Generic like function for any entity type
 */
async function likeEntity(
  entityType: EntityType,
  entityId: number,
  apiKey: string,
): Promise<LikeResponse> {
  const typeShort = entityTypeMap[entityType];

  try {
    const response = await fetch(
      `${OPENML_API_BASE}/api_new/v1/xml/votes/up/${typeShort}/${entityId}?api_key=${apiKey}`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      // Parse error from XML response
      const text = await response.text();

      // Check for common errors
      if (response.status === 401) {
        return { success: false, error: "Authentication required" };
      }
      if (text.includes("722")) {
        return { success: false, error: "You cannot like your own content" };
      }
      if (text.includes("705")) {
        return { success: false, error: "Already liked" };
      }

      return { success: false, error: `Failed to like ${entityType}` };
    }

    return { success: true };
  } catch (error) {
    console.error(`Error liking ${entityType}:`, error);
    return { success: false, error: "Network error. Please try again." };
  }
}

/**
 * Generic unlike function for any entity type
 */
async function unlikeEntity(
  entityType: EntityType,
  entityId: number,
  apiKey: string,
): Promise<LikeResponse> {
  const typeShort = entityTypeMap[entityType];

  try {
    const response = await fetch(
      `${OPENML_API_BASE}/api_new/v1/xml/votes/up/${typeShort}/${entityId}?api_key=${apiKey}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const text = await response.text();

      if (response.status === 401) {
        return { success: false, error: "Authentication required" };
      }
      if (text.includes("703")) {
        return { success: false, error: "Not liked yet" };
      }

      return { success: false, error: `Failed to unlike ${entityType}` };
    }

    return { success: true };
  } catch (error) {
    console.error(`Error unliking ${entityType}:`, error);
    return { success: false, error: "Network error. Please try again." };
  }
}

/**
 * Check if current user has liked an entity
 * Uses: GET /api_new/v1/xml/votes/up/{user_id}/{type}/{entity_id}
 */
export async function checkUserLikeStatus(
  entityType: EntityType,
  entityId: number,
  userId: number,
  apiKey: string,
): Promise<UserLikeStatus> {
  const typeShort = entityTypeMap[entityType];

  try {
    const response = await fetch(
      `${OPENML_API_BASE}/api_new/v1/xml/votes/up/${userId}/${typeShort}/${entityId}?api_key=${apiKey}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      // 404 or error means not liked
      return { isLiked: false };
    }

    const text = await response.text();
    // If response contains <like> element, user has liked it
    return { isLiked: text.includes("<oml:like") || text.includes("<like") };
  } catch (error) {
    console.error(`Error checking like status:`, error);
    return { isLiked: false, error: "Failed to check like status" };
  }
}

/**
 * Toggle like status - convenience function
 */
export async function toggleLike(
  entityType: EntityType,
  entityId: number,
  isCurrentlyLiked: boolean,
  apiKey: string,
): Promise<LikeResponse> {
  if (isCurrentlyLiked) {
    return unlikeEntity(entityType, entityId, apiKey);
  } else {
    return likeEntity(entityType, entityId, apiKey);
  }
}
