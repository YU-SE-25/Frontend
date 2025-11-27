import { useState } from "react";
import styled from "styled-components";
import CodePreview from "./CodePreview";
import { timeConverter } from "../../../utils/timeConverter";
import { isOwner } from "../../../utils/isOwner";

const ReviewSectionTitle = styled.h2`
  margin-top: 24px;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const ReviewCount = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}88;
  margin-left: 6px;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ReviewItem = styled.div<{ $expanded: boolean }>`
  width: 100%;
  text-align: left;
  border-radius: 10px;
  border: 1px solid
    ${({ theme, $expanded }) =>
      $expanded ? theme.focusColor : `${theme.textColor}33`};
  background: ${({ theme, $expanded }) =>
    $expanded ? `${theme.focusColor}11` : theme.bgColor};
  padding: 10px 12px;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    background: ${({ theme, $expanded }) =>
      $expanded ? "" : `${theme.textColor}0f`};
  }
`;

const ReviewTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const LineTag = styled.span`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.textColor}44;
  color: ${({ theme }) => theme.textColor};
`;

const LineCodeText = styled.span`
  font-family: "Consolas", monospace;
  font-size: 12px;
  color: ${({ theme }) => theme.textColor}cc;
  flex: 1;
  margin-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReviewMeta = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.textColor}88;
`;

const LikeButton = styled.button<{ $liked?: boolean }>`
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid
    ${({ theme, $liked }) =>
      $liked ? theme.textColor + "55" : theme.textColor + "33"};
  background: ${({ theme, $liked }) =>
    $liked ? theme.textColor + "11" : theme.bgColor};
  font-size: 11px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};

  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${({ theme, $liked }) =>
      $liked ? theme.textColor + "11" : theme.textColor + "11"};
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

const ReviewPreview = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor};
`;

const ReviewFull = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}dd;
  line-height: 1.4;
`;

const CommentSection = styled.div`
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.textColor}22;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CommentHeader = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textColor}99;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CommentItem = styled.div`
  padding: 6px 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.headerBgColor}22;
`;

const CommentMeta = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.textColor}88;
  margin-bottom: 2px;
`;

const CommentContent = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}dd;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 6px;
  margin-top: 4px;
`;

const CommentInput = styled.textarea`
  flex: 1;
  min-height: 40px;
  max-height: 80px;
  resize: vertical;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.textColor}44;
  padding: 6px 8px;
  font-size: 13px;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
`;

const CommentSubmitBtn = styled.button`
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.focusColor};
  color: #000;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    filter: brightness(0.93);
  }
`;

const CommentActionButton = styled.button<{ $danger?: boolean }>`
  margin-left: 6px;
  font-size: 11px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: ${({ theme, $danger }) => ($danger ? "#ff4d4f" : theme.muteColor)};

  &:hover {
    text-decoration: underline;
  }
`;

const ReviewEmptyText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textColor}99;
  margin-top: 4px;
`;

type ReviewComment = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
};

export type Review = {
  id: number;
  lineNumber: number;
  content: string;
  author: string;
  createdAt: string;
  voteCount: number;
  comments: ReviewComment[];
};

interface ReviewSectionProps {
  code: string;
  language: string;
  reviews: Review[];
  onChangeReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

export default function ReviewSection({
  code,
  language,
  reviews,
  onChangeReviews,
}: ReviewSectionProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>(
    {}
  );
  const [editingTarget, setEditingTarget] = useState<{
    reviewId: number;
    commentId: number;
  } | null>(null);

  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editReviewTarget, setEditReviewTarget] = useState<{
    lineNumber: number;
    lineCode: string;
    content: string;
  } | null>(null);

  // ✅ 이 세션에서 어떤 리뷰를 좋아요 눌렀는지 기록
  const [likedReviews, setLikedReviews] = useState<Record<number, boolean>>({});

  const codeLines = code.split("\n");
  const getLineContent = (lineNumber: number) =>
    codeLines[lineNumber - 1] ?? "";

  const handleToggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const makePreview = (content: string, max = 40) => {
    if (content.length <= max) return content;
    return content.slice(0, max) + "…";
  };

  const handleCommentChange = (reviewId: number, value: string) => {
    setCommentDrafts((prev) => ({
      ...prev,
      [reviewId]: value,
    }));
  };

