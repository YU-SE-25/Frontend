import type { IProblem } from "./../problem_api";
//import type { IProblem, FetchProblemParams } from "../problem_api";

const DUMMY_STORE: Record<number, IProblem> = {
  1: {
    problemId: 1,
    title: "두 수의 합",
    tags: ["구현", "기초"],
    difficulty: "하",
    viewCount: 387,
    createdAt: "2025-07-02",
    solvedCount: 77,
    successRate: "92%",
    userStatus: "NONE",
    description: "두 개의 정수 A와 B를 입력받아 A+B를 출력한다.",
    inputOutputExample: `입력: 1 2
출력: 3

입력: 5 7
출력: 12`,
    author: "알고위자드",
    timeLimit: 1,
    memoryLimit: 128,
    visibility: "PUBLIC",
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    canEdit: false,
  },

  2: {
    problemId: 2,
    title: "정렬된 배열에서 원소 찾기",
    tags: ["이진 탐색", "탐색", "기초 알고리즘"],
    difficulty: "중",
    viewCount: 174,
    createdAt: "2025-07-03",
    solvedCount: 91,
    successRate: "32%",
    userStatus: "ATTEMPTED",
    description:
      "오름차순 정렬된 배열에서 값 X의 존재 여부를 이진 탐색으로 판별한다.",
    inputOutputExample: "입력: 예시 입력 2\n출력: 예시 출력 2",
    author: "Ara",
    timeLimit: 2,
    memoryLimit: 256,
    visibility: "PUBLIC",
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    canEdit: false,
  },

  3: {
    problemId: 3,
    title: "가장 긴 팰린드롬",
    tags: ["문자열", "투 포인터", "중심 확장"],
    difficulty: "상",
    viewCount: 276,
    createdAt: "2025-07-04",
    solvedCount: 36,
    successRate: "83%",
    userStatus: "SOLVED",
    description: "문자열 S에서 가장 긴 팰린드롬 부분 문자열의 길이를 구한다.",
    inputOutputExample: `입력: abba
출력: 4

입력: abc
출력: 1`,
    author: "알고위자드",
    timeLimit: 3,
    memoryLimit: 512,
    visibility: "PUBLIC",
    hint: "중심 확장 또는 Manacher 알고리즘을 고려하라.",
    source: "알고리즘 기본/응용",
    canEdit: false,
  },

  4: {
    problemId: 4,
    title: "스택 수열",
    tags: ["스택", "시뮬레이션", "자료구조"],
    difficulty: "하",
    viewCount: 318,
    createdAt: "2025-07-05",
    solvedCount: 328,
    successRate: "98%",
    userStatus: "NONE",
    description:
      "1..N을 스택에 push/pop하여 주어진 수열을 만들 수 있는지 판별한다.",
    inputOutputExample: "입력: 예시 입력 4\n출력: 예시 출력 4",
    author: "알고위자드",
    timeLimit: 1,
    memoryLimit: 1024,
    visibility: "PUBLIC",
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    canEdit: false,
  },

  5: {
    problemId: 5,
    title: "괄호의 유효성 검사",
    tags: ["스택", "문자열", "기초"],
    difficulty: "중",
    viewCount: 426,
    createdAt: "2025-07-06",
    solvedCount: 352,
    successRate: "66%",
    userStatus: "ATTEMPTED",
    description: "주어진 괄호 문자열이 올바른지 판별한다.",
    inputOutputExample: "입력: 예시 입력 5\n출력: 예시 출력 5",
    author: "Yeon",
    timeLimit: 2,
    memoryLimit: 128,
    visibility: "PUBLIC",
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    canEdit: false,
  },

  6: {
    problemId: 6,
    title: "프린터 큐",
    tags: ["큐", "시뮬레이션", "자료구조"],
    difficulty: "상",
    viewCount: 361,
    createdAt: "2025-07-07",
    solvedCount: 162,
    successRate: "99%",
    userStatus: "SOLVED",
    description:
      "우선순위 프린터 큐에서 특정 문서가 몇 번째에 출력되는지 구한다.",
    inputOutputExample: "입력: 예시 입력 6\n출력: 예시 출력 6",
    author: "세이지",
    timeLimit: 3,
    memoryLimit: 256,
    visibility: "PUBLIC",
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    canEdit: false,
  },

  7: {
    problemId: 7,
    title: "DFS와 BFS",
    tags: ["그래프", "BFS", "DFS"],
    difficulty: "하",
    viewCount: 234,
    createdAt: "2025-07-08",
    solvedCount: 162,
    successRate: "80%",
    userStatus: "NONE",
    description: "그래프에서 DFS와 BFS 방문 순서를 출력한다.",
    inputOutputExample: "입력: 예시 입력 7\n출력: 예시 출력 7",
    author: "운영자",
    timeLimit: 1,
    memoryLimit: 512,
    visibility: "PUBLIC",
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    canEdit: false,
  },

  8: {
    problemId: 8,
    title: "연속 부분합",
    tags: ["다이나믹 프로그래밍", "카데인", "배열"],
    difficulty: "중",
    viewCount: 112,
    createdAt: "2025-07-09",
    solvedCount: 67,
    successRate: "40%",
    userStatus: "ATTEMPTED",
    description: "정수 배열에서 연속 부분합의 최댓값을 구한다.",
    inputOutputExample: "입력: 예시 입력 8\n출력: 예시 출력 8",
    author: "Ara",
    timeLimit: 2,
    memoryLimit: 1024,
    visibility: "PUBLIC",
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    canEdit: false,
  },

  9: {
    problemId: 9,
    title: "회의실 배정",
    tags: ["그리디", "정렬", "간단"],
    difficulty: "상",
    viewCount: 195,
    createdAt: "2025-07-10",
    solvedCount: 42,
    successRate: "18%",
    userStatus: "SOLVED",
    description: "회의의 시작/끝 시간이 주어질 때 최대 회의 수를 배정한다.",
    inputOutputExample: "입력: 예시 입력 9\n출력: 예시 출력 9",
    author: "gamppe",
    timeLimit: 3,
    memoryLimit: 128,
    visibility: "PUBLIC",
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    canEdit: true,
  },

  10: {
    problemId: 10,
    title: "보석 도둑",
    tags: ["그리디", "정렬", "우선순위 큐"],
    difficulty: "하",
    viewCount: 253,
    createdAt: "2025-07-11",
    solvedCount: 60,
    successRate: "29%",
    userStatus: "NONE",
    description: "무게 제한이 있는 가방에 보석의 가치를 최대로 담는다.",
    inputOutputExample: "입력: 예시 입력 10\n출력: 예시 출력 10",
    author: "Ara",
    timeLimit: 1,
    memoryLimit: 256,
    visibility: "PUBLIC",
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    canEdit: false,
  },
};

