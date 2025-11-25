//상태 저장 + 로그인 유지 + 토큰 갱신 정보 관리
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const isDarkAtom = atom<boolean>(true);

//사용자 프로필 정보
export interface UserProfile {
  userId: number;
  nickname: string;
  role: "MANAGER" | "INSTRUCTOR" | "LEARNER"; // 백앤드코드에 따라 수정했어요!
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // 만료 시간 (초 단위)
  user: UserProfile;
}
//토큰 갱신
export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

//테마 토글버튼
export const toggleThemeActionAtom = atom(null, (get, set) => {
  set(isDarkAtom, (prev) => !prev);
});

export const accessTokenAtom = atomWithStorage<string | null>(
  "accessToken",
  null
);
//만료 시간 (재발급 로직에 사용)
export const accessTokenExpiresInAtom = atom<number | null>(null);
// Local Storage에 영구 저장 (로그인 유지의 핵심!) 브라우저를 껐다 켜도 유지됨
export const refreshTokenAtom = atomWithStorage<string | null>(
  "refreshToken",
  null
);
//사용자의 최소 정보
export const userProfileAtom = atomWithStorage<UserProfile | null>(
  "userProfile",
  null
);
//로그인 여부 판단: accessToken이 존재하고 userProfile이 있으면 true
export const isLoggedInAtom = atom((get) => {
  return !!get(accessTokenAtom) && !!get(userProfileAtom);
});

//로그인
export const loginActionAtom = atom(null, (get, set, data: LoginResponse) => {
  set(accessTokenAtom, data.accessToken);
  set(refreshTokenAtom, data.refreshToken);
  set(accessTokenExpiresInAtom, data.expiresIn);
  set(userProfileAtom, data.user);
});
//로그아웃
export const logoutActionAtom = atom(null, (get, set) => {
  // 모든 상태를 null로 초기화합니다.
  set(accessTokenAtom, null);
  set(refreshTokenAtom, null);
  set(accessTokenExpiresInAtom, null);
  set(userProfileAtom, null);
});
//토큰 갱신
export const refreshActionAtom = atom(
  null,
  (get, set, data: RefreshResponse) => {
    // Access Token과 만료 시간만 업데이트합니다.
    set(accessTokenAtom, data.accessToken);
    set(accessTokenExpiresInAtom, data.expiresIn);
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
