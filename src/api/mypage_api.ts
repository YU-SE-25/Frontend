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
  goals?: {
    // 1. 언어별 학습 시간 설정 (예: { javascript: 120, python: 90 })
    studyTimeByLanguage?: Record<string, number>; // 단위: 분(minutes)

    // 2. 하루 최소 학습 시간 설정
    dailyMinimumStudyMinutes?: number;

    // 3. 주간 학습 목표 (총 학습 시간)
    weeklyStudyGoalMinutes?: number;

    // 4. 학습 알림 / 리마인더 시간 목록
    reminderTimes?: string[]; // "18:00", "21:30" 같은 HH:mm 형식
  };
  achievements?: Achievement[];
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
