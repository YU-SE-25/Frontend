import type { ProblemListItemDto, ProblemDetailDto } from "../problem_api";

// 문제 목록 더미 데이터
export const DUMMY_PROBLEM_LIST: ProblemListItemDto[] = [
  {
    problemId: 1,
    title: "두 수의 합",
    tags: ["IMPLEMENTATION"],
    difficulty: "EASY",
    viewCount: 187,
    createdAt: "2025-07-02T10:00:00",
    //추후 필요한 내용
    userStatus: "NONE",
    summary: "두 정수를 더하는 가장 기본 문제",
    solvedCount: 77,
    successRate: 92,
  },
  {
    problemId: 2,
    title: "정렬된 배열에서 원소 찾기",
    tags: ["BINARY_SEARCH"],
    difficulty: "MEDIUM",
    viewCount: 174,
    createdAt: "2025-07-03T10:00:00",

    userStatus: "ATTEMPTED",
    summary: "이진 탐색으로 값 탐색하기",
    solvedCount: 91,
    successRate: 32,
  },
  {
    problemId: 3,
    title: "가장 긴 팰린드롬",
    tags: ["STRING", "TWO_POINTER"],
    difficulty: "HARD",
    viewCount: 276,
    createdAt: "2025-07-04T10:00:00",

    userStatus: "SOLVED",
    summary: "문자열에서 가장 긴 팰린드롬 부분 문자열",
    solvedCount: 36,
    successRate: 83,
  },
];

// 문제 상세 더미 데이터
export const DUMMY_PROBLEM_DETAIL: Record<number, ProblemDetailDto> = {
  1: {
    problemId: 1,
    createdByNickname: "알고위자드",
    title: "두 수의 합",
    description: "정수 A와 B를 입력받아 A+B를 출력하는 문제입니다.",
    inputOutputExample: "입력: 1 2\n출력: 3",

    difficulty: "EASY",
    timeLimit: 1,
    memoryLimit: 128,
    visibility: "PUBLIC",
    viewCount: 187,

    createdAt: "2025-07-02T10:00:00",
    updatedAt: "2025-07-02T10:00:00",

    tags: ["IMPLEMENTATION"],
    hint: "그냥 더하세요!",
    source: "알고리즘 기초",

    totalSubmissions: 100,
    acceptedSubmissions: 90,
    acceptanceRate: 90,

    canEdit: false,
    allowedLanguages: ["C++", "Java", "Python"],
  },

  2: {
    problemId: 2,
    createdByNickname: "Ara",
    title: "정렬된 배열에서 원소 찾기",
    description: "정렬된 배열에서 값 X를 이진 탐색으로 빠르게 찾습니다.",
    inputOutputExample: "입력: 1 3 5 7\n찾는 값: 3",

    difficulty: "MEDIUM",
    timeLimit: 2,
    memoryLimit: 256,
    visibility: "PUBLIC",
    viewCount: 174,

    createdAt: "2025-07-03T10:00:00",
    updatedAt: "2025-07-03T10:00:00",

    tags: ["BINARY_SEARCH"],
    hint: "mid 인덱스를 잘 잡아!",
    source: "자료구조/탐색",

    totalSubmissions: 80,
    acceptedSubmissions: 25,
    acceptanceRate: 31,

    canEdit: false,
    allowedLanguages: ["C++", "Java", "Python"],
  },

  3: {
    problemId: 3,
    createdByNickname: "알고위자드",
    title: "가장 긴 팰린드롬",
    description:
      "문자열에서 가장 긴 팰린드롬 부분 문자열의 길이를 구하는 문제입니다.",
    inputOutputExample: "입력: abba → 출력: 4",

    difficulty: "HARD",
    timeLimit: 3,
    memoryLimit: 512,
    visibility: "PUBLIC",
    viewCount: 276,

    createdAt: "2025-07-04T10:00:00",
    updatedAt: "2025-07-04T10:00:00",

    tags: ["STRING", "TWO_POINTER"],
    hint: "중심 확장 또는 Manacher 알고리즘",
    source: "문자열 알고리즘",

    totalSubmissions: 60,
    acceptedSubmissions: 50,
    acceptanceRate: 83,

    canEdit: false,
    allowedLanguages: ["C++", "Java", "Python"],
  },
};

// 태그 더미
export const ALL_AVAILABLE_TAGS: string[] = [
  "IMPLEMENTATION",
  "BINARY_SEARCH",
  "STRING",
  "TWO_POINTER",
  "DFS",
  "BFS",
  "GRAPH",
];

// fallback: 문제 목록 조회
export async function fetchDummyProblems(params: any = {}) {
  const {
    sortType = "latest",
    searchTerm = "",
    tags = [],
    page = 1,
    size = 1000,
    isLoggedIn = false,
  } = params;

  let list: ProblemListItemDto[] = [...DUMMY_PROBLEM_LIST];

  if (searchTerm.trim().length >= 2) {
    const key = searchTerm.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(key) ||
        p.problemId.toString().includes(key)
    );
  }

  if (tags.length > 0) {
    list = list.filter((item) =>
      tags.every((t: string) => item.tags.includes(t))
    );
  }

  switch (sortType) {
    case "latest":
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "low_difficulty":
      list.sort(
        (a, b) =>
          ["EASY", "MEDIUM", "HARD"].indexOf(a.difficulty) -
          ["EASY", "MEDIUM", "HARD"].indexOf(b.difficulty)
      );
      break;
    case "high_difficulty":
      list.sort(
        (a, b) =>
          ["EASY", "MEDIUM", "HARD"].indexOf(b.difficulty) -
          ["EASY", "MEDIUM", "HARD"].indexOf(a.difficulty)
      );
      break;
    case "views":
      list.sort((a, b) => b.viewCount - a.viewCount);
      break;
    case "id":
      list.sort((a, b) => a.problemId - b.problemId);
      break;
  }

  if (!isLoggedIn) {
    list = list.map((p) => ({ ...p, userStatus: "NONE" }));
  }

  return list.slice((page - 1) * size, page * size);
}

// fallback: 문제 상세 조회
export async function fetchDummyProblemDetail(problemId: number) {
  return DUMMY_PROBLEM_DETAIL[problemId];
}

// 최소 문제 목록
export const PROBLEM_LIST = DUMMY_PROBLEM_LIST.map((p) => ({
  problemId: p.problemId,
  title: p.title,
}));

// 조회수 증가
export function increaseDummyView(problemId: number) {
  if (DUMMY_PROBLEM_DETAIL[problemId]) {
    DUMMY_PROBLEM_DETAIL[problemId].viewCount += 1;
  }
}
