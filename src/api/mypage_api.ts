import axios from "axios";

export type Submission = {
  id: number;
  submissionId: number;
  problemId: number;
  verdict: "AC" | "WA" | "TLE" | "MLE" | "RE";
  language: string;
  runtimeMs: number;
  submittedAt: string;
};

export type Achievement = {
  id: string;
  title: string;
  icon: string;
  earnedAt: string;
};
export type UserProfile = {
  userId: number;
  username: string;
  avatarUrl: string;
  bio: string;
  joinedAt: string;
  solvedProblems: number[];
  bookmarkedProblems: number[];
  recentSubmissions: Submission[];
  prefferred_language?: string[];
  role: string;
  stats: {
    totalSolved: number;
    totalSubmitted: number;
    acceptanceRate: number;
    streakDays: number;
    rank: number;
    rating: number;
  };
  achievements: Achievement[];
};

const USERS_API_BASE = "/api/users";

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const { data } = await axios.get<UserProfile>(`${USERS_API_BASE}/${userId}`);
  return data;
}
/* deprecated 
@)))))))))))))))))))))))))))))))김밥 머거

export async function getSolvedIds(userId: string): Promise<number[]> {
  const { data } = await axios.get<{ ids: number[] }>(
    `${USERS_API_BASE}/${userId}/solved`
  );
  return data?.ids ?? [];
}

export async function getBookmarkedIds(userId: string): Promise<number[]> {
  const { data } = await axios.get<{ ids: number[] }>(
    `${USERS_API_BASE}/${userId}/bookmarks`
  );
  return data?.ids ?? [];
}

export async function getRecentSubmissions(userId: string) {
  const { data } = await axios.get(`${USERS_API_BASE}/${userId}/submissions`, {
    params: { limit: 20 },
  });
  return Array.isArray(data) ? data : [];
}
*/
