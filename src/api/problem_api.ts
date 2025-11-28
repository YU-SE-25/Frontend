import { api } from "./axios";

import {
  DUMMY_PROBLEM_LIST,
  fetchDummyProblemDetail,
} from "../api/dummy/problem_dummy_new";

export interface ProblemListItemDto {
  problemId: number;
  title: string;
  tags: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  viewCount: number;
  createdAt: string;

  userStatus: "SOLVED" | "ATTEMPTED" | "NONE";
  summary: string;
  solvedCount: number;
  successRate: number;
}

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
  allowedLanguages: string[];
}

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
  testcases?: File[];
}

export interface IProblem {
  problemId: number;
  title: string;
  tags: string[];
  difficulty: string;
  viewCount: number;
  createdAt: string;

  summary?: string;
  solvedCount?: number;
  successRate?: string;
  userStatus?: "SOLVED" | "ATTEMPTED" | "NONE";

  description?: string;
  inputOutputExample?: string;
  author?: string;
  timeLimit?: number;
  memoryLimit?: number;
  visibility?: "PUBLIC" | "PRIVATE" | undefined;
  hint?: string;
  source?: string;
  canEdit?: boolean;
  allowedLanguages?: string[];
}

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
    allowedLanguages: dto.allowedLanguages,
  };
}

// 태그 목록
export async function fetchAvailableTags(): Promise<string[]> {
  try {
    const res = await api.get<string[]>("/problems/tags");
    return res.data;
  } catch (err) {
    console.error("태그 조회 실패 → 더미 NONE 반환");
    return []; // 태그 더미 없으니 빈 배열 반환!
  }
}

// 문제 목록 조회
export async function fetchProblems(): Promise<IProblem[]> {
  try {
    const res = await api.get<{ content: ProblemListItemDto[] }>("/problems");

    if (!res.data?.content) throw new Error("empty");

    return res.data.content.map(mapListDtoToProblem);
  } catch (err) {
    console.error("문제 목록 API 실패 → 더미 목록 사용!");

    // 더미 목록을 mapListDtoToProblem 구조로 변환
    return DUMMY_PROBLEM_LIST.map(mapListDtoToProblem);
  }
}

// 문제 상세 조회
export async function fetchProblemDetail(problemId: number): Promise<IProblem> {
  try {
    const res = await api.get<ProblemDetailDto>(
      `/problems/detail/${problemId}`
    );

    return mapDetailDtoToProblem(res.data);
  } catch (err) {
    console.error("문제 상세 조회 실패 → 더미 상세로 fallback!");

    // 기존 dummy 함수가 하나만 받아서 상세 리턴할 때 그대로 반환
    const dummy = await fetchDummyProblemDetail(problemId);
    return dummy;
  }
}

// 문제 등록 (테스트케이스 포함)
export async function registerProblem(
  payload: ProblemRegisterPayload
): Promise<number> {
  try {
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

    const res = await api.post<{ problemId: number }>(
      "/problems/register",
      fd,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data.problemId;
  } catch (err) {
    console.error("문제 등록 실패 → 더미 ProblemId 99999 반환");
    return 99999; // 문제 등록 실패 시 더미 아이디
  }
}
