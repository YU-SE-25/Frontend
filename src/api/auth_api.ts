import axios from "axios";
import type { RefreshResponse } from "../atoms";

// 토큰 재발급 API
export const postRefresh = async (
  refreshToken: string
): Promise<RefreshResponse> => {
  const response = await axios.post<RefreshResponse>(
    "http://localhost:8080/api/auth/refresh",
    {
      refreshToken,
    }
  );
  // 서버 응답 구조에 따라 아래 부분 수정
  return response.data;
};
