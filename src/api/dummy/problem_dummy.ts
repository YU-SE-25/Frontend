import type { IProblem, FetchProblemParams } from "../problem_api";

const DUMMY_STORE: Record<string, IProblem> = {
  "1": {
    id: 1,
    title: "두 수의 합",
    difficulty: "하",
    views: 387,
    uploadDate: "2025-07-02",
    author: "알고위자드",
    solvedCount: 77,
    successRate: "92%",
    timeLimit: "1초",
    memoryLimit: "128MB",
    allowedLanguages: ["Java", "Python", "C++"],
    description: "두 개의 정수 A와 B를 입력받아 A+B를 출력한다.",
    inputDescription:
      "문제에 맞는 입력 형식이 주어진다. 제약은 문제 설명을 참고하라.",
    outputDescription: "요구된 결과를 출력한다.",
    examples: [
      {
        input: "1 2",
        output: "3",
      },
      {
        input: "5 7",
        output: "12",
      },
    ],
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    userStatus: "none",
    userAttempts: 0,
    userSuccessRate: "0%",
    tags: ["구현", "기초"],
  },
  "2": {
    id: 2,
    title: "정렬된 배열에서 원소 찾기",
    difficulty: "중",
    views: 174,
    uploadDate: "2025-07-03",
    author: "Ara",
    solvedCount: 91,
    successRate: "32%",
    timeLimit: "2초",
    memoryLimit: "256MB",
    allowedLanguages: ["C", "C++", "Java", "Python"],
    description:
      "오름차순 정렬된 배열에서 값 X의 존재 여부를 이진 탐색으로 판별한다.",
    inputDescription:
      "문제에 맞는 입력 형식이 주어진다. 제약은 문제 설명을 참고하라.",
    outputDescription: "요구된 결과를 출력한다.",
    examples: [
      {
        input: "예시 입력 2",
        output: "예시 출력 2",
      },
    ],
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    userStatus: "attempted",
    userAttempts: 3,
    userSuccessRate: "0%",
    tags: ["이진 탐색", "탐색", "기초 알고리즘"],
  },
  "3": {
    id: 3,
    title: "가장 긴 팰린드롬",
    difficulty: "상",
    views: 276,
    uploadDate: "2025-07-04",
    author: "알고위자드",
    solvedCount: 36,
    successRate: "83%",
    timeLimit: "3초",
    memoryLimit: "512MB",
    allowedLanguages: ["C", "C++", "Java", "Python"],
    description: "문자열 S에서 가장 긴 팰린드롬 부분 문자열의 길이를 구한다.",
    inputDescription: "길이 N의 문자열 S가 주어진다.",
    outputDescription: "최장 팰린드롬 부분 문자열의 길이를 출력한다.",
    examples: [
      {
        input: "abba",
        output: "4",
      },
      {
        input: "abc",
        output: "1",
      },
    ],
    hint: "중심 확장 또는 Manacher 알고리즘을 고려하라.",
    source: "알고리즘 기본/응용",
    userStatus: "solved",
    userAttempts: 1,
    userSuccessRate: "100%",
    tags: ["문자열", "투 포인터", "중심 확장"],
  },
  "4": {
    id: 4,
    title: "스택 수열",
    difficulty: "하",
    views: 318,
    uploadDate: "2025-07-05",
    author: "알고위자드",
    solvedCount: 328,
    successRate: "98%",
    timeLimit: "1초",
    memoryLimit: "1024MB",
    allowedLanguages: ["Kotlin", "Java", "Python"],
    description:
      "1..N을 스택에 push/pop하여 주어진 수열을 만들 수 있는지 판별한다.",
    inputDescription:
      "문제에 맞는 입력 형식이 주어진다. 제약은 문제 설명을 참고하라.",
    outputDescription: "요구된 결과를 출력한다.",
    examples: [
      {
        input: "예시 입력 4",
        output: "예시 출력 4",
      },
    ],
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    userStatus: "none",
    userAttempts: 0,
    userSuccessRate: "0%",
    tags: ["스택", "시뮬레이션", "자료구조"],
  },
  "5": {
    id: 5,
    title: "괄호의 유효성 검사",
    difficulty: "중",
    views: 426,
    uploadDate: "2025-07-06",
    author: "Yeon",
    solvedCount: 352,
    successRate: "66%",
    timeLimit: "2초",
    memoryLimit: "128MB",
    allowedLanguages: ["Kotlin", "Java", "Python"],
    description: "주어진 괄호 문자열이 올바른지 판별한다.",
    inputDescription:
      "문제에 맞는 입력 형식이 주어진다. 제약은 문제 설명을 참고하라.",
    outputDescription: "요구된 결과를 출력한다.",
    examples: [
      {
        input: "예시 입력 5",
        output: "예시 출력 5",
      },
    ],
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    userStatus: "attempted",
    userAttempts: 2,
    userSuccessRate: "0%",
    tags: ["스택", "문자열", "기초"],
  },
  "6": {
    id: 6,
    title: "프린터 큐",
    difficulty: "상",
    views: 361,
    uploadDate: "2025-07-07",
    author: "세이지",
    solvedCount: 162,
    successRate: "99%",
    timeLimit: "3초",
    memoryLimit: "256MB",
    allowedLanguages: ["C++", "Java", "Python"],
    description:
      "우선순위 프린터 큐에서 특정 문서가 몇 번째에 출력되는지 구한다.",
    inputDescription:
      "문제에 맞는 입력 형식이 주어진다. 제약은 문제 설명을 참고하라.",
    outputDescription: "요구된 결과를 출력한다.",
    examples: [
      {
        input: "예시 입력 6",
        output: "예시 출력 6",
      },
    ],
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    userStatus: "solved",
    userAttempts: 3,
    userSuccessRate: "100%",
    tags: ["큐", "시뮬레이션", "자료구조"],
  },
  "7": {
    id: 7,
    title: "DFS와 BFS",
    difficulty: "하",
    views: 234,
    uploadDate: "2025-07-08",
    author: "운영자",
    solvedCount: 162,
    successRate: "80%",
    timeLimit: "1초",
    memoryLimit: "512MB",
    allowedLanguages: ["C++", "Java", "Python"],
    description: "그래프에서 DFS와 BFS 방문 순서를 출력한다.",
    inputDescription:
      "문제에 맞는 입력 형식이 주어진다. 제약은 문제 설명을 참고하라.",
    outputDescription: "요구된 결과를 출력한다.",
    examples: [
      {
        input: "예시 입력 7",
        output: "예시 출력 7",
      },
    ],
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    userStatus: "none",
    userAttempts: 0,
    userSuccessRate: "0%",
    tags: ["그래프", "BFS", "DFS"],
  },
  "8": {
    id: 8,
    title: "연속 부분합",
    difficulty: "중",
    views: 112,
    uploadDate: "2025-07-09",
    author: "Ara",
    solvedCount: 67,
    successRate: "40%",
    timeLimit: "2초",
    memoryLimit: "1024MB",
    allowedLanguages: ["C", "C++", "Java", "Python"],
    description: "정수 배열에서 연속 부분합의 최댓값을 구한다.",
    inputDescription:
      "문제에 맞는 입력 형식이 주어진다. 제약은 문제 설명을 참고하라.",
    outputDescription: "요구된 결과를 출력한다.",
    examples: [
      {
        input: "예시 입력 8",
        output: "예시 출력 8",
      },
    ],
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    userStatus: "attempted",
    userAttempts: 2,
    userSuccessRate: "50%",
    tags: ["다이나믹 프로그래밍", "카데인", "배열"],
  },
  "9": {
    id: 9,
    title: "회의실 배정",
    difficulty: "상",
    views: 195,
    uploadDate: "2025-07-10",
    author: "gamppe",
    solvedCount: 42,
    successRate: "18%",
    timeLimit: "3초",
    memoryLimit: "128MB",
    allowedLanguages: ["Python", "C++", "Java"],
    description: "회의의 시작/끝 시간이 주어질 때 최대 회의 수를 배정한다.",
    inputDescription:
      "문제에 맞는 입력 형식이 주어진다. 제약은 문제 설명을 참고하라.",
    outputDescription: "요구된 결과를 출력한다.",
    examples: [
      {
        input: "예시 입력 9",
        output: "예시 출력 9",
      },
    ],
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    userStatus: "solved",
    userAttempts: 3,
    userSuccessRate: "100%",
    tags: ["그리디", "정렬", "간단"],
  },
  "10": {
    id: 10,
    title: "보석 도둑",
    difficulty: "하",
    views: 253,
    uploadDate: "2025-07-11",
    author: "Ara",
    solvedCount: 60,
    successRate: "29%",
    timeLimit: "1초",
    memoryLimit: "256MB",
    allowedLanguages: ["Java", "Python", "C++"],
    description: "무게 제한이 있는 가방에 보석의 가치를 최대로 담는다.",
    inputDescription:
      "문제에 맞는 입력 형식이 주어진다. 제약은 문제 설명을 참고하라.",
    outputDescription: "요구된 결과를 출력한다.",
    examples: [
      {
        input: "예시 입력 10",
        output: "예시 출력 10",
      },
    ],
    hint: "해결 전략을 작은 하위 문제로 나누고 경계 조건을 먼저 점검하라.",
    source: "알고리즘 기본/응용",
    userStatus: "none",
    userAttempts: 0,
    userSuccessRate: "0%",
    tags: ["그리디", "정렬", "우선순위 큐"],
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
