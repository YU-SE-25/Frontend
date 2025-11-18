import axios from "axios";

//랭킹 관련 타입 정의
export interface IProblemRankingItem {
  rank: number;
  title: string;
  view: number;
  weekly_views: number;
}

export interface IReputationRankingItem {
  id: number;
  user_id: string;
  rank: number;
  delta: number;
}

export interface IReviewRankingItem {
  id: number;
  user_id: string;
  rank: number;
  delta: number;
  vote: number;
  problem_title: string;
  review_title: string;
}

//API 설정
const API = axios.create({
  baseURL: "/api/UNIDE/rank",
  withCredentials: true,
});

//API 호출 함수
export const getProblemRanking = () =>
  API.get<IProblemRankingItem[]>("/problem/views").then((res) => res.data);

export const getReputationRanking = () =>
  API.get<IReputationRankingItem[]>("/user/reputation").then((res) => res.data);

export const getReviewRanking = () =>
  API.get<IReviewRankingItem[]>("/reviews").then((res) => res.data);
