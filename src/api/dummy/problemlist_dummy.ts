// src/api/dummy/problemlist_dummy.ts
import type { Problem, FetchProblemParams } from "../problemlist_api";

export const DUMMY_PROBLEMS: Problem[] = [
  {
    id: 1,
    title: "두 수의 합",
    difficulty: "하",
    views: 50,
    summary: "두 정수를 입력받아 합을 구하는 문제",
    uploadDate: "2025-10-24",
    solvedCount: 150,
    successRate: "85%",
    userStatus: "solved",
  },
  {
    id: 2,
    title: "정렬된 배열에서 원소 찾기",
    difficulty: "중",
    views: 120,
    summary: "이진 탐색을 이용하여 특정 값을 찾는 문제",
    uploadDate: "2025-09-19",
    solvedCount: 80,
    successRate: "60%",
    userStatus: "attempted",
  },
  {
    id: 3,
    title: "가장 긴 팰린드롬",
    difficulty: "상",
    views: 80,
    summary: "문자열에서 가장 긴 팰린드롬 부분 문자열을 찾는 문제",
    uploadDate: "2025-09-16",
    solvedCount: 30,
    successRate: "40%",
    userStatus: "none",
  },
  {
    id: 4,
    title: "스택 수열",
    difficulty: "중",
    views: 95,
    summary: "스택을 이용해 수열을 만들 수 있는지 판별하는 문제",
    uploadDate: "2025-09-12",
    solvedCount: 70,
    successRate: "55%",
    userStatus: "solved",
  },
  {
    id: 5,
    title: "괄호의 유효성 검사",
    difficulty: "하",
    views: 140,
    summary: "주어진 괄호 문자열이 올바른지 확인하는 문제",
    uploadDate: "2025-08-28",
    solvedCount: 200,
    successRate: "90%",
    userStatus: "solved",
  },
  {
    id: 6,
    title: "DFS와 BFS",
    difficulty: "중",
    views: 170,
    summary: "그래프를 DFS와 BFS로 탐색하는 문제",
    uploadDate: "2025-08-20",
    solvedCount: 100,
    successRate: "70%",
    userStatus: "attempted",
  },
  {
    id: 7,
    title: "회의실 배정",
    difficulty: "상",
    views: 210,
    summary: "그리디 알고리즘으로 회의실 배정을 최적화하는 문제",
    uploadDate: "2025-08-10",
    solvedCount: 40,
    successRate: "35%",
    userStatus: "none",
  },
  {
    id: 8,
    title: "이진 트리의 높이",
    difficulty: "중",
    views: 88,
    summary: "이진 트리의 루트로부터 높이를 구하는 문제",
    uploadDate: "2025-07-30",
    solvedCount: 120,
    successRate: "75%",
    userStatus: "solved",
  },
  {
    id: 9,
    title: "최대 부분합",
    difficulty: "중",
    views: 150,
    summary: "연속 부분 수열의 합 중 최댓값을 찾는 문제",
    uploadDate: "2025-07-25",
    solvedCount: 95,
    successRate: "68%",
    userStatus: "attempted",
  },
  {
    id: 10,
    title: "버블 정렬 구현",
    difficulty: "하",
    views: 60,
    summary: "버블 정렬 알고리즘을 구현하는 문제",
    uploadDate: "2025-07-22",
    solvedCount: 220,
    successRate: "92%",
    userStatus: "solved",
  },
  {
    id: 11,
    title: "피보나치 수 구하기",
    difficulty: "하",
    views: 300,
    summary: "재귀 또는 DP로 피보나치 수를 구하는 문제",
    uploadDate: "2025-07-15",
    solvedCount: 350,
    successRate: "88%",
    userStatus: "solved",
  },
  {
    id: 12,
    title: "동전 교환",
    difficulty: "중",
    views: 110,
    summary: "주어진 금액을 최소한의 동전으로 거슬러주는 문제",
    uploadDate: "2025-07-08",
    solvedCount: 80,
    successRate: "58%",
    userStatus: "attempted",
  },
  {
    id: 13,
    title: "N-Queen 문제",
    difficulty: "상",
    views: 250,
    summary: "백트래킹을 이용한 N-Queen 배치 문제",
    uploadDate: "2025-06-29",
    solvedCount: 45,
    successRate: "33%",
    userStatus: "none",
  },
  {
    id: 14,
    title: "연속된 자연수의 합",
    difficulty: "하",
    views: 85,
    summary: "정수 N을 연속된 자연수의 합으로 표현하는 문제",
    uploadDate: "2025-06-20",
    solvedCount: 160,
    successRate: "82%",
    userStatus: "solved",
  },
  {
    id: 15,
    title: "트리의 부모 찾기",
    difficulty: "중",
    views: 190,
    summary: "주어진 트리에서 각 노드의 부모를 찾는 문제",
    uploadDate: "2025-06-10",
    solvedCount: 90,
    successRate: "62%",
    userStatus: "attempted",
  },
  {
    id: 16,
    title: "벨만-포드 알고리즘",
    difficulty: "상",
    views: 230,
    summary: "음수 가중치가 있는 그래프에서 최단 경로를 구하는 문제",
    uploadDate: "2025-06-01",
    solvedCount: 25,
    successRate: "28%",
    userStatus: "none",
  },
  {
    id: 17,
    title: "단어 뒤집기",
    difficulty: "하",
    views: 130,
    summary: "문자열의 단어를 공백 기준으로 뒤집는 문제",
    uploadDate: "2025-05-25",
    solvedCount: 210,
    successRate: "87%",
    userStatus: "solved",
  },
  {
    id: 18,
    title: "쇠막대기",
    difficulty: "중",
    views: 115,
    summary: "스택을 이용해 쇠막대기의 잘린 개수를 계산하는 문제",
    uploadDate: "2025-05-17",
    solvedCount: 100,
    successRate: "66%",
    userStatus: "attempted",
  },
  {
    id: 19,
    title: "토마토 익히기",
    difficulty: "상",
    views: 240,
    summary: "BFS를 이용해 토마토가 익는 최소 일수를 구하는 문제",
    uploadDate: "2025-05-09",
    solvedCount: 35,
    successRate: "42%",
    userStatus: "none",
  },
  {
    id: 20,
    title: "프린터 큐",
    difficulty: "중",
    views: 170,
    summary: "큐를 이용한 인쇄 우선순위 시뮬레이션 문제",
    uploadDate: "2025-05-01",
    solvedCount: 130,
    successRate: "73%",
    userStatus: "solved",
  },
];

