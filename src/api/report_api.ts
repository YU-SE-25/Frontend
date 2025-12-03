import { api } from "./axios";

export async function reportDisBoardPost(
  postId: number,
  reason: string
): Promise<void> {
  await api.post(`/dis_board/${postId}/reports`, { reason });
}

export async function reportDisBoardComment(
  commentId: number,
  reason: string
): Promise<void> {
  await api.post(`/dis_board/comment/${commentId}/reports`, { reason });
}

export async function reportQnaPost(
  postId: number,
  reason: string
): Promise<void> {
  await api.post(`/qna_board/${postId}/reports`, { reason });
}

export async function reportQnaComment(
  commentId: number,
  reason: string
): Promise<void> {
  await api.post(`/qna_board/comment/${commentId}/reports`, { reason });
}

export async function reportReview(
  reviewId: number,
  reason: string
): Promise<void> {
  await api.post(`/reviews/${reviewId}/reports`, { reason });
}

export async function reportReviewComment(
  reviewId: number,
  commentId: number,
  reason: string
): Promise<void> {
  await api.post(`/reviews/${reviewId}/comments/${commentId}/reports`, {
    reason,
  });
}

export type ReportTargetType =
  | "DIS_POST"
  | "DIS_COMMENT"
  | "QNA_POST"
  | "QNA_COMMENT"
  | "REVIEW"
  | "REVIEW_COMMENT";

export interface CreateReportParams {
  targetContentType: ReportTargetType;
  targetContentId: number;
  reason: string;
  extraId?: number;
}

export async function createReport({
  targetContentType,
  targetContentId,
  reason,
  extraId,
}: CreateReportParams): Promise<void> {
  switch (targetContentType) {
    case "DIS_POST":
      await reportDisBoardPost(targetContentId, reason);
      break;
    case "DIS_COMMENT":
      await reportDisBoardComment(targetContentId, reason);
      break;
    case "QNA_POST":
      await reportQnaPost(targetContentId, reason);
      break;
    case "QNA_COMMENT":
      await reportQnaComment(targetContentId, reason);
      break;
    case "REVIEW":
      await reportReview(targetContentId, reason);
      break;
    case "REVIEW_COMMENT":
      if (!extraId)
        throw new Error(
          "REVIEW_COMMENT 신고에는 extraId(reviewId)가 필요합니다."
        );
      await reportReviewComment(extraId, targetContentId, reason);
      break;
    default:
      throw new Error(`지원하지 않는 신고 타입: ${targetContentType}`);
  }
}