function cmpDifficulty(a: string, b: string) {
  const order = ["하", "중", "상"];
  return order.indexOf(a) - order.indexOf(b);
}

export const ALL_AVAILABLE_TAGS = [
  "구현",
  "기초",
  "이진 탐색",
  "탐색",
  "문자열",
  "투 포인터",
  "중심 확장",
  "스택",
  "시뮬레이션",
  "자료구조",
  "다이나믹 프로그래밍",
  "카데인",
  "배열",
  "그리디",
  "정렬",
  "우선순위 큐",
  "그래프",
  "BFS",
  "DFS",
];

export async function fetchDummyProblems({
  sortType,
  searchTerm,
  isLoggedIn,
  page = 1,
  size = 50,
  tags,
}: FetchProblemParams): Promise<IProblem[]> {
  let list = Object.values(DUMMY_STORE);

  if (searchTerm && searchTerm.trim().length >= 2) {
    const key = searchTerm.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(key) || p.id.toString().includes(key)
    );
  }
  if (tags && tags.length > 0) {
    // 선택된 '모든' 태그를 포함하는 문제만 필터링
    list = list.filter((problem) => {
      return (
        problem.tags &&
        tags.every((selectedTag) => problem.tags!.includes(selectedTag))
      );
    });
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

export async function getDummyProblemDetail(
  problemId: string
): Promise<IProblem> {
  const data = DUMMY_STORE[problemId];
  if (!data) throw new Error("문제를 찾을 수 없습니다.");
  return { ...data };
}

export async function increaseDummyView(problemId: string): Promise<void> {
  if (DUMMY_STORE[problemId]) DUMMY_STORE[problemId].views += 1;
}

export const PROBLEM_LIST = Object.entries(DUMMY_STORE).map(([id, prob]) => ({
  id: Number(id),
  title: prob.title,
}));
