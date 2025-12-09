import { api } from "./axios";

export type ReportTargetType =
  | "DIS_POST"
  | "DIS_COMMENT"
  | "QNA_POST"
  | "QNA_COMMENT"
  | "REVIEW"
  | "REVIEW_COMMENT";

export interface ReportRequestBody {
  targetId: number;
  reportType: ReportTargetType;
  title: string;
  reason: string;
}

export async function reportDisBoardPost(
  postId: number,
  reportType: ReportTargetType,
  title: string,
  reason: string
): Promise<void> {
  const body: ReportRequestBody = {
    targetId: postId,
    reportType,
    title,
    reason,
  };

  await api.post(`/dis_board/${postId}/reports`, body);
}

export async function reportDisBoardComment(
  commentId: number,
  reportType: ReportTargetType,
  title: string,
  reason: string
): Promise<void> {
  const body: ReportRequestBody = {
    targetId: commentId,
    reportType,
    title,
    reason,
  };

  await api.post(`/dis_board/comment/${commentId}/reports`, body);
}

export async function reportQnaPost(
  postId: number,
  reportType: ReportTargetType,
  title: string,
  reason: string
): Promise<void> {
  const body: ReportRequestBody = {
    targetId: postId,
    reportType,
    title,
    reason,
  };

  await api.post(`/qna_board/${postId}/reports`, body);
}

export async function reportQnaComment(
  commentId: number,
  reportType: ReportTargetType,
  title: string,
  reason: string
): Promise<void> {
  const body: ReportRequestBody = {
    targetId: commentId,
    reportType,
    title,
    reason,
  };

  await api.post(`/qna_board/comment/${commentId}/reports`, body);
}

export async function reportReview(
  reviewId: number,
  reportType: ReportTargetType,
  title: string,
  reason: string
): Promise<void> {
  const body: ReportRequestBody = {
    targetId: reviewId,
    reportType,
    title,
    reason,
  };

  await api.post(`/reviews/${reviewId}/reports`, body);
}

export async function reportReviewComment(
  reviewId: number,
  commentId: number,
  reportType: ReportTargetType,
  title: string,
  reason: string
): Promise<void> {
  const body: ReportRequestBody = {
    targetId: commentId,
    reportType,
    title,
    reason,
  };

  await api.post(`/reviews/${reviewId}/comments/${commentId}/reports`, body);
}

export interface CreateReportParams {
  targetContentType: ReportTargetType;
  targetContentId: number;
  reason: string;
  extraId?: number;
  title?: string;
}

export async function createReport({
  targetContentType,
  targetContentId,
  reason,
  extraId,
  title,
}: CreateReportParams): Promise<void> {
  const trimmedReason = reason.trim();
  const baseTitle = (title ?? "").trim() || trimmedReason || "신고";
  const finalTitle = baseTitle.length > 10 ? baseTitle.slice(0, 10) : baseTitle;

  switch (targetContentType) {
    case "DIS_POST":
      await reportDisBoardPost(
        targetContentId,
        targetContentType,
        finalTitle,
        trimmedReason
      );
      break;

    case "DIS_COMMENT":
      await reportDisBoardComment(
        targetContentId,
        targetContentType,
        finalTitle,
        trimmedReason
      );
      break;

    case "QNA_POST":
      await reportQnaPost(
        targetContentId,
        targetContentType,
        finalTitle,
        trimmedReason
      );
      break;

    case "QNA_COMMENT":
      await reportQnaComment(
        targetContentId,
        targetContentType,
        finalTitle,
        trimmedReason
      );
      break;

    case "REVIEW":
      await reportReview(
        targetContentId,
        targetContentType,
        finalTitle,
        trimmedReason
      );
      break;

    case "REVIEW_COMMENT":
      if (!extraId) {
        throw new Error(
          "REVIEW_COMMENT 신고에는 extraId(reviewId)가 필요합니다."
        );
      }
      await reportReviewComment(
        extraId,
        targetContentId,
        targetContentType,
        finalTitle,
        trimmedReason
      );
      break;

    default:
      throw new Error(`지원하지 않는 신고 타입: ${targetContentType}`);
  }
}
