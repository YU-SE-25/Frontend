import type {
  StudyGroupPostListResponse,
  StudyGroupPostDetail,
  StudyGroupComment,
} from "../studygroupdiscussion_api";

// 게시글 리스트 더미
export const DUMMY_STUDY_DISCUSS_LIST: StudyGroupPostListResponse = {
  page: 1,
  pageSize: 10,
  total: 2,
  posts: [
    {
      post_id: 1,
      post_title: "🔥 이번 주 목표 공유합니다",
      author: "김철수",
      tag: "일반",
      anonymity: false,
      like_count: 5,
      comment_count: 2,
      create_time: "2025-11-10T10:00:00Z",
    },
    {
      post_id: 2,
      post_title: "DP 문제에서 막혔어요 ㅠㅠ",
      author: "익명",
      tag: "질문",
      anonymity: true,
      like_count: 1,
      comment_count: 4,
      create_time: "2025-11-11T10:00:00Z",
    },
  ],
};

// 게시글 상세 더미
export const DUMMY_STUDY_DISCUSS_DETAIL: StudyGroupPostDetail = {
  post_id: 1,
  post_title: "이번 주 목표 공유합니다",
  contents: "다들 이번 주 공부 목표 공유해주세요!",
  author: "김철수",
  tag: "일반",
  anonymity: false,
  like_count: 5,
  comment_count: 2,
  create_time: "2025-11-10T10:00:00Z",
  modify_time: "2025-11-10T11:00:00Z",
};

//댓글 리스트 더미
export const DUMMY_STUDY_DISCUSS_COMMENTS: StudyGroupComment[] = [
  {
    comment_id: 201,
    author: "홍길동",
    contents: "좋은 글 잘 읽었습니다!",
    anonymity: false,
    like_count: 2,
    create_time: "2025-11-10T10:10:00Z",
  },
  {
    comment_id: 202,
    author: "익명",
    contents: "저도 이번 주 목표는 DP 정복입니다!",
    anonymity: true,
    like_count: 0,
    create_time: "2025-11-10T10:12:00Z",
  },
  {
    comment_id: 203,
    author: "김코딩",
    contents: "화이팅입니다!",
    anonymity: false,
    like_count: 1,
    create_time: "2025-11-10T10:15:00Z",
  },
];
