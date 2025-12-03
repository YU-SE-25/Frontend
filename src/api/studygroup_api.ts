import { api } from "./axios";

import {
  DUMMY_GROUPS,
  DUMMY_GROUP_DETAIL,
  DUMMY_ASSIGNED_LISTS,
  DUMMY_ASSIGNED_LIST_DETAIL,
  DUMMY_ACTIVITY_LOGS,
} from "./dummy/studygroup_dummy";

// 타입 정의
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

export interface AssignedProblem {
  problemId: number;
  problemTitle: string;
  userStatus: "SUBMITTED" | "NOT_SUBMITTED";
}

export interface AssignedProblemList {
  problemListId: number;
  listTitle: string;
  dueDate: string;
  problems: AssignedProblem[];
}

export interface ActivityLog {
  activityId: number;
  type: string;
  userId: number;
  userName: string;
  description: string;
  createdAt: string;
}

export interface ActivityResponse {
  content: ActivityLog[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export interface CreateStudyGroupResponse {
  message: string;
  groupId?: number;
}

export interface UpdateStudyGroupResponse {
  message: string;
  groupId: number;
}

export interface CreateProblemListResponse {
  problemListId: number;
  listTitle: string;
  dueDate: string;
}

export interface UpdateProblemListResponse {
  problemListId: number;
  listTitle: string;
  dueDate: string;
}

export interface DeleteProblemListResponse {
  message: string;
}

// 그룹 목록 조회
export async function fetchStudyGroups(
  pageSize: number = 10
): Promise<StudyGroup[]> {
  try {
    const res = await api.get<StudyGroup[]>("/studygroup", {
      params: { pageSize },
    });

    // literal 타입 강제 변환
    return res.data.map((g) => ({
      ...g,
      myRole: g.myRole as GroupRole,
    }));
  } catch (err) {
    console.error("fetchStudyGroups 실패 → 더미 사용");
    return DUMMY_GROUPS;
  }
}

// 그룹 상세 조회
export async function fetchStudyGroupDetail(
  groupId: number
): Promise<StudyGroupDetail> {
  try {
    const res = await api.get<StudyGroupDetail>(`/studygroup/list/${groupId}`);
    return res.data;
  } catch (err) {
    console.error("fetchStudyGroupDetail 실패 → fallback");
    return DUMMY_GROUP_DETAIL;
  }
}

// 그룹 생성
export async function createStudyGroup(data: {
  groupName: string;
  groupDescription: string;
  maxMembers: number;
}): Promise<CreateStudyGroupResponse> {
  try {
    const res = await api.post<CreateStudyGroupResponse>("/studygroup", data);
    return res.data;
  } catch {
    return { message: "study group이 성공적으로 생성되었습니다" };
  }
}

// 그룹 수정
export async function updateStudyGroup(
  groupId: number,
  data: {
    groupName?: string;
    groupDescription?: string;
    maxMembers?: number;
    groupMemberIds?: number[];
  }
): Promise<UpdateStudyGroupResponse> {
  try {
    const res = await api.patch<UpdateStudyGroupResponse>(
      `/studygroup/list/${groupId}`,
      data
    );
    return res.data;
  } catch {
    return {
      message: "그룹 수정이 완료되었습니다!",
      groupId,
    };
  }
}

// 그룹 삭제
export async function deleteStudyGroup(
  groupId: number
): Promise<{ message: string }> {
  try {
    const res = await api.delete<{ message: string }>(
      `/studygroup/list/${groupId}`
    );
    return res.data;
  } catch {
    return { message: "그룹이 삭제 되었습니다!" };
  }
}

// 그룹 가입
export async function joinStudyGroup(groupId: number): Promise<{
  groupId: number;
  userId: number;
  role: string;
  status: string;
  capacity: { max: number; current: number; waitlisted: number };
  joinedAt: string;
}> {
  try {
    const res = await api.post<{
      groupId: number;
      userId: number;
      role: string;
      status: string;
      capacity: { max: number; current: number; waitlisted: number };
      joinedAt: string;
    }>(`/studygroup/${groupId}/membership`);

    return res.data;
  } catch {
    return {
      groupId,
      userId: 13,
      role: "MEMBER",
      status: "JOINED",
      capacity: { max: 5, current: 2, waitlisted: 0 },
      joinedAt: "2025-11-28T02:37:59.290893",
    };
  }
}

// 그룹 탈퇴
export async function leaveStudyGroup(
  groupId: number
): Promise<{ groupId: number; userId: number; status: string }> {
  try {
    const res = await api.delete<{
      groupId: number;
      userId: number;
      status: string;
    }>(`/studygroup/${groupId}/members/me`);
    return res.data;
  } catch {
    return {
      groupId,
      userId: 4,
      status: "LEFT",
    };
  }
}

// 멤버 강퇴
export async function kickMember(
  groupId: number,
  memberId: number
): Promise<{
  groupId: number;
  groupMemberId: number;
  kickedUserId: number;
  kickedUserName: string;
  status: string;
}> {
  try {
    const res = await api.delete<{
      groupId: number;
      groupMemberId: number;
      kickedUserId: number;
      kickedUserName: string;
      status: string;
    }>(`/studygroup/${groupId}/members/${memberId}`);

    return res.data;
  } catch {
    return {
      groupId,
      groupMemberId: memberId,
      kickedUserId: 4,
      kickedUserName: "이철수",
      status: "KICKED",
    };
  }
}

// 문제 리스트 생성
export async function createProblemList(
  groupId: number,
  data: {
    listTitle: string;
    dueDate: string;
    problems: number[];
  }
): Promise<CreateProblemListResponse> {
  try {
    const res = await api.post<CreateProblemListResponse>(
      `/studygroup/${groupId}/problem/lists`,
      data
    );
    return res.data;
  } catch {
    return {
      problemListId: 999,
      listTitle: data.listTitle,
      dueDate: data.dueDate,
    };
  }
}

// 문제 리스트 전체 조회
export async function fetchAssignedProblemLists(
  groupId: number
): Promise<AssignedProblemList[]> {
  try {
    const res = await api.get<AssignedProblemList[]>(
      `/studygroup/${groupId}/problem/lists`
    );
    return res.data;
  } catch (err) {
    console.error("fetchAssignedProblemLists 실패 → 더미 사용");
    return DUMMY_ASSIGNED_LISTS;
  }
}

// 특정 문제 리스트 상세 조회
export async function fetchAssignedProblemListDetail(
  groupId: number,
  problemListId: number
): Promise<AssignedProblemList> {
  try {
    const res = await api.get<AssignedProblemList>(
      `/studygroup/${groupId}/problem/lists/${problemListId}`
    );
    return res.data;
  } catch (err) {
    console.error("fetchAssignedProblemListDetail 실패 → fallback");
    return DUMMY_ASSIGNED_LIST_DETAIL;
  }
}

// 문제 리스트 수정
export async function updateProblemList(
  groupId: number,
  problemListId: number,
  data: {
    listTitle: string;
    dueDate: string;
    problems: number[];
  }
): Promise<UpdateProblemListResponse> {
  try {
    const res = await api.put<UpdateProblemListResponse>(
      `/studygroup/${groupId}/problem/lists/${problemListId}`,
      data
    );
    return res.data;
  } catch {
    return {
      problemListId,
      listTitle: data.listTitle,
      dueDate: data.dueDate,
    };
  }
}

// 문제 리스트 삭제
export async function deleteProblemList(
  groupId: number,
  problemListId: number
): Promise<DeleteProblemListResponse> {
  try {
    const res = await api.delete<DeleteProblemListResponse>(
      `/studygroup/${groupId}/problem/lists/${problemListId}`
    );
    return res.data;
  } catch {
    return { message: "Problem list deleted" };
  }
}

// 활동 기록 조회
export async function fetchActivityLogs(
  groupId: number
): Promise<ActivityResponse> {
  try {
    const res = await api.get<ActivityResponse>(
      `/studygroup/${groupId}/activities`
    );
    return res.data;
  } catch (err) {
    console.error("fetchActivityLogs 실패 → fallback");

    return {
      content: DUMMY_ACTIVITY_LOGS,
      page: 1,
      size: 10,
      totalPages: 1,
      totalElements: DUMMY_ACTIVITY_LOGS.length,
    };
  }
}

//내 스터디그룹 조회
export async function fetchMyStudyGroups(): Promise<StudyGroup[]> {
  try {
    const res = await api.get<StudyGroup[]>("/studygroup/my");
    return res.data.map((g) => ({
      ...g,
      myRole: g.myRole as GroupRole,
    }));
  } catch (err) {
    console.error("fetchMyStudyGroups 실패 → 더미 사용");
    return DUMMY_GROUPS.filter((g) => g.myRole !== "NONE");
  }
}
