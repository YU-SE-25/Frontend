import type {
  StudyGroup,
  StudyGroupDetail,
  AssignedProblemList,
  ActivityLog,
} from "../studygroup_api";

export const DUMMY_GROUPS: StudyGroup[] = [
  {
    groupId: 1,
    groupName: "알고리즘 스터디",
    groupDescription: "백준 골드 이상 도전 스터디입니다.",
    maxMembers: 10,
    currentMembers: 6,
    leaderName: "홍길동",
    myRole: "LEADER",
  },
  {
    groupId: 2,
    groupName: "CS 복습 스터디",
    groupDescription: "운영체제/네트워크 위주 복습",
    maxMembers: 5,
    currentMembers: 4,
    leaderName: "김영희",
    myRole: "MEMBER",
  },
  {
    groupId: 3,
    groupName: "자료구조 스터디",
    groupDescription: "B-Tree, B+Tree, Red-Black Tree 공부",
    maxMembers: 8,
    currentMembers: 3,
    leaderName: "박철수",
    myRole: "NONE",
  },
];

export const DUMMY_GROUP_DETAIL: StudyGroupDetail = {
  groupId: 1,
  groupName: "알고리즘 스터디",
  groupDescription: "백준 골드 이상 도전 스터디입니다.",
  maxMembers: 10,
  currentMembers: 6,

  leader: {
    userId: 3,
    leaderName: "홍길동",
  },

  members: [
    {
      groupMemberId: 11,
      userId: 3,
      userName: "홍길동",
      role: "LEADER",
    },
    {
      groupMemberId: 12,
      userId: 4,
      userName: "이철수",
      role: "MEMBER",
    },
    {
      groupMemberId: 13,
      userId: 5,
      userName: "김영희",
      role: "MEMBER",
    },
  ],

  myRole: "LEADER",
};

export const DUMMY_ASSIGNED_LISTS: AssignedProblemList[] = [
  {
    problemListId: 1,
    listTitle: "이번주 문제",
    dueDate: "2025-11-05",
    problems: [
      {
        problemId: 1,
        problemTitle: "이진 검색 트리 설계",
        userStatus: "NOT_SUBMITTED",
      },
      {
        problemId: 2,
        problemTitle: "큐/스택 구현",
        userStatus: "SUBMITTED",
      },
    ],
  },
  {
    problemListId: 2,
    listTitle: "다음주 문제",
    dueDate: "2025-11-15",
    problems: [
      {
        problemId: 3,
        problemTitle: "그래프 DFS/BFS",
        userStatus: "NOT_SUBMITTED",
      },
      {
        problemId: 4,
        problemTitle: "동적 프로그래밍 기본",
        userStatus: "NOT_SUBMITTED",
      },
    ],
  },
];

export const DUMMY_ASSIGNED_LIST_DETAIL: AssignedProblemList = {
  problemListId: 1,
  listTitle: "이번주 문제",
  dueDate: "2025-11-05",
  problems: [
    {
      problemId: 1,
      problemTitle: "이진 검색 트리 설계",
      userStatus: "NOT_SUBMITTED",
    },
    {
      problemId: 2,
      problemTitle: "큐/스택 구현",
      userStatus: "SUBMITTED",
    },
  ],
};

export const DUMMY_ACTIVITY_LOGS: ActivityLog[] = [
  {
    activityId: 4,
    type: "LEAVE",
    userId: 2,
    userName: "김철수",
    description: "김철수 스터디 그룹에서 탈퇴",
    createdAt: "2025-11-28T02:52:04",
  },
  {
    activityId: 3,
    type: "KICK",
    userId: 2,
    userName: "김철수",
    description: "송인재 멤버 강퇴",
    createdAt: "2025-11-28T02:51:37",
  },
  {
    activityId: 2,
    type: "JOIN",
    userId: 13,
    userName: "송인재",
    description: "송인재 스터디 그룹에 가입",
    createdAt: "2025-11-28T02:37:59",
  },
];
