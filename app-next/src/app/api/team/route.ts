import { NextResponse } from "next/server";

// Team member IDs from OpenML database (matching current openml.org/about)
const TC_IDS = [1, 2, 27, 86, 348, 970]; // Steering Committee
const CORE_IDS = [
  1, 2, 27, 86, 348, 970, 1140, 869, 8111, 9186, 3744, 35875, 35755, 34097,
  34198,
];

const OPENML_API_URL = "https://www.openml.org";

interface CoreTeamMember {
  user_id: number;
  first_name: string;
  last_name: string;
  bio: string;
  image: string;
  isSteeringCommittee: boolean;
}

export async function GET() {
  try {
    // Use Elasticsearch search endpoint (same as current openml.org/about)
    const searchBody = {
      size: 50,
      query: {
        terms: {
          user_id: CORE_IDS,
        },
      },
      _source: ["user_id", "first_name", "last_name", "bio", "image"],
    };

    const response = await fetch(`${OPENML_API_URL}/es/user/_search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchBody),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`ES search failed: ${response.status}`);
    }

    const data = await response.json();
    const hits = data.hits?.hits || [];

    const teamMembers: CoreTeamMember[] = hits.map(
      (hit: {
        _source: {
          user_id: string | number;
          first_name?: string;
          last_name?: string;
          bio?: string;
          image?: string;
        };
      }) => {
        const user = hit._source;
        const numericId =
          typeof user.user_id === "string"
            ? parseInt(user.user_id)
            : user.user_id;

        // Build proper image URL
        let imageUrl = user.image || "";
        if (imageUrl && !imageUrl.startsWith("http")) {
          imageUrl = `${OPENML_API_URL}/img/${imageUrl}`;
        }

        return {
          user_id: numericId,
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          bio: user.bio || "",
          image: imageUrl,
          isSteeringCommittee: TC_IDS.includes(numericId),
        };
      },
    );

    // Sort: SC members first, then by ID
    const sortedMembers = teamMembers.sort((a, b) => {
      if (a.isSteeringCommittee && !b.isSteeringCommittee) return -1;
      if (!a.isSteeringCommittee && b.isSteeringCommittee) return 1;
      return a.user_id - b.user_id;
    });

    return NextResponse.json({ team: sortedMembers });
  } catch (error) {
    console.error("Error fetching core team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 },
    );
  }
}
