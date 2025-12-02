// 리스트 아이템 더미 (GET /studygroup/discuss/{groupId})
export const DUMMY_DISCUSSION_LIST = [
  {
    postId: 2,
    groupId: 3,
    authorId: 2,
    anonymous: true,
    title: "테스트 제목입니다22",
    contents: "테스트 내용입니다22",
    privatePost: false,
    likeCount: 0,
    commentCount: 0,
    attachmentUrl: null,
    message: null,
    viewerLiked: false,
  },
  {
    postId: 1,
    groupId: 3,
    authorId: 2,
    anonymous: false,
    title: "테스트 제목입니다",
    contents: "테스트 내용입니다",
    privatePost: false,
    likeCount: 0,
    commentCount: 0,
    attachmentUrl: null,
    message: null,
    viewerLiked: false,
  },
];

// 상세 조회(원본 API 구조!) GET /studygroup/discuss/{groupId}/{postId}
export const DUMMY_DISCUSSION_DETAIL = {
  post_id: 1,
  post_title: "테스트 제목입니다",
  contents: "테스트 내용입니다",
  author: "홍길동",
  tag: "코딩테스트",
  anonymity: false,
  like_count: 12,
  comment_count: 3,
  create_time: "2025-10-18T09:00:00Z",
  modify_time: "2025-10-18T09:10:00Z",
};

// 좋아요 더미
export const DUMMY_DISCUSSION_LIKE = {
  postId: 1,
  groupId: 3,
  authorId: 2,
  anonymous: false,
  title: "테스트 제목입니다",
  contents: "테스트 내용입니다",
  privatePost: false,
  likeCount: 1,
  commentCount: 0,
  attachmentUrl: null,
  message: "❤️ 좋아요 추가",
  viewerLiked: true,
};

// 첨부 업로드 응답 더미
export const DUMMY_DISCUSSION_ATTACHMENT = {
  post_id: 1,
  updated_at: "2025-11-27T15:04:01.2389389",
  message: "첨부파일이 등록되었습니다.",
};

// 투표 조회 더미
export const DUMMY_DISCUSSION_POLL = {
  message: null,
  pollId: 4,
  postId: 1,
  question: "오늘 저녁 뭐 먹을래?",
  options: [
    { optionId: 1, label: "1", content: "치킨", voteCount: 0 },
    { optionId: 2, label: "2", content: "피자", voteCount: 0 },
    { optionId: 3, label: "3", content: "햄버거", voteCount: 1 },
  ],
  totalVotes: 1,
  alreadyVoted: true,
  createdAt: "2025-11-27T15:10:52",
};

// 투표 생성 더미
export const DUMMY_POLL_CREATE = {
  message: "투표가 생성되었습니다.",
  pollId: 4,
  postId: 1,
  question: null,
  options: null,
  totalVotes: 0,
  alreadyVoted: false,
  createdAt: "2025-11-27T15:10:51.5409319",
};

// 검색 결과 더미
export const DUMMY_DISCUSSION_SEARCH = [
  {
    postId: 2,
    groupId: 3,
    authorId: 2,
    anonymous: true,
    title: "테스트 제목입니다22",
    contents: "테스트 내용입니다22",
    privatePost: false,
    likeCount: 0,
    commentCount: 0,
    attachmentUrl: null,
    message: null,
    viewerLiked: false,
  },
];
