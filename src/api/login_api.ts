//import { api } from "./axios";
import type { LoginResponse } from "../atoms";

interface LoginPayload {
  email: string;
  password: string;
  keepLogin: boolean;
}

//MOCK API
export async function postLogin(data: LoginPayload): Promise<LoginResponse> {
  console.log(`[MOCK API] Post Login Called with: ${JSON.stringify(data)}`);

  // 2초 딜레이 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 실패 조건
  if (data.password === "fail") {
    const error = new Error("사용자 정보가 일치하지 않습니다.");
    (error as any).response = {
      status: 401,
      data: { message: "사용자 정보가 일치하지 않습니다." },
    };
    throw error;
  }

  // 성공 응답 Mock

  // debugging용
  // return {
  //   accessToken: "mock_access_token_123",
  //   refreshToken: "mock_refresh_token_xyz",
  //   expiresIn: 3600,
  //   user: { userId: 1, nickname: "gamppe", role: "LEARNER" },
  // };

  return {
    accessToken: "mock_access_token_123",
    refreshToken: "mock_refresh_token_xyz",
    expiresIn: 3600,
    user: { userId: 1, nickname: "gamppe", role: "INSTRUCTOR" },
  };

  //  return {
  //   accessToken: "mock_access_token_123",
  //   refreshToken: "mock_refresh_token_xyz",
  //   expiresIn: 3600,
  //   user: { userId: 1, nickname: "gamppe", role: "MANAGER" },
  // };
}

/*
// ===== 실제 API 통신 (백엔드 준비 후 활성화) =====

export async function postLogin(data: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
}
*/
