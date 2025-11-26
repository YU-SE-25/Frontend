// 지금은 그냥 더미 전달하는용..

import type { Review } from "./dummy/solution_dummy";

import {
  fetchMySolvedCode as fetchMySolvedCodeDummy,
  fetchSolutionReviews as fetchSolutionReviewsDummy,
  updateShareMyCode as updateShareMyCodeDummy,
  fetchSharedSolvedList as fetchSharedSolvedListDummy,
} from "./dummy/solution_dummy";
import type { IProblem } from "./problem_api";

export type MySolvedCodeResponse = {
  solutionId: number;
  code: string;
  language: string;
  problem: IProblem | null;
  isShared: boolean;
  createdAt: string;
  memoryUsage: number;
  executionTime: number;
};
// ===================== 내 최신 풀이 =====================

export async function fetchMySolvedCode(
  problemId: number
): Promise<MySolvedCodeResponse | null> {
  return fetchMySolvedCodeDummy(problemId);
}

// ===================== 풀이 리뷰 =====================

export async function fetchSolutionReviews(
  solutionId: number
): Promise<Review[]> {
  return fetchSolutionReviewsDummy(solutionId);
}

// ===================== 풀이 공유 여부 변경 =====================

export async function updateShareMyCode(
  solutionId: number,
  shared: boolean
): Promise<void> {
  return updateShareMyCodeDummy(solutionId, shared);
}

// ===================== ✅ 공유된 풀이 목록 =====================

export async function fetchSharedSolvedList(
  problemId: number
): Promise<MySolvedCodeResponse[]> {
  return fetchSharedSolvedListDummy(problemId);
}
