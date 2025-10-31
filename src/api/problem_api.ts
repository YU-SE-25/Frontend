// 타입과 인터페이스 정의
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
}: FetchProblemParams): Promise<IProblem[]> {
  const qs = new URLSearchParams({
    sort: sortType,
    q: searchTerm ?? "",
    page: String(page),
    size: String(size),
  });

  const res = await fetch(`/api/problems?${qs.toString()}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch problems");

  const data: IProblem[] = await res.json();

  return isLoggedIn ? data : data.map((p) => ({ ...p, userStatus: "none" }));
}
