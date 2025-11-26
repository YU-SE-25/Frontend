import type { IProblem } from "./../problem_api";

// ===================== 타입 정의 =====================

export type ReviewComment = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
};

export type Review = {
  id: number;
  lineNumber: number;
  content: string;
  author: string;
  createdAt: string;
  comments: ReviewComment[];
};

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

// ===================== 더미 데이터 =====================

const dummyCode = `
#include <stdio.h>
int main() {
  int sum = 0;
  for (int i = 1; i <= 5; i++) sum += i;
  printf("Total: %d\\n", sum);
  return 0;
}
`.trim();

const dummyProblem: IProblem = {
  problemId: 1,
  title: "1부터 N까지 합 구하기",
  tags: ["구현", "수학"],
  difficulty: "Bronze",
  viewCount: 1234,
  createdAt: "2025-11-26",
  description: "1부터 N까지의 합을 구하는 프로그램을 작성하시오.",
  inputOutputExample: "입력: 5\n출력: 15",
  author: "gamppe",
  timeLimit: 1,
  memoryLimit: 512,
  visibility: "PUBLIC",
  hint: "가우스의 공식을 떠올려 보자.",
  source: "UnIDE 더미 문제집",
  summary: "1부터 N까지의 합을 구하는 기본 구현 문제입니다.",
  solvedCount: 321,
  successRate: "78%",
  canEdit: false,
  userStatus: "SOLVED",
};

// ===================== ✅ 문제별 풀이 더미 =====================

const dummySolutionsByProblem: Record<number, MySolvedCodeResponse[]> = {
  1: [
    {
      solutionId: 1,
      code: dummyCode,
      language: "C++",
      problem: dummyProblem,
      isShared: true,
      createdAt: "2025-11-26 14:32",
      memoryUsage: 18.4,
      executionTime: 12.7,
    },
    {
      solutionId: 2,
      code: `
n = int(input())
print(sum(range(1, n + 1)))
`.trim(),
      language: "Python",
      problem: dummyProblem,
      isShared: false,
      createdAt: "2025-11-25 18:10",
      memoryUsage: 22.1,
      executionTime: 9.2,
    },
  ],
};

// ===================== 리뷰 더미 =====================

const dummyReviewsBySolution: Record<number, Review[]> = {
  1: [
    {
      id: 1,
      lineNumber: 3,
      content:
        "sum 초기값을 0으로 둔 점은 좋습니다. const로 선언해도 좋을 것 같아요.",
      author: "reviewer01",
      createdAt: "2025-11-26 13:40",
      comments: [
        {
          id: 1,
          author: "helper01",
          content: "동의합니다. 가독성이 더 좋아지네요.",
          createdAt: "2025-11-26 13:42",
        },
      ],
    },
    {
      id: 2,
      lineNumber: 4,
      content: "반복 범위를 입력값 기반으로 바꾸면 더 일반화할 수 있습니다.",
      author: "reviewer02",
      createdAt: "2025-11-25 09:12",
      comments: [],
    },
  ],
};

// ===================== 더미 API 구현 =====================

/**
 * ✅ 내 제출 코드 + 문제 정보 + 공유 여부
 * → 현재는 "첫 번째 풀이 = 내 풀이"로 간주
 */
export async function fetchMySolvedCode(
  problemId: number
): Promise<MySolvedCodeResponse> {
  const list = dummySolutionsByProblem[problemId] ?? [];

  if (list.length === 0) {
    throw new Error("해당 문제에 대한 풀이가 없습니다.");
  }

  return list[0];
}

/**
 * ✅ 특정 풀이에 대한 코드 리뷰 목록
 */
export async function fetchSolutionReviews(
  solutionId: number
): Promise<Review[]> {
  return dummyReviewsBySolution[solutionId] ?? [];
}

/**
 * ✅ 내 풀이 공유 여부 토글
 */
export async function updateShareMyCode(
  solutionId: number,
  shared: boolean
): Promise<void> {
  for (const problemId in dummySolutionsByProblem) {
    const list = dummySolutionsByProblem[Number(problemId)];
    const target = list.find((s) => s.solutionId === solutionId);
    if (target) {
      target.isShared = shared;
      return;
    }
  }
}

/**
 * ✅ 공유된 풀이 목록
 */
export async function fetchSharedSolvedList(
  problemId: number
): Promise<MySolvedCodeResponse[]> {
  const list = dummySolutionsByProblem[problemId] ?? [];
  return list.filter((s) => s.isShared);
}
