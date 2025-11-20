import axios from "axios";

// 채점 상태 타입 (서버가 주는 그대로)
export interface IGradingStatus {
  status: string;

  // 진행중일 때
  currentTestCase?: number;
  totalTestCases?: number;

  // 성공/실패일 때
  runtime?: number;
  memory?: number;
  passedTestCases?: number;
  failedTestCase?: number;
}

// Axios 인스턴스 설정
const API = axios.create({
  baseURL: "/api/UNIDE/submission",
  withCredentials: true,
});

// 제출된 코드의 채점 상태 조회
export const getSubmissionStatus = (submissionId: number) =>
  API.get<IGradingStatus>(`/${submissionId}/status`).then((res) => res.data);
