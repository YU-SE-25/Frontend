// src/api/mypage.ts
// ⚡️ 실제 서버 연동 전까지 더미데이터로 사용

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

// 🧩 가짜 유저 데이터 (김형섭 예시)
const dummyUser: UserProfile = {
  userId: 1024,
  username: "gamppe",
  avatarUrl: "https://avatars.githubusercontent.com/u/1024?v=4",
  bio: "꾸준히 성장하는 개발자 👨‍💻",
  joinedAt: "2025-02-10T13:41:00Z",

  solvedProblems: [1, 3, 5, 8, 13, 21, 34, 55, 89],
  bookmarkedProblems: [5, 13, 42, 120],
  recentSubmissions: [
    {
      id: 1,
      submissionId: 9001,
      problemId: 34,
      verdict: "AC",
      language: "C++17",
      runtimeMs: 74,
      submittedAt: "2025-10-27T09:30:12Z",
    },
    {
      id: 2,
      submissionId: 9000,
      problemId: 55,
      verdict: "WA",
      language: "Python 3",
      runtimeMs: 203,
      submittedAt: "2025-10-26T22:15:48Z",
    },
    {
      id: 3,
      submissionId: 8999,
      problemId: 21,
      verdict: "AC",
      language: "Java 11",
      runtimeMs: 92,
      submittedAt: "2025-10-26T21:44:22Z",
    },
  ],

  stats: {
    totalSolved: 42,
    totalSubmitted: 105,
    acceptanceRate: 40.0,
    streakDays: 7,
    rank: 155,
    rating: 1420,
  },

  achievements: [
    {
      id: "first_ac",
      title: "첫 번째 정답!",
      icon: "🎉",
      earnedAt: "2025-01-02T08:13:00Z",
    },
    {
      id: "streak_7",
      title: "7일 연속 풀이 달성",
      icon: "🔥",
      earnedAt: "2025-03-14T09:41:00Z",
    },
  ],
};

/* deprecated
export async function getSolvedIds(userId: string | number): Promise<number[]> {
  console.log(`[mock] getSolvedIds(${userId})`);
  return Promise.resolve(dummyUser.solvedProblems);
}

export async function getBookmarkedIds(
  userId: string | number
): Promise<number[]> {
  console.log(`[mock] getBookmarkedIds(${userId})`);
  return Promise.resolve(dummyUser.bookmarkedProblems);
}

export async function getRecentSubmissions(
  userId: string | number
): Promise<Submission[]> {
  console.log(`[mock] getRecentSubmissions(${userId})`);
  return Promise.resolve(dummyUser.recentSubmissions);
}
*/
export async function getDummyUserProfile(): Promise<UserProfile> {
  return Promise.resolve(dummyUser);
}
