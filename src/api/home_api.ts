import { api } from "./axios";

// 1) 평판 랭킹
export interface IReputationRankingItem {
  userId: number;
  rank: number;
  delta: number;
}

// 2) 문제 조회수 랭킹
export interface IProblemRankingItem {
  rank: number;
  delta: number;
  problemId: number;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  views: number;
  // rankDate?: string; // 안 쓸 거라 주석 처리
}

// 3) 코드 리뷰 랭킹
export interface IReviewRankingItem {
  id: number;
  authorId: number;
  rank: number;
  delta: number;
  vote: number;
}

export async function getReputationRanking(): Promise<
  IReputationRankingItem[]
> {
  const res = await api.get("/UNIDE/rank/user/reputation");
  return res.data;
}

export async function getProblemRanking(
  date?: string
): Promise<IProblemRankingItem[]> {
  const res = await api.get("/UNIDE/rank/problem/views", {
    params: date ? { date } : undefined,
  });
  return res.data;
}

export async function getReviewRanking(): Promise<IReviewRankingItem[]> {
  const res = await api.get("/UNIDE/rank/reviews");
  return res.data;
}
