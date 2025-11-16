export const dummyProblemRanking = [
  { rank: 1, title: "두 수의 합", view: 325, weekly_views: 47 },
  { rank: 2, title: "연속 부분합", view: 417, weekly_views: 39 },
];

export const dummyReputationRanking = [
  { id: 20251103, user_id: "vochan", rank: 1, delta: 10 },
  { id: 20251104, user_id: "danbi", rank: 2, delta: 6 },
];

export const dummyReviewRanking = [
  {
    id: 20251103,
    user_id: "vochan",
    rank: 1,
    delta: 10,
    vote: 2000,
    problem_title: "연속 부분합",
    review_title: "DP 로직 개선 리뷰",
  },
  {
    id: 20251104,
    user_id: "danbi",
    rank: 2,
    delta: 6,
    vote: 1200,
    problem_title: "두 수의 합",
    review_title: "코드 최적화 리뷰",
  },
];
