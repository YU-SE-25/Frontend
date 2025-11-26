import { api } from "./axios";

// 1. 목록 조회 DTO

export interface ProblemListItemDto {
  problemId: number;
  title: string;
  tags: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  viewCount: number;
  createdAt: string;

  // 추가 4개 필드
  userStatus: "SOLVED" | "ATTEMPTED" | "NONE";
  summary: string;
  solvedCount: number;
  successRate: number;
}

// 2. 문제 상세 조회 DTO

export interface ProblemDetailDto {
  problemId: number;
  createdByNickname: string;
  title: string;
  description: string;
  inputOutputExample: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number;
  memoryLimit: number;
  visibility: "PUBLIC" | "PRIVATE";
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  hint: string;
  source: string;

  totalSubmissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;

  canEdit: boolean;
}

// 3. 문제 등록 DTO

export interface ProblemRegisterPayload {
  title: string;
  description: string;
  inputOutputExample: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number;
  memoryLimit: number;
  visibility: "PUBLIC" | "PRIVATE";
  tags: string[];
  hint: string;
  source: string;
  testcases?: File[]; // 임시 추가됨
}

// 프론트에서 사용하는 통합 IProblem 타입

export interface IProblem {
  // 목록 공통
  problemId: number;
  title: string;
  tags: string[];
  difficulty: string;
  viewCount: number;
  createdAt: string;

  // 목록용
  summary?: string;
  solvedCount?: number;
  successRate?: string;
  userStatus?: "SOLVED" | "ATTEMPTED" | "NONE";

  // 상세용
  description?: string;
  inputOutputExample?: string;
  author?: string;
  timeLimit?: number;
  memoryLimit?: number;
  visibility?: string;
  hint?: string;
  source?: string;
  canEdit?: boolean;
}

// Mapper — DTO → IProblem 변환

export function mapListDtoToProblem(dto: ProblemListItemDto): IProblem {
  return {
    problemId: dto.problemId,
    title: dto.title,
    tags: dto.tags,
    difficulty: dto.difficulty,
    viewCount: dto.viewCount,
    createdAt: dto.createdAt.slice(0, 10),

    summary: dto.summary,
    solvedCount: dto.solvedCount,
    successRate: dto.successRate + "%",
    userStatus: dto.userStatus,
  };
}

export function mapDetailDtoToProblem(dto: ProblemDetailDto): IProblem {
  return {
    problemId: dto.problemId,
    title: dto.title,
    tags: dto.tags,
    difficulty: dto.difficulty,
    viewCount: dto.viewCount,
    createdAt: dto.createdAt.slice(0, 10),

    description: dto.description,
    inputOutputExample: dto.inputOutputExample,
    author: dto.createdByNickname,
    timeLimit: dto.timeLimit,
    memoryLimit: dto.memoryLimit,
    visibility: dto.visibility,
    hint: dto.hint,
    source: dto.source,
    summary: dto.description.slice(0, 50) + "...",
    solvedCount: dto.acceptedSubmissions,
    successRate: dto.acceptanceRate + "%",

    canEdit: dto.canEdit,
    userStatus: "NONE",
  };
}

// 6. 문제 API 호출 함수들

// 태그 목록(임시)
export async function fetchAvailableTags(): Promise<string[]> {
  const res = await api.get<string[]>("/problems/tags");
  return res.data;
}

// 문제 목록 조회
export async function fetchProblems(): Promise<IProblem[]> {
  const res = await api.get<{ content: ProblemListItemDto[] }>("/problems");
  return res.data.content.map(mapListDtoToProblem);
}

// 문제 상세 조회
export async function fetchProblemDetail(problemId: number): Promise<IProblem> {
  const res = await api.get<ProblemDetailDto>(`/problems/detail/${problemId}`);
  return mapDetailDtoToProblem(res.data);
}

// 문제 등록 (테스트케이스 포함)
export async function registerProblem(
  payload: ProblemRegisterPayload
): Promise<number> {
  const fd = new FormData();

  fd.append("title", payload.title);
  fd.append("description", payload.description);
  fd.append("inputOutputExample", payload.inputOutputExample);
  fd.append("difficulty", payload.difficulty);
  fd.append("timeLimit", String(payload.timeLimit));
  fd.append("memoryLimit", String(payload.memoryLimit));
  fd.append("visibility", payload.visibility);
  fd.append("hint", payload.hint);
  fd.append("source", payload.source);

  payload.tags.forEach((tag) => fd.append("tags", tag));

  if (payload.testcases) {
    payload.testcases.forEach((f) => fd.append("testcases", f));
  }

  const res = await api.post<{ problemId: number }>("/problems/register", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.problemId;
}
