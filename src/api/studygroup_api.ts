export type GroupRole = "LEADER" | "MEMBER" | "NONE";

export interface StudyGroup {
  groupId: number;
  groupName: string;
  groupDescription: string;
  maxMembers: number;
  currentMembers: number;
  leaderName: string;
  myRole: GroupRole;
}

// 상세 조회 타입
export interface StudyGroupDetail {
  groupId: number;
  groupName: string;
  groupDescription: string;
  maxMembers: number;
  currentMembers: number;

  leader: {
    userId: number;
    leaderName: string;
  };

  members: {
    groupMemberId: number;
    userId: number;
    userName: string;
    role: "LEADER" | "MEMBER";
  }[];

  myRole: GroupRole;
}

// 개별 문제
export interface AssignedProblem {
  problemId: number;
  problemTitle: string;
  anonymity: boolean;
  likeCount: number;
  commentCount: number;
  createTime: string;

  userStatus: "SUBMITTED" | "NOT_SUBMITTED";
}

// 문제 리스트
export interface AssignedProblemList {
  problemListId: number;
  listTitle: string;
  dueDate: string;

  problems: AssignedProblem[];

  submittedCount: number;
}

// 활동 로그
export interface ActivityLog {
  activityId: number;
  type: string;
  userId: number;
  userName: string;
  description: string;
  createdAt: string;
}

import {
  DUMMY_GROUPS,
  DUMMY_GROUP_DETAIL,
  DUMMY_ASSIGNED_LISTS,
  DUMMY_ACTIVITY_LOGS,
} from "./dummy/studygroup_dummy";

// import { api } from "./axios";

// API

// 그룹 리스트
export const fetchStudyGroups = async () => {
  return DUMMY_GROUPS;

  // const res = await api.get("/api/studygroup", { params: { pageSize } });
  // return res.data;
};

// 그룹 상세
export const fetchStudyGroupDetail = async (groupId: number) => {
  return DUMMY_GROUP_DETAIL;

  // const res = await api.get(`/api/studygroup/list/${groupId}`);
  // return res.data;
};

// 문제 리스트 전체
export const fetchAssignedProblemLists = async (groupId: number) => {
  return DUMMY_ASSIGNED_LISTS;

  // const res = await api.get(`/api/studygroup/${groupId}/problem-lists`);
  // return res.data;
};

// 특정 문제 리스트 상세
export const fetchAssignedProblemListDetail = async (
  groupId: number,
  problemListId: number
) => {
  const found = DUMMY_ASSIGNED_LISTS.find(
    (p) => p.problemListId === problemListId
  );
  return found ?? null;

  // const res = await api.get(
  //   `/api/studygroup/${groupId}/problem-lists/${problemListId}`
  // );
  // return res.data;
};

// 활동 로그
export const fetchActivityLogs = async (groupId: number) => {
  return DUMMY_ACTIVITY_LOGS;

  // const res = await api.get(`/api/studygroup/${groupId}/activities`);
  // return res.data;
};

// 그룹 생성
export const createStudyGroup = async (data: {
  groupName: string;
  groupDescription: string;
  maxMembers: number;
}) => {
  return { message: "study group이 성공적으로 생성되었습니다" };

  // const res = await api.post("/api/studygroup", data);
  // return res.data;
};

// 그룹 수정
export const updateStudyGroup = async (
  groupId: number,
  data: {
    groupName?: string;
    groupDescription?: string;
    maxMembers?: number;
  }
) => {
  return { message: "그룹 수정이 완료 되었습니다!" };

  // const res = await api.patch(`/api/studygroup/list/${groupId}`, data);
  // return res.data;
};

// 그룹 삭제
export const deleteStudyGroup = async (groupId: number) => {
  return { message: "그룹이 삭제 되었습니다!" };

  // const res = await api.delete(`/api/studygroup/list/${groupId}`);
  // return res.data;
};

// 그룹 가입
export const joinStudyGroup = async (groupId: number) => {
  return {
    membershipId: 9123,
    groupId,
    userId: 100200,
    role: "MEMBER",
    capacity: { max: 10, current: 8, waitlisted: 0 },
    createdAt: "2025-11-03T06:35:00Z",
  };

  // const res = await api.post(`/api/studygroup/${groupId}/membership`);
  // return res.data;
};

// 그룹 탈퇴
export const leaveStudyGroup = async (groupId: number) => {
  return {
    groupId,
    userId: 4,
    status: "LEFT",
  };

  // const res = await api.delete(`/api/studygroup/${groupId}/members/me`);
  // return res.data;
};

// 멤버 강퇴
export const kickMember = async (groupId: number, memberId: number) => {
  return {
    groupId,
    groupMemberId: memberId,
    kickedUserId: 4,
    kickedUserName: "이철수",
    status: "KICKED",
  };

  // const res = await api.delete(
  //   `/api/studygroup/${groupId}/members/${memberId}`
  // );
  // return res.data;
};
