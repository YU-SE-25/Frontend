import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import CodePreview from "../../components/CodePreview";

import { fetchSubmissionById } from "../../api/mySubmissions_api";
import {
  fetchReviewsBySolution,
  fetchCommentsByReview,
} from "../../api/solution_api";

import { timeConverter } from "../../utils/timeConverter";
import SolveResult from "./SolveResult";
import { ButtonContainer } from "../../theme/ProblemList.Style";

// ===================== 스타일 =====================

const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 32px 24px;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.bgColor};
`;

const Inner = styled.div`
  width: 100%;
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
`;

const Heading = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.textColor};
`;

const MetaRow = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textColor}99;
  margin-top: 4px;
`;

const ErrorText = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
`;

const ShareButton = styled.button<{ $active: boolean }>`
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  border: 1px solid ${({ theme }) => theme.focusColor};
  cursor: pointer;

  background: ${({ theme, $active }) =>
    $active ? theme.focusColor : "transparent"};

  color: ${({ theme, $active }) =>
    $active ? theme.bgColor : theme.focusColor};

  transition: background 0.15s ease, color 0.15s ease, filter 0.15s ease;

  &:hover {
    filter: brightness(0.95);
  }
`;

const RetryButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  border: none;
  background: ${({ theme }) => theme.textColor};
  color: ${({ theme }) => theme.bgColor};
  cursor: pointer;

  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(0.95);
  }
`;
// 리뷰 섹션
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

const ReviewItem = styled.button<{ $expanded: boolean }>`
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
  font-size: 12px;
  color: ${({ theme }) => theme.textColor}88;
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

/* 댓글 영역 */

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

// ===================== 타입 =====================

type ReviewComment = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
};

type Review = {
  id: number;
  lineNumber: number;
  content: string;
  author: string;
  createdAt: string;
  comments: ReviewComment[];
};

// 새 API 언어코드까지 커버하도록 확장
const langMap: Record<string, string> = {
  C: "c",
  CPP: "cpp",
  "C++": "cpp",
  Java: "java",
  JAVA: "java",
  Python: "python",
  PYTHON: "python",
  Python3: "python",
  PYTHON3: "python",
  JS: "javascript",
  TS: "typescript",
};

// ===================== 컴포넌트 =====================

