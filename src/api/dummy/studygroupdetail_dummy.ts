import type {
  StudyGroup,
  AssignedProblem,
  AssignedProblemList,
  ActivityLog,
} from "../studygroup_api";

export const DUMMY_GROUP_DETAIL: StudyGroup = {
  group_id: 101,
  group_name: "시리우스",
  group_leader: 12345,
  created_at: "2025-10-30T10:00:00Z",
  group_goal: "최선을 다하자!",
  group_description:
    "대기업 취업을 목표로 만든 스터디 그룹입니다. 열심히 하실 분들만 들어오세요.", // 추가
  leader_name: "팀장 이름", // 추가
  myRole: "LEADER", // 추가
  max_members: 10, // 추가
  groupmember_id: [12345, 23456, 34567, 56789],
};

// 💡 5개짜리 문제 목록 더미
const PROBLEMS_SET_A: AssignedProblem[] = [
  // problem_id: 101, 102, 103, 104, 105 (총 5개)
  // 3개는 '제출완료', 2개는 '미제출'로 설정
  // (문제 제목은 이전에 정의된 더미 데이터 사용 가정)
  {
    problem_id: 101,
    problem_title: "피보나치 수열",
    anonymity: false,
    like_count: 1,
    comment_count: 0,
    create_time: "2025-10-25T10:00:00Z",
    user_status: "제출완료",
  },
  {
    problem_id: 102,
    problem_title: "최단 거리",
    anonymity: false,
    like_count: 0,
    comment_count: 0,
    create_time: "2025-10-25T10:00:00Z",
    user_status: "미제출",
  },
  {
    problem_id: 103,
    problem_title: "BFS 기본",
    anonymity: false,
    like_count: 5,
    comment_count: 2,
    create_time: "2025-10-26T11:00:00Z",
    user_status: "제출완료",
  },
  {
    problem_id: 104,
    problem_title: "DP 문제 1",
    anonymity: false,
    like_count: 0,
    comment_count: 0,
    create_time: "2025-10-26T11:00:00Z",
    user_status: "미제출",
  },
  {
    problem_id: 105,
    problem_title: "DP 문제 2",
    anonymity: false,
    like_count: 0,
    comment_count: 0,
    create_time: "2025-10-26T11:00:00Z",
    user_status: "제출완료",
  },
];

// 💡 3개짜리 문제 목록 더미
const PROBLEMS_SET_B: AssignedProblem[] = [
  // problem_id: 201, 202, 203 (총 3개)
  // 1개는 '제출완료', 2개는 '미제출'로 설정
  {
    problem_id: 201,
    problem_title: "그리디 문제 1",
    anonymity: false,
    like_count: 3,
    comment_count: 0,
    create_time: "2025-10-27T12:00:00Z",
    user_status: "제출완료",
  },
  {
    problem_id: 202,
    problem_title: "투 포인터",
    anonymity: false,
    like_count: 0,
    comment_count: 0,
    create_time: "2025-10-27T12:00:00Z",
    user_status: "미제출",
  },
  {
    problem_id: 203,
    problem_title: "최대 힙 구현",
    anonymity: false,
    like_count: 0,
    comment_count: 0,
    create_time: "2025-10-27T12:00:00Z",
    user_status: "미제출",
  },
];

// 💡 할당된 문제 목록 그룹 (ProblemListTab에서 사용할 데이터)
export const DUMMY_ASSIGNED_LISTS: AssignedProblemList[] = [
  {
    assignedId: 10,
    listTitle: "주간 기본기 다지기 (5문제)",
    dueDate: "2025-11-05",
    totalProblems: 5,
    submittedCount: 3,
    problems: PROBLEMS_SET_A,
  },
  {
    assignedId: 11,
    listTitle: "알고리즘 심화 (3문제)",
    dueDate: "2025-11-12",
    totalProblems: 3,
    submittedCount: 1,
    problems: PROBLEMS_SET_B,
  },
];

export const DUMMY_ACTIVITY_LOGS: ActivityLog[] = [
  {
    icon: "👤",
    text: "홍길동님이 그룹에 가입했습니다.",
    date: "2025-11-01",
  },
  {
    icon: "🗑️",
    text: "그룹장이 멤버 김코딩님을 강퇴했습니다.",
    date: "2025-11-02",
  },
  {
    icon: "🧩",
    text: "문제 리스트 'DP 기초 5문제'가 추가되었습니다.",
    date: "2025-11-02",
  },
  {
    icon: "💬",
    text: "새로운 토론글이 작성되었습니다.",
    date: "2025-11-03",
  },
];
