import { api } from "./axios";
import type { RefreshResponse } from "../atoms";

// 회원가입 요청 타입
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
  phone: string;
  role: "LEARNER" | "INSTRUCTOR" | "MANAGER";
  agreedTerms: string[];
  portfolioFileUrl: string | null;
  originalFileName: string | null;
  fileSize: number | null;
  portfolioLinks: string[];
}

//비밀번호 타입
export interface SendResetCodeResponse {
  message: string;
}

export interface VerifyResetCodeResponse {
  resetToken: string;
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Auth 관련 모든 요청을 한 곳에서 관리
export const AuthAPI = {
  // 0. 블랙리스트 체크
  checkBlacklist: (name: string, email: string, phone: string) =>
    api.post<{ isBlacklisted: boolean }>("/auth/check/blacklist", {
      name,
      email,
      phone,
    }),

  // 1. 이메일 중복확인
  checkEmail: (email: string) => api.post<void>("/auth/check/email", { email }),

  // 2. 닉네임 중복확인
  checkNickname: (nickname: string) =>
    api.post<void>("/auth/check/nickname", { nickname }),

  // 3. 전화번호 중복확인
  checkPhone: (phone: string) => api.post<void>("/auth/check/phone", { phone }),

  // 4. 동일 인물 계정 확인
  checkDuplicateAccount: (name: string, phoneNumber: string) =>
    api.post<void>("/auth/check/duplicate-account", { name, phoneNumber }),

  // 5. 회원가입
  register: (data: RegisterRequest) => api.post<void>("/auth/register", data),

  // 6. 이메일 인증 링크 발송
  sendEmailVerify: (email: string) =>
    api.post<void>("/auth/email/send-link", { email }),

  // 토큰 재발급 (postRefresh 대체)
  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    return api
      .post<RefreshResponse>("/auth/refresh", { refreshToken })
      .then((res) => res.data);
  },

  // 비밀번호 재설정 관련
  // 1) 이메일로 인증번호 발송
  sendResetCode: async (email: string): Promise<SendResetCodeResponse> => {
    try {
      const res = await api.post<SendResetCodeResponse>(
        "/auth/password/send-reset-code",
        { email }
      );
      return res.data;
    } catch (err) {
      return { message: "[MOCK] 인증번호가 발송된 것처럼 처리합니다." };
    }
  },

  // 2) 인증번호 검증 → resetToken 반환
  verifyResetCode: async (
    email: string,
    code: string
  ): Promise<VerifyResetCodeResponse> => {
    try {
      const res = await api.post<VerifyResetCodeResponse>(
        "/auth/password/verify-reset-code",
        { email, code }
      );
      return res.data;
    } catch (err) {
      return {
        resetToken: "MOCK_TOKEN_123456",
        message: "[MOCK] 인증 성공",
      };
    }
  },

  // 3) 최종 비밀번호 재설정
  resetPassword: async (
    token: string,
    pw: string,
    pwConfirm: string
  ): Promise<ResetPasswordResponse> => {
    try {
      const res = await api.put<ResetPasswordResponse>("/auth/password/reset", {
        resetToken: token,
        newPassword: pw,
        newPasswordConfirm: pwConfirm,
      });
      return res.data;
    } catch (err) {
      return { message: "[MOCK] 비밀번호가 변경된 것처럼 처리합니다." };
    }
  },
};
