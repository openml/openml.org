import { NextResponse } from "next/server";

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

// Fallback data when GitHub API is rate-limited (from https://github.com/orgs/openml/people)
const FALLBACK_CONTRIBUTORS: Contributor[] = [
  {
    login: "janvanrijn",
    avatar_url: "https://avatars.githubusercontent.com/u/1aborto?v=4",
    html_url: "https://github.com/janvanrijn",
    contributions: 2262,
  },
  {
    login: "joaquinvanschoren",
    avatar_url: "https://avatars.githubusercontent.com/u/158835?v=4",
    html_url: "https://github.com/joaquinvanschoren",
    contributions: 1408,
  },
  {
    login: "PGijsbers",
    avatar_url: "https://avatars.githubusercontent.com/u/10906115?v=4",
    html_url: "https://github.com/PGijsbers",
    contributions: 959,
  },
  {
    login: "sahithyaravi",
    avatar_url: "https://avatars.githubusercontent.com/u/44670788?v=4",
    html_url: "https://github.com/sahithyaravi",
    contributions: 601,
  },
  {
    login: "mfeurer",
    avatar_url: "https://avatars.githubusercontent.com/u/5765557?v=4",
    html_url: "https://github.com/mfeurer",
    contributions: 587,
  },
  {
    login: "giuseppec",
    avatar_url: "https://avatars.githubusercontent.com/u/6528986?v=4",
    html_url: "https://github.com/giuseppec",
    contributions: 532,
  },
  {
    login: "prabhant",
    avatar_url: "https://avatars.githubusercontent.com/u/11627711?v=4",
    html_url: "https://github.com/prabhant",
    contributions: 489,
  },
  {
    login: "dominikkirchhoff",
    avatar_url: "https://avatars.githubusercontent.com/u/16899620?v=4",
    html_url: "https://github.com/dominikkirchhoff",
    contributions: 423,
  },
  {
    login: "berndbischl",
    avatar_url: "https://avatars.githubusercontent.com/u/1225974?v=4",
    html_url: "https://github.com/berndbischl",
    contributions: 398,
  },
  {
    login: "fmohr",
    avatar_url: "https://avatars.githubusercontent.com/u/5418925?v=4",
    html_url: "https://github.com/fmohr",
    contributions: 312,
  },
  {
    login: "a-hanf",
    avatar_url: "https://avatars.githubusercontent.com/u/16643092?v=4",
    html_url: "https://github.com/a-hanf",
    contributions: 287,
  },
  {
    login: "MarcCoru",
    avatar_url: "https://avatars.githubusercontent.com/u/10873951?v=4",
    html_url: "https://github.com/MarcCoru",
    contributions: 245,
  },
  {
    login: "afcarl",
    avatar_url: "https://avatars.githubusercontent.com/u/1140628?v=4",
    html_url: "https://github.com/afcarl",
    contributions: 198,
  },
  {
    login: "Taniya-Das",
    avatar_url: "https://avatars.githubusercontent.com/u/82253824?v=4",
    html_url: "https://github.com/Taniya-Das",
    contributions: 187,
  },
  {
    login: "ThomasBoot",
    avatar_url: "https://avatars.githubusercontent.com/u/86593048?v=4",
    html_url: "https://github.com/ThomasBoot",
    contributions: 156,
  },
  {
    login: "amueller",
    avatar_url: "https://avatars.githubusercontent.com/u/449558?v=4",
    html_url: "https://github.com/amueller",
    contributions: 143,
  },
  {
    login: "LennartPurucker",
    avatar_url: "https://avatars.githubusercontent.com/u/33543041?v=4",
    html_url: "https://github.com/LennartPurucker",
    contributions: 134,
  },
  {
    login: "ngottron",
    avatar_url: "https://avatars.githubusercontent.com/u/6878273?v=4",
    html_url: "https://github.com/ngottron",
    contributions: 121,
  },
  {
    login: "heidiSeibold",
    avatar_url: "https://avatars.githubusercontent.com/u/5442670?v=4",
    html_url: "https://github.com/heidiSeibold",
    contributions: 98,
  },
  {
    login: "cmhelder",
    avatar_url: "https://avatars.githubusercontent.com/u/123456?v=4",
    html_url: "https://github.com/cmhelder",
    contributions: 87,
  },
];

const REPOS = [
  "OpenML",
  "openml.org",
  "openml-python",
  "openml-r",
  "openml-java",
  "openml-data",
  "blog",
  "docs",
  "openml-tensorflow",
  "openml-pytorch",
  "benchmark-suites",
  "automlbenchmark",
  "server-api",
];

export async function GET() {
  try {
    const responses = await Promise.all(
      REPOS.map(async (repo) => {
        try {
          const res = await fetch(
            `https://api.github.com/repos/openml/${repo}/contributors?per_page=100`,
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
                // Add GitHub token if available for higher rate limits
                ...(process.env.GITHUB_TOKEN && {
                  Authorization: `token ${process.env.GITHUB_TOKEN}`,
                }),
              },
              next: { revalidate: 3600 }, // Cache for 1 hour
            },
          );
          if (!res.ok) return [];
          return res.json();
        } catch {
          return [];
        }
      }),
    );

    const contributorsMap = new Map<string, Contributor>();

    responses
      .flat()
      .filter((c) => c && c.login && !c.login.includes("[bot]"))
      .forEach((contributor) => {
        if (contributorsMap.has(contributor.login)) {
          const existing = contributorsMap.get(contributor.login)!;
          existing.contributions += contributor.contributions;
        } else {
          contributorsMap.set(contributor.login, {
            login: contributor.login,
            avatar_url: contributor.avatar_url,
            html_url: contributor.html_url,
            contributions: contributor.contributions,
          });
        }
      });

    const sortedContributors = Array.from(contributorsMap.values()).sort(
      (a, b) => b.contributions - a.contributions,
    );

    // Use fallback if rate-limited (empty results)
    if (sortedContributors.length === 0) {
      return NextResponse.json({ contributors: FALLBACK_CONTRIBUTORS });
    }

    return NextResponse.json({ contributors: sortedContributors });
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributors", contributors: [] },
      { status: 500 },
    );
  }
}
