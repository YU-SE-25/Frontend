import axios from "axios";
import { getDefaultStore } from "jotai";
import { refreshTokenAtom, refreshActionAtom } from "../atoms";
import { AuthAPI } from "../api/auth_api";

const store = getDefaultStore();

export const api = axios.create({
  baseURL: "/api",
});

//요청 인터셉터 (AccessToken 붙이기)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 로컬스토리지에서 읽음
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (AccessToken 만료 → 자동 재발급)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // 로그인/리프레시 요청 자체는 제외
    if (original?.url === "/auth/login") return Promise.reject(error);
    if (original?.url === "/auth/refresh") return Promise.reject(error);

    // 401이고, 아직 재시도 안했으면
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      // refreshToken 가져오기
      let refreshToken = store.get(refreshTokenAtom);
      if (!refreshToken) {
        refreshToken = localStorage.getItem("refreshToken") || null;
      }

      if (!refreshToken) return Promise.reject(error);

      try {
        // 새로운 accessToken 발급
        const refreshResponse = await AuthAPI.refresh(refreshToken);

        // jotai 업데이트
        store.set(refreshActionAtom, refreshResponse);
        localStorage.setItem("accessToken", refreshResponse.accessToken);

        // 🔥 핵심: 절대경로 URL → 상대경로로 변환 (프록시 깨짐 방지)
        const relativeUrl = original.url.replace(/^https?:\/\/[^/]+/, "");

        // 원래 요청 재시도
        return api({
          ...original,
          url: relativeUrl, // 수정된 URL
          baseURL: "/api",
          headers: {
            ...original.headers,
            Authorization: `Bearer ${refreshResponse.accessToken}`,
          },
        });
      } catch (e) {
        // refresh 실패 → 강제 로그아웃 (단, 회원가입 과정은 제외)
        const path = window.location.pathname;
        const isRegisterFlow =
          path.startsWith("/register") ||
          path === "/register-success" ||
          path === "/auth/verify-success";

        if (!isRegisterFlow) {
          localStorage.clear();
          window.location.href = "/login";
        }
        return;
      }
    }

    return Promise.reject(error);
  }
);
