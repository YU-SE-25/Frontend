//API 요청마다 토큰를 활용
import axios from "axios";
import { getDefaultStore } from "jotai";
import { accessTokenAtom, refreshTokenAtom, refreshActionAtom } from "./atoms";
import { AuthAPI } from "./api/auth_api"; // 토큰 재발급 API

const store = getDefaultStore();
// axios 기본 인스턴스 생성
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// 모든 요청이 서버로 나가기 전에 이 함수가 먼저 실행
api.interceptors.request.use((config) => {
  const token = store.get(accessTokenAtom);
  config.headers = config.headers ?? {};
  // accessToken이 존재하면 Authorization 헤더에 붙임
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 서버 응답이 돌아올 때마다 실행
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    // 401: Access Token 만료 시
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = store.get(refreshTokenAtom);
      if (!refreshToken) throw error;

      // refreshToken으로 새 accessToken 발급 요청
      const refreshResponse = await AuthAPI.refresh(refreshToken);
      // 새로 받은 토큰을 jotai 상태에 반영
      store.set(refreshActionAtom, refreshResponse);
      // 요청 헤더 갱신
      original.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
      return api(original);
    }
    throw error;
  }
);
// 모든 설정이 끝난 axios 인스턴스를 export
// → import api from "./axiosInstance" 해서 쓰면 됨
export default api;