  const handleCommentSubmit = (e: React.FormEvent, reviewId: number) => {
    e.preventDefault();
    const text = commentDrafts[reviewId]?.trim();
    if (!text) return;

    const isEditing = editingTarget && editingTarget.reviewId === reviewId;

    if (isEditing && editingTarget) {
      onChangeReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                comments: r.comments.map((c) =>
                  c.id === editingTarget.commentId
                    ? {
                        ...c,
                        content: text,
                        createdAt: new Date().toISOString(),
                      }
                    : c
                ),
              }
            : r
        )
      );
      setEditingTarget(null);
    } else {
      onChangeReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                comments: [
                  ...r.comments,
                  {
                    id: Date.now(),
                    author: "현재유저",
                    content: text,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : r
        )
      );
    }

    setCommentDrafts((prev) => ({
      ...prev,
      [reviewId]: "",
    }));
  };

  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.id);
    setEditReviewTarget({
      lineNumber: review.lineNumber,
      lineCode: getLineContent(review.lineNumber),
      content: review.content,
    });
    setExpandedId(review.id);
  };

  const handleDeleteReview = (reviewId: number) => {
    const ok = window.confirm("리뷰를 삭제하시겠습니까?");
    if (!ok) return;

    onChangeReviews((prev) => prev.filter((r) => r.id !== reviewId));

    if (editingReviewId === reviewId) {
      setEditingReviewId(null);
      setEditReviewTarget(null);
    }

    alert("삭제되었습니다.");
  };

  const handleEditComment = (reviewId: number, comment: ReviewComment) => {
    setEditingTarget({ reviewId, commentId: comment.id });
    setCommentDrafts((prev) => ({
      ...prev,
      [reviewId]: comment.content,
    }));
  };

  const handleDeleteComment = (reviewId: number, commentId: number) => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (!ok) return;

    onChangeReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              comments: r.comments.filter((c) => c.id !== commentId),
            }
          : r
      )
    );

    setEditingTarget((prev) =>
      prev && prev.reviewId === reviewId && prev.commentId === commentId
        ? null
        : prev
    );

    setCommentDrafts((prev) => {
      const next = { ...prev };
      next[reviewId] = "";
      return next;
    });

    alert("삭제되었습니다.");
  };

  const handleLikeReview = (e: React.MouseEvent, reviewId: number) => {
    e.stopPropagation(); // 리뷰 열기 토글 막기

    setLikedReviews((prev) => {
      if (prev[reviewId]) {
        // 이미 눌렀으면 무시
        return prev;
      }

      // 처음 누를 때만 voteCount 증가
      onChangeReviews((prevReviews) =>
        prevReviews.map((r) =>
          r.id === reviewId ? { ...r, voteCount: r.voteCount + 1 } : r
        )
      );

      return {
        ...prev,
        [reviewId]: true,
      };
    });
  };

  return (
    <>
      <CodePreview
        code={code}
        language={language}
        editReviewTarget={editReviewTarget}
        onEditReview={({ lineNumber, lineCode, content }) => {
          if (editingReviewId == null) return;
          onChangeReviews((prev) =>
            prev.map((r) =>
              r.id === editingReviewId
                ? {
                    ...r,
                    lineNumber,
                    content,
                    createdAt: new Date().toISOString(),
                  }
                : r
            )
          );
          setEditingReviewId(null);
          setEditReviewTarget(null);
        }}
        onAddReview={({ lineNumber, lineCode, content }) => {
          const newReview: Review = {
            id: Date.now(),
            lineNumber,
            content,
            author: "현재유저",
            createdAt: new Date().toISOString(),
            voteCount: 0,
            comments: [],
          };
          onChangeReviews((prev) => [...prev, newReview]);
          setExpandedId(newReview.id);
        }}
      />

      <ReviewSectionTitle>
        코드 리뷰
        <ReviewCount>({reviews.length})</ReviewCount>
      </ReviewSectionTitle>

      {reviews.length === 0 ? (
        <ReviewEmptyText>아직 등록된 리뷰가 없습니다.</ReviewEmptyText>
      ) : (
        <ReviewList>
          {reviews.map((review) => {
            const expanded = expandedId === review.id;
            const lineCode = getLineContent(review.lineNumber);
            const isEditingThisReview =
              editingTarget && editingTarget.reviewId === review.id;
            const liked = !!likedReviews[review.id];

            return (
              <ReviewItem
                key={review.id}
                $expanded={expanded}
                onClick={() => handleToggle(review.id)}
              >
                <ReviewTopRow>
                  <LineTag>{review.lineNumber}번째 줄</LineTag>
                  <LineCodeText>{lineCode}</LineCodeText>
                  <ReviewMeta>
                    <LikeButton
                      type="button"
                      $liked={liked}
                      disabled={liked}
                      onClick={(e) => handleLikeReview(e, review.id)}
                    >
                      👍 {review.voteCount}
                    </LikeButton>
                    {isOwner(review) && (
                      <>
                        <CommentActionButton
                          type="button"
                          onClick={() => handleEditReview(review)}
                        >
                          수정
                        </CommentActionButton>

                        <CommentActionButton
                          type="button"
                          $danger
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          삭제
                        </CommentActionButton>
                      </>
                    )}
                    {review.author} · {timeConverter(review.createdAt)}
                  </ReviewMeta>
                </ReviewTopRow>

                {!expanded && (
                  <ReviewPreview>{makePreview(review.content)}</ReviewPreview>
                )}

                {expanded && (
                  <>
                    <ReviewFull>{review.content}</ReviewFull>

                    <CommentSection onClick={(e) => e.stopPropagation()}>
                      <CommentHeader>
                        댓글 {review.comments.length}개
                      </CommentHeader>

                      <CommentList>
                        {review.comments.map((c) => (
                          <CommentItem key={c.id}>
                            <CommentMeta>
                              {c.author} · {timeConverter(c.createdAt)}
                              {isOwner(c) && (
                                <>
                                  <CommentActionButton
                                    type="button"
                                    onClick={() =>
                                      handleEditComment(review.id, c)
                                    }
                                  >
                                    수정
                                  </CommentActionButton>
                                  <CommentActionButton
                                    type="button"
                                    $danger
                                    onClick={() =>
                                      handleDeleteComment(review.id, c.id)
                                    }
                                  >
                                    삭제
                                  </CommentActionButton>
                                </>
                              )}
                            </CommentMeta>
                            <CommentContent>{c.content}</CommentContent>
                          </CommentItem>
                        ))}
                      </CommentList>

                      <CommentForm
                        onSubmit={(e) => handleCommentSubmit(e, review.id)}
                      >
                        <CommentInput
                          placeholder="댓글을 입력하세요."
                          value={commentDrafts[review.id] ?? ""}
                          onChange={(e) =>
                            handleCommentChange(review.id, e.target.value)
                          }
                        />
                        <CommentSubmitBtn type="submit">
                          {isEditingThisReview ? "댓글 수정" : "등록"}
                        </CommentSubmitBtn>
                      </CommentForm>
                    </CommentSection>
                  </>
                )}
              </ReviewItem>
            );
          })}
        </ReviewList>
      )}
    </>
  );
}
