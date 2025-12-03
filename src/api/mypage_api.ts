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
  achievements?: Achievement[]; //확장 가능성 고려
  reminders?: Reminder[];
  isDarkMode?: boolean;
  isStudyAlarm?: boolean;
};

export type Reminder = {
  day: number;
  times: string[];
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
  isStudyAlarm: boolean;
  isDarkMode: boolean;
  reminders: { day: number; times: string[] }[];
};

// PATCH /api/mypage 요청 전용 DTO
export type UpdateMyProfileDto = {
  nickname?: string;
  bio?: string | null;
  preferredLanguage?: string[];
  isPublic?: boolean;

  userGoals?: {
    studyTimeByLanguage?: Record<string, number>;
    dailyMinimumStudyMinutes?: number;
    weeklyStudyGoalMinutes?: number;
  };

  reminders?: {
    day: number;
    times: string[];
  }[];

  isDarkMode?: boolean;
  isStudyAlarm?: boolean;

  avatarImageFile?: File;
};

export function mapEditFormToUpdateDto(
  form: EditableProfile
): UpdateMyProfileDto {
  return {
    nickname: form.username,
    bio: form.bio || null,
    preferredLanguage: form.preferred_language,
    isPublic: !form.hideMyPage,

    userGoals: {
      // 🔹 문자열로 관리되던 걸 number로 변환해서 서버로 보냄
      studyTimeByLanguage:
        form.studyTimeByLanguage &&
        Object.keys(form.studyTimeByLanguage).length > 0
          ? Object.fromEntries(
              Object.entries(form.studyTimeByLanguage).map(([lang, value]) => [
                lang,
                Number(value),
              ])
            )
          : undefined,

      dailyMinimumStudyMinutes:
        form.dailyMinimumStudyMinutes === ""
          ? undefined
          : Number(form.dailyMinimumStudyMinutes),

      weeklyStudyGoalMinutes:
        form.weeklyStudyGoalMinutes === ""
          ? undefined
          : Number(form.weeklyStudyGoalMinutes),
    },
    reminders: form.reminders ?? [],

    isDarkMode: form.isDarkMode,
    isStudyAlarm: form.enableStudyReminder,

    avatarImageFile: form.avatarImageFile ?? undefined,
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
            dto.goals.dailyMinimumStudyMinutes ?? undefined,
          weeklyStudyGoalMinutes: dto.goals.weeklyStudyGoalMinutes ?? undefined,
          reminderTimes:
            dto.goals.reminderTimes && dto.goals.reminderTimes.length > 0
              ? dto.goals.reminderTimes
              : undefined,
          isReminderEnabled: dto.goals.isReminderEnabled,
        }
      : undefined,

    achievements: [],
    isStudyAlarm: dto.isStudyAlarm,
    isDarkMode: dto.isDarkMode,
    reminders: dto.reminders ?? [],
  };
}

export async function getUserProfile(nickname: string): Promise<UserProfile> {
  try {
    const res = await api.get<UserProfileDto>(`/mypage/${nickname}`);
    console.log("user profile fetched:", res.data);
    console.log("mapped data : ", mapUserProfileDto(res.data));
    return mapUserProfileDto(res.data);
  } catch (err) {
    console.log("❌ getUserProfile 에러 발생, 더미 프로필로 대체:", err);
    return getDummyUserProfile("LEARNER");
  }
}

export async function getMyProfile(): Promise<UserProfile> {
  try {
    const res = await api.get<UserProfileDto>("/mypage");
    return mapUserProfileDto(res.data);
  } catch (err: any) {
    // 1차 시도 실패: 프로필이 없는 경우(404) → 생성 시도 후 다시 GET
    if (err) {
      try {
        await api.post("/mypage/initialize");
        const retryRes = await api.get<UserProfileDto>("/mypage");
        console.log("user profile created & fetched:", retryRes.data);
        return mapUserProfileDto(retryRes.data);
      } catch (retryErr) {
        console.log("❌ getMyProfile: 프로필 생성 또는 재조회 실패:", retryErr);
      }
    } else {
      console.log("❌ getMyProfile 에러:", err);
    }

    // 최종 실패 시 더미 프로필 반환
    console.log("❌ getMyProfile 에러 발생, 더미 프로필로 대체:", err);
    return getDummyUserProfile("LEARNER");
  }
}

// 내 프로필 업데이트 (PATCH /api/mypage)
export async function updateMyProfile(payload: UpdateMyProfileDto | FormData) {
  const res = await api.patch("/mypage", payload);
  return res.data;
}
