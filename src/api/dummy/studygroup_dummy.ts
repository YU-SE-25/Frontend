export interface Group {
  group_id: number;
  group_name: string;
  group_leader: number;
  created_at: string;
  group_goal: string;
  group_description: string;
  leader_name: string;
  myRole: "LEADER" | "MEMBER";
  max_members: number;
  groupmember_id: number[];
}

export const DUMMY_GROUPS: Group[] = [
  {
    group_id: 1,
    group_name: "알고리즘 뽀개기",
    group_leader: 11111,
    created_at: "2025-01-01T00:00:00Z",
    group_goal: "프로그래머스 4단계 완료",
    group_description: "DP와 그래프 알고리즘 스터디입니다.",
    leader_name: "홍길동",
    myRole: "LEADER",
    max_members: 10,
    groupmember_id: [11111, 11112, 11113, 11114, 11115, 11116, 11117, 11118],
  },

  {
    group_id: 2,
    group_name: "C++ 문법 마스터",
    group_leader: 22221,
    created_at: "2025-03-15T00:00:00Z",
    group_goal: "문법 완벽 이해",
    group_description: "C++ 기초부터 심화까지 다룹니다.",
    leader_name: "이서준",
    myRole: "MEMBER",
    max_members: 10,
    groupmember_id: [22221, 22222, 22223, 22224, 22225],
  },
  {
    group_id: 3,
    group_name: "코테 입문 준비반",
    group_leader: 33331,
    created_at: "2025-05-20T00:00:00Z",
    group_goal: "백준 150문제 해결",
    group_description: "취업을 위한 코딩 테스트 입문반입니다.",
    leader_name: "김지우",
    myRole: "MEMBER",
    max_members: 8,
    groupmember_id: [33331, 33332, 33333, 33334, 33335, 33336, 33337],
  },
];

export const MY_GROUPS: Group[] = [DUMMY_GROUPS[0]]; // 소속된 그룹 (1개로 가정)

export const DUMMY_TAGS = ["알고리즘", "DP", "그래프", "입문", "심화"];
