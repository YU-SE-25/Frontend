import type { EditableProfile } from "../screens/mypage/EditPage";
import { api } from "./axios";
import { getDummyUserProfile } from "./dummy/mypage_dummy";
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
  preferred_language?: string[];
  role: string;
  isPublic?: boolean;
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
    // 5. 리마인더 활성화 여부
    isReminderEnabled?: boolean;
  };
  achievements?: Achievement[];
};

export type UserProfileDto = {
  userId: number;
  nickname: string;
  avatarUrl: string;
  bio: string | null;
  preferredLanguage: string[];
  role: string;
  joinedAt: string;
  updatedAt: string;
  isPublic: boolean;
  solvedProblems: number[];
  bookmarkedProblems: number[];
  recentSubmissions: Submission[];
  stats: {
    totalSolved: number;
    totalSubmitted: number;
    acceptanceRate: number;
    streakDays: number;
    ranking: number;
    rating: number;
  };
  goals: {
    studyTimeByLanguage: Record<string, number> | null;
    dailyMinimumStudyMinutes: number;
    weeklyStudyGoalMinutes: number;
    reminderTimes: string[];
    isReminderEnabled: boolean;
  } | null;
};

// PATCH /api/mypage/me 요청 전용 DTO
export type UpdateMyProfileDto = {
  nickname?: string;
  preferredLanguage?: string[];
  bio?: string | null;
  isPublic?: boolean;
  goals?: {
    dailyMinimumStudyMinutes?: number;
    weeklyStudyGoalMinutes?: number;
    isReminderEnabled?: boolean;
  };
};
export function mapEditFormToUpdateDto(
  form: EditableProfile
): UpdateMyProfileDto {
  return {
    nickname: form.username,
    preferredLanguage: form.preferred_language,
    bio: form.bio || null,
    isPublic: !form.hideMyPage,
    goals: {
      dailyMinimumStudyMinutes:
        typeof form.dailyMinimumStudyMinutes === "string"
          ? Number(form.dailyMinimumStudyMinutes)
          : form.dailyMinimumStudyMinutes,
      weeklyStudyGoalMinutes:
        typeof form.weeklyStudyGoalMinutes === "string"
          ? Number(form.weeklyStudyGoalMinutes)
          : form.weeklyStudyGoalMinutes,
      isReminderEnabled: form.enableStudyReminder,
    },
  };
}

export function mapUserProfileDto(dto: UserProfileDto): UserProfile {
  return {
    userId: dto.userId,
    username: dto.nickname,
    avatarUrl: dto.avatarUrl ?? "/images/default-avatar.png",
    bio: dto.bio ?? "",
    joinedAt: dto.joinedAt,
    solvedProblems: dto.solvedProblems ?? [],
    bookmarkedProblems: dto.bookmarkedProblems ?? [],
    recentSubmissions: dto.recentSubmissions ?? [],
    preferred_language: dto.preferredLanguage ?? [],
    role: dto.role,
    isPublic: dto.isPublic,
    stats: {
      totalSolved: dto.stats.totalSolved,
      totalSubmitted: dto.stats.totalSubmitted,
      acceptanceRate: dto.stats.acceptanceRate,
      streakDays: dto.stats.streakDays,
      rank: dto.stats.ranking,
      rating: dto.stats.rating,
    },
    goals: dto.goals
      ? {
          studyTimeByLanguage: dto.goals.studyTimeByLanguage ?? undefined,
          dailyMinimumStudyMinutes:
            dto.goals.dailyMinimumStudyMinutes || undefined,
          weeklyStudyGoalMinutes: dto.goals.weeklyStudyGoalMinutes || undefined,
          reminderTimes:
            dto.goals.reminderTimes && dto.goals.reminderTimes.length > 0
              ? dto.goals.reminderTimes
              : undefined,
          isReminderEnabled: dto.goals.isReminderEnabled,
        }
      : undefined,
    achievements: [],
  };
}

export async function getUserProfile(nickname: string): Promise<UserProfile> {
  try {
    const res = await api.get<UserProfileDto>(`/mypage/${nickname}`);
    console.log("user profile fetched:", res.data);
    return mapUserProfileDto(res.data);
  } catch (err) {
    console.log("❌ getUserProfile 에러 발생, 더미 프로필로 대체:", err);
    return getDummyUserProfile("LEARNER");
  }
}

// 내 프로필 업데이트 (PATCH /api/mypage/me)
export async function updateMyProfile(form: EditableProfile) {
  const updateData = {
    nickname: form.username,
    preferredLanguage: form.preferred_language,
    // bio, isPublic, goals... 등 나머지도 여기서 추가
  };

  console.log("👉 PATCH /mypage/me payload:", updateData);

  try {
    const res = await api.patch("/mypage/me", updateData);
    console.log("마이페이지 수정 성공:", res.data);
    return res.data;
  } catch (err) {
    console.error("마이페이지 수정 중 에러:", err);
    throw err;
  }
}
