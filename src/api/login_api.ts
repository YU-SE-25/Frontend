import axios from "axios";
import type { LoginResponse, UserProfile } from "../atoms";

interface LoginPayload {
  email: string;
  password: string;
  keepLogin: boolean;
}

export async function postLogin(
  data: LoginPayload,
  apiBaseUrl: string
): Promise<LoginResponse> {
  console.log(`[MOCK API] Post Login Called with: ${JSON.stringify(data)}`);

  // 2초 딜레이 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 2000));
  //여기서 임시 실패 로직을 넣거나, 성공 JSON을 반환합니다.
  if (data.password === "fail") {
    // 임시 오류 발생
    throw {
      response: {
        status: 401,
        data: { message: "사용자 정보가 일치하지 않습니다." },
      },
    };
  }

  // 성공 응답 Mock
  const mockResponse: LoginResponse = {
    accessToken: "mock_access_token_123",
    refreshToken: "mock_refresh_token_xyz",
    expiresIn: 3600,
    user: { userId: 1, nickname: "gamppe", role: "LEARNER" },
  };

  return mockResponse;
}

//실제 API 통신 코드
/*
export async function postLogin(data: LoginPayload, apiBaseUrl: string): Promise<LoginResponse> {
    
    //실제 axios 호출 코드 (서버가 준비되면 이 부분을 사용)
    /* const response = await axios.post<LoginResponse>(
        `${apiBaseUrl}/auth/login`, 
        data
    );
    
    //서버 응답 데이터를 반환합니다.
    return response.data;
}
    */
