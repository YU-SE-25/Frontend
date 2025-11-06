import { DUMMY_TAGS } from "./dummy/studygroup_dummy";

export type GroupRole = "MEMBER" | "LEADER"; // 그룹 멤버 역할 타입

//그룹 목록 및 상세 정보 타입
export interface StudyGroup {
  group_id: number;
  group_name: string;
  group_leader: number; // 리더의 ID
  created_at: string; // ISO 날짜 문자열
  group_goal: string;

  group_description: string; // 💡 Frontend용 추가됨: 그룹 설명
  max_members: number; // 💡 Frontend용 추가됨: 최대 인원
  // 목록 조회 시에는 members가 단순 ID 배열로 올 수 있음
  groupmember_id: number[];
  // 💡 Frontend용 추가: 그룹장 이름 (BE에서 넘겨줘야 함)
  leader_name?: string;
  // 💡 Frontend용 추가: 현재 로그인한 사용자의 그룹 내 역할
  myRole?: GroupRole;
}

//그룹 생성 요청 본문 타입
export interface GroupCreatePayload {
  group_name: string;
  group_goal: string;
  // 💡 필드 누락: description, maxMembers, tags 등을 FE에서 추가해야 함.
  group_description: string; // 💡 Frontend용 추가됨
  max_members: number; // 💡 Frontend용 추가됨
  // 현재 API는 최소 필드만 받으므로, 이대로 유지합니다.
}

//문제 리스트 응답 타입
export interface AssignedProblem {
  problem_id: number;
  problem_title: string;
  anonymity: boolean;
  like_count: number;
  comment_count: number;
  create_time: string;
  // 💡 필수 추가: 문제 풀이 상태 (FE 구현에 필요)
  user_status: "제출완료" | "미제출";
}

//API 응답의 기본 구조 (페이지네이션 포함)
export interface PaginatedResponse<T> {
  page: number;
  pageSize: number;
  total: number;
  // API 명세에 따라 필드명은 'study group' 또는 'posts'로 유연하게 처리
  "study group"?: StudyGroup[];
  posts?: AssignedProblem[];
}
// 💡 새로운 타입: 할당된 문제 목록을 묶는 상위 구조
export interface AssignedProblemList {
  assignedId: number; // 이 목록 자체의 고유 ID
  listTitle: string; // 목록 제목 (예: DP 기본 문제)
  dueDate: string; // 제출 기한
  totalProblems: number; // 총 문제 수 (5)
  submittedCount: number; // 제출한 문제 수 (3)
  problems: AssignedProblem[]; // 하위 문제 배열
}

export async function fetchAvailableTags(): Promise<string[]> {
  // 실제 API를 사용하지 않고 더미 데이터를 반환하는 경우:
  return DUMMY_TAGS;
}
