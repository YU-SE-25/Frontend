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

//응답 인터셉터 (AccessToken 만료 → 자동 재발급)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // 1) 로그인 요청에서 발생한 401 → 토큰 재발급 금지!
    if (original?.url === "/auth/login") {
      return Promise.reject(error);
    }

    // 2) 리프레시 자체가 401 → 더 반복하면 무한루프라 금지
    if (original?.url === "/auth/refresh") {
      return Promise.reject(error);
    }

    // 3) Access Token 만료
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = store.get(refreshTokenAtom);
      if (!refreshToken) throw error; // 리프레시도 없으면 그대로 에러

      // 새 토큰 재발급 API 호출
      const refreshResponse = await AuthAPI.refresh(refreshToken);

      // jotai 상태 업데이트 (새 AccessToken 저장)
      store.set(refreshActionAtom, refreshResponse);
      localStorage.setItem("accessToken", refreshResponse.accessToken);

      // 원래 요청에 새 토큰 삽입해서 재요청
      original.headers[
        "Authorization"
      ] = `Bearer ${refreshResponse.accessToken}`;

      return api(original);
    }

    // 4) 다른 에러면 그대로 던짐
    throw error;
  }
);
