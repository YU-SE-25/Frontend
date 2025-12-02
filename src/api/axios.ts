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
//응답 인터셉터 (AccessToken 만료 → 자동 재발급)
// 응답 인터셉터
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // 로그인 요청 자체가 401이면 그냥 에러
    if (original?.url === "/auth/login") return Promise.reject(error);
    if (original?.url === "/auth/refresh") return Promise.reject(error);

    // 401인데 아직 재시도 안 한 경우 → refresh 시도
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = store.get(refreshTokenAtom);

      // refreshToken 자체가 없으면 → 로그아웃은 하지 말고 그냥 실패만 전달
      if (!refreshToken) return Promise.reject(error);

      try {
        // refresh 시도
        const refreshResponse = await AuthAPI.refresh(refreshToken);

        // 성공 → 토큰 저장 + 원래 요청 재전송
        store.set(refreshActionAtom, refreshResponse);
        localStorage.setItem("accessToken", refreshResponse.accessToken);

        original.headers[
          "Authorization"
        ] = `Bearer ${refreshResponse.accessToken}`;
        return api(original);
      } catch (e) {
        //refresh 실패 → 이때만 강제 로그아웃
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
    }

    // refresh 시도도 아니고 그냥 일반적인 401 → 아무것도 안 함
    // (강제 로그아웃 안 함)
    return Promise.reject(error);
  }
);
