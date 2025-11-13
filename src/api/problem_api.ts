// 타입과 인터페이스 정의
import { ALL_AVAILABLE_TAGS } from "./dummy/problem_dummy";
export type UserProblemStatus = "solved" | "attempted" | "none";
export interface IProblem {
  // 공통 / 요약 정보
  id: number;
  title: string;
  difficulty: string;
  views: number;
  uploadDate: string;
  solvedCount: number;
  successRate: string;
  userStatus: UserProblemStatus;

  // ProblemList 전용 필드
  summary?: string;

  // ProblemDetail 전용 필드
  author?: string;
  timeLimit?: string;
  memoryLimit?: string;
  allowedLanguages?: string[];
  description?: string;
  inputDescription?: string;
  outputDescription?: string;
  examples: IIOExample[];
  hint?: string;
  source?: string;
  userAttempts?: number;
  userSuccessRate?: string;
  tags?: string[];
}
export interface FetchProblemParams {
  sortType: string;
  searchTerm?: string;
  isLoggedIn: boolean;
  page?: number;
  size?: number;
  tags?: string[];
  //filterStatus 속성도 필요할 수 있으므로 추가
  filterStatus?: string;
}

export interface IIOExample {
  input: string;
  output: string;
}
// api함수들
export async function getProblemDetail(problemId: string): Promise<IProblem> {
  const { data } = await axios.get<IProblem>(`api/problems/${problemId}`);
  return data;
}

export async function increaseView(problemId: string): Promise<void> {
  await axios.post(`/problems/${problemId}/view`);
}
export async function fetchProblems({
  sortType,
  searchTerm,
  isLoggedIn,
  page = 1,
  size = 50,
  tags,
  filterStatus,
}: FetchProblemParams): Promise<IProblem[]> {
  const qs = new URLSearchParams({
    sort: sortType,
    q: searchTerm ?? "",
    page: String(page),
    size: String(size),
  });

  //tags가 있을 경우 URLSearchParams에 추가
  if (tags && tags.length > 0) {
    // 배열을 쉼표로 연결하거나, API 스펙에 맞게 처리
    qs.set("tags", tags.join(","));
  }

  // filterStatus가 있을 경우 URLSearchParams에 추가
  if (filterStatus) {
    qs.set("filterStatus", filterStatus);
  }

  const res = await fetch(`/api/problems?${qs.toString()}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch problems");

  const data: IProblem[] = await res.json();

  return isLoggedIn ? data : data.map((p) => ({ ...p, userStatus: "none" }));
}

//테그
export async function fetchAvailableTags(): Promise<string[]> {
  // 실제 API 통신 코드는 주석 처리, 더미 데이터 반환
  return Promise.resolve(ALL_AVAILABLE_TAGS);
}
