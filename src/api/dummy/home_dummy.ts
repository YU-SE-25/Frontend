import type {
  IReputationRankingItem,
  IProblemRankingItem,
  IReviewRankingItem,
} from "../home_api";

// 평판 랭킹 더미
export const dummyReputationRanking: IReputationRankingItem[] = [
  { userId: 1, rank: 1, delta: 0 },
  { userId: 2, rank: 2, delta: -1 },
  { userId: 3, rank: 3, delta: +1 },
];

// 문제 조회수 랭킹 더미
export const dummyProblemRanking: IProblemRankingItem[] = [
  {
    rank: 1,
    delta: 1,
    problemId: 1,
    title: "더미 문제 1",
    difficulty: "EASY",
    views: 150,
  },
  {
    rank: 2,
    delta: 0,
    problemId: 2,
    title: "더미 문제 2",
    difficulty: "MEDIUM",
    views: 120,
  },
];

// 리뷰 랭킹 더미
export const dummyReviewRanking: IReviewRankingItem[] = [
  { id: 9, authorId: 1, rank: 1, delta: 0, vote: 5 },
  { id: 10, authorId: 3, rank: 2, delta: -1, vote: 4 },
];
