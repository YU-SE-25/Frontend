// src/api/mypage.ts
// ⚡️ 실제 서버 연동 전까지 더미데이터로 사용
import type { UserProfile } from "../mypage_api";

// 🧩 가짜 유저 데이터 (김형섭 예시)
const dummyUser: UserProfile = {
  userId: 1024,
  username: "gamppe",
  avatarUrl: "https://media.tenor.com/CNI1fSM1XSoAAAAe/shocked-surprised.png",
  bio: "꾸준히 성장하는 개발자 👨‍💻",
  joinedAt: "2025-02-10T13:41:00Z",
  prefferred_language: ["Python", "C++", "JavaScript", "Java", "Ummlang", "Go"],
  role: "LEARNER",
  solvedProblems: [1, 3, 5, 8, 13, 21, 34, 55, 89],
  bookmarkedProblems: [5, 13, 42, 120],
  recentSubmissions: [
    {
      id: 1,
      submissionId: 9001,
      problemId: 2,
      verdict: "AC",
      language: "C++17",
      runtimeMs: 74,
      submittedAt: "2025-10-27T09:30:12Z",
    },
    {
      id: 2,
      submissionId: 9000,
      problemId: 5,
      verdict: "WA",
      language: "Python 3",
      runtimeMs: 203,
      submittedAt: "2025-10-26T22:15:48Z",
    },
    {
      id: 3,
      submissionId: 8999,
      problemId: 7,
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

  goals: {
    studyTimeByLanguage: {
      Python: 120, // Python 2시간
      "C++": 90, // C++ 1.5시간
      JavaScript: 60, // JS 1시간
    },
    dailyMinimumStudyMinutes: 30, // 하루 최소 공부 30분
    weeklyStudyGoalMinutes: 600, // 주간 목표 10시간
    reminderTimes: ["09:00", "21:30"], // 매일 오전 9시, 밤 9시 30분 알림
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

const managerUser: UserProfile = {
  userId: 2048,
  username: "honggildong",
  avatarUrl: "https://media.tenor.com/bG7iD-JgTosAAAAe/manager-boss.png",
  bio: "팀을 이끄는 전략형 매니저 💼",
  joinedAt: "2024-12-05T11:25:00Z",
  prefferred_language: ["Python", "Go", "TypeScript"],
  role: "MANAGER",
  solvedProblems: [2, 4, 6, 8, 10, 12, 14],
  bookmarkedProblems: [10, 14, 20],
  recentSubmissions: [
    {
      id: 1,
      submissionId: 9101,
      problemId: 14,
      verdict: "AC",
      language: "Go",
      runtimeMs: 53,
      submittedAt: "2025-09-28T14:12:00Z",
    },
    {
      id: 2,
      submissionId: 9099,
      problemId: 12,
      verdict: "WA",
      language: "TypeScript",
      runtimeMs: 188,
      submittedAt: "2025-09-26T20:48:10Z",
    },
  ],
  stats: {
    totalSolved: 58,
    totalSubmitted: 130,
    acceptanceRate: 44.6,
    streakDays: 5,
    rank: 82,
    rating: 1580,
  },

  achievements: [
    {
      id: "mentor_badge",
      title: "멘토 인증",
      icon: "🧭",
      earnedAt: "2025-02-11T10:30:00Z",
    },
    {
      id: "streak_5",
      title: "5일 연속 풀이 달성",
      icon: "🔥",
      earnedAt: "2025-03-18T13:41:00Z",
    },
  ],
};

const instructorUser: UserProfile = {
  userId: 4096,
  username: "kimchulsoo",
  avatarUrl: "https://media.tenor.com/MmHFGN8bYpsAAAAe/teacher-teaching.png",
  bio: "알고리즘 강의 전문가 👨‍🏫",
  joinedAt: "2024-11-15T09:00:00Z",
  prefferred_language: ["Java", "C++", "Kotlin"],
  role: "INSTRUCTOR",
  solvedProblems: [1, 3, 5, 7, 9, 11, 13],
  bookmarkedProblems: [3, 7, 11],
  recentSubmissions: [
    {
      id: 1,
      submissionId: 9201,
      problemId: 13,
      verdict: "AC",
      language: "Java 17",
      runtimeMs: 61,
      submittedAt: "2025-10-02T12:44:22Z",
    },
    {
      id: 2,
      submissionId: 9199,
      problemId: 9,
      verdict: "TLE",
      language: "Kotlin",
      runtimeMs: 1002,
      submittedAt: "2025-09-30T18:11:45Z",
    },
  ],
  stats: {
    totalSolved: 73,
    totalSubmitted: 160,
    acceptanceRate: 45.6,
    streakDays: 9,
    rank: 61,
    rating: 1660,
  },
  achievements: [
    {
      id: "teacher_badge",
      title: "강의의 달인",
      icon: "🏅",
      earnedAt: "2025-01-25T07:22:00Z",
    },
    {
      id: "streak_9",
      title: "9일 연속 풀이 달성",
      icon: "🔥",
      earnedAt: "2025-04-02T10:00:00Z",
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
//mamagerUser, instructorUser, dummyUser 중에서 역할에 따라 반환
export async function getDummyUserProfile(
  role: "LEARNER" | "MANAGER" | "INSTRUCTOR" = "LEARNER"
): Promise<UserProfile> {
  if (role === "MANAGER") return Promise.resolve(managerUser);
  if (role === "INSTRUCTOR") return Promise.resolve(instructorUser);
  return Promise.resolve(dummyUser);
}