export default function MySubmissionsDetail() {
  // URL 예: /my-submissions/:solutionId
  const { solutionId } = useParams<{ solutionId: string }>();

  const [code, setCode] = useState("");
  const [rawLang, setRawLang] = useState("C");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isShared, setIsShared] = useState(false);
  const [problemId, setProblemId] = useState<number | null>(null);
  // 제출 메타 (제출 시각 / 메모리 / 실행시간)
  const [solutionMeta, setSolutionMeta] = useState<{
    createdAt: string;
    memory: number;
    runtime: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // 코드 + 리뷰/댓글 로딩
  useEffect(() => {
    if (!solutionId) {
      setError("유효하지 않은 접근입니다.");
      setLoading(false);
      return;
    }

    const submissionId = Number(solutionId);
    if (Number.isNaN(submissionId)) {
      setError("잘못된 제출 ID입니다.");
      setLoading(false);
      return;
    }

    let mounted = true;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) 제출 정보 가져오기 (코드 + 메타)
        const submission = await fetchSubmissionById(submissionId);

        if (!mounted) return;

        if (!submission) {
          setError("제출 정보를 찾을 수 없습니다.");
          return;
        }

        // submission 안에 language / submittedAt / memory / runtime 있다고 가정
        setCode(`#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
`);
        setRawLang(submission.language);
        setSolutionMeta({
          createdAt: submission.submittedAt,
          memory: submission.memory,
          runtime: submission.runtime,
        });
        setProblemId(submission.problemId);

        // 2) 이 제출에 대한 리뷰 목록
        const reviewsRes = await fetchReviewsBySolution(submissionId);

        let reviewsWithComments: Review[] = [];

        if (reviewsRes && reviewsRes.reviews.length > 0) {
          reviewsWithComments = await Promise.all(
            reviewsRes.reviews.map(async (r) => {
              const commentsRes = await fetchCommentsByReview(r.reviewId);

              const comments: ReviewComment[] =
                commentsRes?.comments.map((c) => ({
                  id: c.commentId,
                  author: c.commenter,
                  content: c.content,
                  createdAt: c.createdAt,
                })) ?? [];

              return {
                id: r.reviewId,
                lineNumber: r.lineNumber,
                content: r.content,
                author: r.reviewer,
                createdAt: r.createdAt,
                comments,
              };
            })
          );
        }

        if (!mounted) return;

        setReviews(reviewsWithComments);
      } catch (e) {
        if (mounted) {
          console.error("MySubmissionsDetail load error:", e);
          setError("제출된 코드를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [solutionId]);

  const hlLang = langMap[rawLang] || "text";

  // 로딩 상태
  if (loading) {
    return (
      <Page>
        <Inner>
          <HeadingRow>
            <Heading>내 코드 보기</Heading>
          </HeadingRow>
          <MetaRow>코드를 불러오는 중입니다…</MetaRow>
        </Inner>
      </Page>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Page>
        <Inner>
          <HeadingRow>
            <Heading>내 코드 보기</Heading>
          </HeadingRow>
          <ErrorText>{error}</ErrorText>
        </Inner>
      </Page>
    );
  }

  // 코드 없음
  if (!code) {
    return (
      <Page>
        <Inner>
          <HeadingRow>
            <Heading>내 코드 보기</Heading>
          </HeadingRow>
          <ErrorText>표시할 코드가 없습니다.</ErrorText>
        </Inner>
      </Page>
    );
  }

  const codeLines = code.split("\n");
  const handleToggleShare = () => {
    const ok = window.confirm(
      isShared
        ? "코드 공유를 해제하시겠습니까?"
        : "코드를 다른 사람과 공유하시겠습니까?"
    );

    if (!ok) return;

    setIsShared((prev) => !prev);
  };

  const getLineContent = (lineNumber: number) =>
    codeLines[lineNumber - 1] ?? "";

  const handleToggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const makePreview = (content: string, max = 40) => {
    if (content.length <= max) return content;
    return content.slice(0, max) + "…";
  };

  return (
    <Page>
      <Inner>
        <HeadingRow>
          <Heading>내 코드 보기</Heading>
        </HeadingRow>

        {/* 풀이 메타 (언어 / 제출 시각 / 메모리 / 실행시간) */}
        <MetaRow>
          언어: {rawLang}
          {solutionMeta && (
            <>
              {" · 제출 시각: "}
              {solutionMeta.createdAt}
              {" · 메모리: "}
              {solutionMeta.memory}MB
              {" · 실행시간: "}
              {solutionMeta.runtime}ms
            </>
          )}
        </MetaRow>

        <CodePreview code={code} language={hlLang} />
        <ButtonContainer>
          <ShareButton $active={isShared} onClick={handleToggleShare}>
            {isShared ? "공유중" : "코드 공유"}
          </ShareButton>

          <RetryButton onClick={() => navigate(`/problems/${problemId}/solve`)}>
            다시 풀기
          </RetryButton>
        </ButtonContainer>

        <ReviewSectionTitle>
          코드 리뷰
          <ReviewCount>({reviews.length})</ReviewCount>
        </ReviewSectionTitle>

        {reviews.length === 0 ? (
          <MetaRow>아직 등록된 리뷰가 없습니다.</MetaRow>
        ) : (
          <ReviewList>
            {reviews.map((review) => {
              const expanded = expandedId === review.id;
              const lineCode = getLineContent(review.lineNumber);

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
                                {c.author} · {c.createdAt}
                              </CommentMeta>
                              <CommentContent>{c.content}</CommentContent>
                            </CommentItem>
                          ))}
                        </CommentList>
                      </CommentSection>
                    </>
                  )}
                </ReviewItem>
              );
            })}
          </ReviewList>
        )}
      </Inner>
    </Page>
  );
}
