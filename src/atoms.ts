//상태 저장 + 로그인 유지 + 토큰 갱신 정보 관리
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const getInitialIsDark = () => {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem("theme:isDark");
  if (saved === "true") return true;
  if (saved === "false") return false;
  return false;
};

export const isDarkAtom = atom<boolean>(getInitialIsDark());

// 사용자 프로필 정보
export interface UserProfile {
  userId: number;
  nickname: string;
  role: "MANAGER" | "INSTRUCTOR" | "LEARNER";
}

// 로그인 응답
export interface LoginResponse {
  accessToken: string;
  refreshToken: string; // 로그인시에만 refreshToken 옴
  expiresIn: number;
  user: UserProfile;
}

// refresh 응답 (refreshToken 없음!!)
export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

// 테마 토글
export const toggleThemeActionAtom = atom(null, (get, set) => {
  set(isDarkAtom, (prev) => !prev);
});

// 저장되는 상태들
export const accessTokenAtom = atomWithStorage<string | null>(
  "accessToken",
  null
);

export const accessTokenExpiresInAtom = atom<number | null>(null);

export const refreshTokenAtom = atomWithStorage<string | null>(
  "refreshToken",
  null
);

export const userProfileAtom = atomWithStorage<UserProfile | null>(
  "userProfile",
  null
);

// 로그인 여부
export const isLoggedInAtom = atom((get) => {
  return !!get(accessTokenAtom) && !!get(userProfileAtom);
});

// 로그인 액션
export const loginActionAtom = atom(null, (get, set, data: LoginResponse) => {
  set(accessTokenAtom, data.accessToken);
  set(refreshTokenAtom, data.refreshToken); // 로그인에서는 저장 OK
  set(accessTokenExpiresInAtom, data.expiresIn);
  set(userProfileAtom, data.user);
});

// 로그아웃 액션
export const logoutActionAtom = atom(null, (get, set) => {
  set(accessTokenAtom, null);
  set(refreshTokenAtom, null);
  set(accessTokenExpiresInAtom, null);
  set(userProfileAtom, null);
});

// refresh 액션 (여기가 핵심!!)
export const refreshActionAtom = atom(
  null,
  (get, set, data: RefreshResponse) => {
    set(accessTokenAtom, data.accessToken);
    set(accessTokenExpiresInAtom, data.expiresIn);

    // refreshToken 저장하지 않는다
    // 왜냐면 백엔드 refresh 응답에는 refreshToken이 없기 때문
  }
);

// **********************************************
isDarkAtom.debugLabel = "Is Dark Mode";
toggleThemeActionAtom.debugLabel = "Toggle Theme Action";

accessTokenAtom.debugLabel = "Access Token";
refreshTokenAtom.debugLabel = "Refresh Token";
accessTokenExpiresInAtom.debugLabel = "Access Token ExpiresIn";

userProfileAtom.debugLabel = "User Profile";
isLoggedInAtom.debugLabel = "Is Logged In";

loginActionAtom.debugLabel = "Login Action";
logoutActionAtom.debugLabel = "Logout Action";
refreshActionAtom.debugLabel = "Refresh Action";
