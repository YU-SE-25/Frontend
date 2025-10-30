// src/api/problemlist_api.ts
export type UserProblemStatus = "solved" | "attempted" | "none";

export interface Problem {
  id: number;
  title: string;
  difficulty: string;
  views: number;
  summary: string;
  uploadDate: string;
  solvedCount: number;
  successRate: string;
  userStatus: UserProblemStatus;
}

export interface FetchProblemParams {
  sortType: string;
  searchTerm?: string;
  isLoggedIn: boolean;
  page?: number;
  size?: number;
}

export async function fetchProblems({
  sortType,
  searchTerm,
  isLoggedIn,
  page = 1,
  size = 50,
}: FetchProblemParams): Promise<Problem[]> {
  const qs = new URLSearchParams({
    sort: sortType,
    q: searchTerm ?? "",
    page: String(page),
    size: String(size),
  });

  const res = await fetch(`/api/problems?${qs.toString()}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch problems");

  const data: Problem[] = await res.json();

  return isLoggedIn ? data : data.map((p) => ({ ...p, userStatus: "none" }));
}
