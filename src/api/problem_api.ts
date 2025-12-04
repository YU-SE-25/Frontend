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
  createdByNickname: string;
  userStatus: "SOLVED" | "ATTEMPTED" | "NOT_SOLVED";
  summary: string;
  solverCount: number;
  correctRate: number;
}

// (상세는 스펙 안 줬으니 기존 그대로 두되, 필요하면 나중에 또 맞추자!)
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

// 백엔드 POST /api/problems/register 요청 DTO에 맞춤
export interface ProblemRegisterPayload {
  title: string;
  description: string;
  inputOutputExample: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number;
  memoryLimit: number;

  // visibility → status 로 변경
  // ex) "PENDING" 하나만 쓸 수도 있고, 나중에 enum 늘어나면 여기에 추가
  status: "PENDING" | "APPROVED" | "REJECTED";

  tags: string[];
  hint: string;
  source: string;

  // testcases(File[]) → testcaseFile(string) 로 변경
  testcaseFile: string;
}

// UI에서 쓰는 통합 타입(조금 느슨하게 둬도 됨)
export interface IProblem {
  problemId: number;
  title: string;
  tags: string[];
  difficulty: string;
  viewCount: number;
  createdAt: string;
  status?: string;

  summary?: string;
  solvedCount?: number;
  successRate?: string;
  // UI 쪽은 "NONE" 계속 써도 되고, DTO에서 "NOT_SOLVED" → "NONE" 변환
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

// 리스트용 DTO → UI용 IProblem 매핑
export function mapListDtoToProblem(dto: ProblemListItemDto): IProblem {
  return {
    problemId: dto.problemId,
    title: dto.title,
    tags: dto.tags,
    difficulty: dto.difficulty,
    viewCount: dto.viewCount,
    createdAt: dto.createdAt.slice(0, 10),

    summary: dto.summary,

    solvedCount: dto.solverCount,

    successRate: Math.round(dto.correctRate * 100) + "%",

    userStatus: dto.userStatus === "NOT_SOLVED" ? "NONE" : dto.userStatus,
  };
}

// 상세 DTO → IProblem 매핑 (여긴 기존 로직 유지)
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

//스터디 그룹 문제 목록 생성 시 사용되는 타입
export interface SimpleProblem {
  problemId: number;
  problemTitle: string;
}

export const TAG_LABEL_MAP: Record<string, string> = {
  IMPLEMENTATION: "구현",
  SORTING: "정렬",
  PRIORITY_QUEUE: "우선순위 큐",
  GRAPH: "그래프",
  DFS: "DFS",
  BFS: "BFS",
  DP: "DP",
  GREEDY: "그리디",
  BINARY_SEARCH: "이진탐색",
  TWO_POINTER: "투 포인터",
  SLIDING_WINDOW: "슬라이딩 윈도우",
  STACK: "스택",
  QUEUE: "큐",
  HASH: "해시",
  STRING: "문자열",
  MATH: "수학",
  SIMULATION: "시뮬레이션",
  BRUTE_FORCE: "브루트 포스",
  BACKTRACKING: "백트래킹",
  TREE: "트리",
};

// 태그 목록
export async function fetchAvailableTags(): Promise<string[]> {
  try {
    const res = await api.get("/problems/tags");
    console.log("TAG RAW:", res.data);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// 문제 목록 조회 (엔드포인트 /problems/list 로 맞춤)
export async function fetchProblems(): Promise<IProblem[]> {
  try {
    const res = await api.get<{
      content: ProblemListItemDto[];
    }>("/problems/list");

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

    const dummy = await fetchDummyProblemDetail(problemId);
    return dummy;
  }
}

// 문제 등록 (이제 JSON 바디로 보낸다고 가정)
export async function registerProblem(
  payload: ProblemRegisterPayload
): Promise<number> {
  try {
    const res = await api.post<{
      message: string;
      problemId: number;
      timestamp: string;
    }>("/problems/register", payload);

    return res.data.problemId;
  } catch (err) {
    console.error("문제 등록 실패 → 더미 ProblemId 99999 반환");
    return 99999;
  }
}

//스터디 그룹용 문제 목록 띄우기
export interface SimpleProblem {
  problemId: number;
  problemTitle: string;
}

export async function fetchSimpleProblems(): Promise<SimpleProblem[]> {
  try {
    const res = await api.get<{
      content: {
        problemId: number;
        title: string;
      }[];
    }>("/problems/list");

    return res.data.content.map((p) => ({
      problemId: p.problemId,
      problemTitle: p.title,
    }));
  } catch (err) {
    console.error("문제 목록 조회 실패 → 더미 사용");
    return [
      { problemId: 1, problemTitle: "더미 문제 1" },
      { problemId: 2, problemTitle: "더미 문제 2" },
    ];
  }
}
