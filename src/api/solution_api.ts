// 지금은 그냥 더미 전달하는용..

import {
  fetchSolvedCode as fetchSolvedCodeDummy,
  fetchReviewsBySolution as fetchReviewsBySolutionDummy,
  fetchCommentsByReview as fetchCommentsByReviewDummy,
} from "./dummy/solution_dummy";

export type ReviewsResponse = {
  totalPages: number;
  currentPage: number;
  reviews: ReviewItem[];
};

export type ReviewItem = {
  reviewId: number;
  reviewer: string;
  lineNumber: number;
  content: string;
  voteCount: number;
  createdAt: string; // ISO 8601 문자열 (UTC)
  owner: boolean;
};

export type ReviewComments = {
  totalPages: number;
  currentPage: number;
  comments: {
    commentId: number;
    commenter: string;
    content: string;
    createdAt: string; // ISO 8601
    owner: boolean;
  }[];
};

export type MySolvedCodeResponse = {
  totalPages: number;
  currentPage: number;
  solutions: {
    submissionId: number;
    username: string;
    code: string;
    submittedAt: string; // ISO 8601 문자열
    language: string; // e.g. "CPP", "C", "JAVA"
    runtime: number; // ms
    memory: number; // KB
  }[];
};

// ===================== 풀이 가져오기 =====================
export async function fetchSolvedCode(
  problemId: number
): Promise<MySolvedCodeResponse | null> {
  return fetchSolvedCodeDummy(problemId);
}
// ===================== 리뷰 가져오기 =====================
export async function fetchReviewsBySolution(
  submissionId: number
): Promise<ReviewsResponse | null> {
  return fetchReviewsBySolutionDummy(submissionId);
}
// ===================== 리뷰 댓글 가져오기 =====================
export async function fetchCommentsByReview(
  reviewId: number
): Promise<ReviewComments | null> {
  return fetchCommentsByReviewDummy(reviewId);
}