function cmpDifficulty(a: string, b: string) {
  const order = ["하", "중", "상"];
  return order.indexOf(a) - order.indexOf(b);
}

export async function fetchDummyProblems({
  sortType,
  searchTerm,
  isLoggedIn,
  page = 1,
  size = 50,
}: FetchProblemParams): Promise<Problem[]> {
  let list = [...DUMMY_PROBLEMS];

  if (searchTerm && searchTerm.trim().length >= 2) {
    const key = searchTerm.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(key) || p.id.toString().includes(key)
    );
  }

  switch (sortType) {
    case "latest":
      list.sort((a, b) => b.uploadDate.localeCompare(a.uploadDate));
      break;
    case "low_difficulty":
      list.sort((a, b) => cmpDifficulty(a.difficulty, b.difficulty));
      break;
    case "high_difficulty":
      list.sort((a, b) => cmpDifficulty(b.difficulty, a.difficulty));
      break;
    case "views":
      list.sort((a, b) => b.views - a.views);
      break;
    case "id":
      list.sort((a, b) => a.id - b.id);
      break;
  }

  if (!isLoggedIn) {
    list = list.map((p) => ({ ...p, userStatus: "none" }));
  }

  const start = (page - 1) * size;
  const end = start + size;
  return list.slice(start, end);
}
