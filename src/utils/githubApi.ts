/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GitHub Public API client for Yash Jit (username: yashjit52n).
 * Fetches public repositories, languages, stars, forks, and profile telemetry.
 * Operates strictly with unauthenticated public API and graceful fallback data.
 */

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics?: string[];
  fork: boolean;
}

export interface GitHubUserProfile {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
}

export interface GitHubDataResult {
  profile: GitHubUserProfile;
  repos: GitHubRepo[];
  isLive: boolean;
  lastFetched: string;
  error?: string;
}

const FALLBACK_PROFILE: GitHubUserProfile = {
  login: "yashjit52n",
  name: "Yash Jit",
  avatar_url: "https://github.com/yashjit52n.png",
  html_url: "https://github.com/yashjit52n",
  public_repos: 6,
  followers: 4,
  following: 8,
  bio: "B.Tech Computer Science & AI @ NST | Aspiring Software Engineer | Problem Solver",
};

const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 101,
    name: "algorithm-visualizer",
    description: "Interactive visualizer for classical sorting algorithms, binary search trees, and graph traversals built with modern web technologies.",
    html_url: "https://github.com/yashjit52n",
    homepage: "https://github.com/yashjit52n",
    language: "JavaScript",
    stargazers_count: 5,
    forks_count: 1,
    updated_at: "2026-03-12T10:20:00Z",
    topics: ["algorithms", "visualizer", "sorting", "datastructures"],
    fork: false,
  },
  {
    id: 102,
    name: "competitive-programming-solutions",
    description: "Curated collection of competitive programming solutions in C++ and Python from Codeforces, LeetCode, and contest sprints.",
    html_url: "https://github.com/yashjit52n",
    homepage: null,
    language: "C++",
    stargazers_count: 8,
    forks_count: 2,
    updated_at: "2026-04-02T15:45:00Z",
    topics: ["cpp", "codeforces", "competitive-programming", "algorithms"],
    fork: false,
  },
  {
    id: 103,
    name: "ai-coursework-models",
    description: "Neural network exploration and mathematical foundations for machine learning implementations in Python and NumPy.",
    html_url: "https://github.com/yashjit52n",
    homepage: null,
    language: "Python",
    stargazers_count: 4,
    forks_count: 0,
    updated_at: "2026-03-20T08:15:00Z",
    topics: ["python", "ai", "machine-learning", "coursework"],
    fork: false,
  },
  {
    id: 104,
    name: "developer-utility-suite",
    description: "Responsive web productivity hub featuring formatting tools, regex testers, and algorithmic benchmarking utilities.",
    html_url: "https://github.com/yashjit52n",
    homepage: null,
    language: "HTML",
    stargazers_count: 3,
    forks_count: 0,
    updated_at: "2026-02-28T18:00:00Z",
    topics: ["web", "developer-tools", "productivity", "css3"],
    fork: false,
  },
];

export async function fetchGitHubData(username = "yashjit52n"): Promise<GitHubDataResult> {
  const timeoutMs = 5000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { signal: controller.signal }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, { signal: controller.signal }),
    ]);

    let profile: GitHubUserProfile = FALLBACK_PROFILE;
    if (profileRes.ok) {
      const pData = await profileRes.json();
      if (pData && pData.login) {
        profile = pData;
      }
    }

    let repos: GitHubRepo[] = FALLBACK_REPOS;
    if (reposRes.ok) {
      const rData = await reposRes.json();
      if (Array.isArray(rData) && rData.length > 0) {
        repos = rData.filter((r) => !r.fork).slice(0, 6);
        if (repos.length === 0) repos = rData.slice(0, 6);
      }
    }

    clearTimeout(timeoutId);
    return {
      profile,
      repos,
      isLive: profileRes.ok || reposRes.ok,
      lastFetched: new Date().toLocaleTimeString(),
    };
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      profile: FALLBACK_PROFILE,
      repos: FALLBACK_REPOS,
      isLive: false,
      lastFetched: new Date().toLocaleTimeString(),
      error: error instanceof Error ? error.message : 'GitHub API unavailable',
    };
  }
}
