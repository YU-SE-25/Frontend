// 스터디 그룹 리스트
import type {
  StudyGroup,
  StudyGroupDetail,
  AssignedProblem,
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
    groupName: "자료구조 입문반",
    groupDescription: "스택/큐/트리로 기초 다지기",
    maxMembers: 8,
    currentMembers: 2,
    leaderName: "최지훈",
    myRole: "NONE",
  },
];

// 스터디 그룹 상세
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
  ],

  myRole: "LEADER",
};

// 문제 A
export const PROBLEMS_SET_A: AssignedProblem[] = [
  {
    problemId: 101,
    problemTitle: "피보나치 수열",
    anonymity: false,
    likeCount: 1,
    commentCount: 0,
    createTime: "2025-10-25T10:00:00Z",
    userStatus: "SUBMITTED",
  },
  {
    problemId: 102,
    problemTitle: "최단 거리",
    anonymity: false,
    likeCount: 0,
    commentCount: 0,
    createTime: "2025-10-25T10:00:00Z",
    userStatus: "NOT_SUBMITTED",
  },
  {
    problemId: 103,
    problemTitle: "BFS 기본",
    anonymity: false,
    likeCount: 5,
    commentCount: 2,
    createTime: "2025-10-26T11:00:00Z",
    userStatus: "SUBMITTED",
  },
];

// 문제 B
export const PROBLEMS_SET_B: AssignedProblem[] = [
  {
    problemId: 201,
    problemTitle: "그리디 문제 1",
    anonymity: false,
    likeCount: 3,
    commentCount: 0,
    createTime: "2025-10-27T12:00:00Z",
    userStatus: "SUBMITTED",
  },
  {
    problemId: 202,
    problemTitle: "투 포인터",
    anonymity: false,
    likeCount: 0,
    commentCount: 0,
    createTime: "2025-10-27T12:00:00Z",
    userStatus: "NOT_SUBMITTED",
  },
];

// 문제 리스트
export const DUMMY_ASSIGNED_LISTS: AssignedProblemList[] = [
  {
    problemListId: 1,
    listTitle: "이번주 문제",
    dueDate: "2025-11-05",
    submittedCount: 3,
    problems: PROBLEMS_SET_A,
  },
  {
    problemListId: 2,
    listTitle: "다음주 DP 연습",
    dueDate: "2025-11-12",
    submittedCount: 1,
    problems: PROBLEMS_SET_B,
  },
];

// 활동 로그
export const DUMMY_ACTIVITY_LOGS: ActivityLog[] = [
  {
    activityId: 1001,
    type: "PROBLEM_SUBMIT",
    userId: 4,
    userName: "이철수",
    description: "백준 101번 문제 풀이 제출",
    createdAt: "2025-11-02T21:30:00",
  },
  {
    activityId: 1002,
    type: "JOIN",
    userId: 5,
    userName: "김영희",
    description: "스터디 그룹에 가입",
    createdAt: "2025-11-03T10:00:00",
  },
];
