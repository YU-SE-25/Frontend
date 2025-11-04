interface Group {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  createdAt: string;
  goal: string;
  tags: string[];
}

const DUMMY_GROUPS: Group[] = [
  {
    id: 1,
    name: "알고리즘 뽀개기",
    description: "DP와 그래프 알고리즘 스터디입니다.",
    memberCount: 8,
    maxMembers: 10,
    createdAt: "2025-01-01",
    goal: "프로그래머스 4단계 완료",
    tags: ["DP", "BFS", "심화"],
  },
  {
    id: 2,
    name: "C++ 문법 마스터",
    description: "C++ 기초부터 심화까지 다룹니다.",
    memberCount: 5,
    maxMembers: 10,
    createdAt: "2025-03-15",
    goal: "문법 완벽 이해",
    tags: ["C++", "기초"],
  },
  {
    id: 3,
    name: "코테 입문 준비반",
    description: "취업을 위한 코딩 테스트 입문반입니다.",
    memberCount: 7,
    maxMembers: 8,
    createdAt: "2025-05-20",
    goal: "백준 150문제 해결",
    tags: ["구현", "기초"],
  },
];

export const MY_GROUPS: Group[] = [DUMMY_GROUPS[0]]; // 소속된 그룹 (1개로 가정)
