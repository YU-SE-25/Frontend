import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { fetchSubmissionById } from "../../api/mySubmissions_api";
import {
  fetchReviewsBySolution,
  fetchCommentsByReview,
} from "../../api/solution_api";

import { timeConverter } from "../../utils/timeConverter";
import { ButtonContainer } from "../../theme/ProblemList.Style";
import ReviewSection from "./reviews/Review";
import type { Review } from "./reviews/Review";

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

// ===================== 타입 =====================

// Review 타입은 ../problem/Review 에서 import

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
  const { solutionId } = useParams<{ solutionId: string }>();

  const [code, setCode] = useState("");
  const [rawLang, setRawLang] = useState("C");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isShared, setIsShared] = useState(false);
  const [problemId, setProblemId] = useState<number | null>(null);

  const [solutionMeta, setSolutionMeta] = useState<{
    createdAt: string;
    memory: number;
    runtime: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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
        const submission = await fetchSubmissionById(submissionId);

        if (!mounted) return;

        if (!submission) {
          setError("제출 정보를 찾을 수 없습니다.");
          return;
        }

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

        const reviewsRes = await fetchReviewsBySolution(submissionId);

        let reviewsWithComments: Review[] = [];

        if (reviewsRes && reviewsRes.reviews.length > 0) {
          reviewsWithComments = await Promise.all(
            reviewsRes.reviews.map(async (r) => {
              const commentsRes = await fetchCommentsByReview(r.reviewId);

              const comments =
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

  const handleToggleShare = () => {
    const ok = window.confirm(
      isShared
        ? "코드 공유를 해제하시겠습니까?"
        : "코드를 다른 사람과 공유하시겠습니까?"
    );

    if (!ok) return;

    setIsShared((prev) => !prev);
  };

  return (
    <Page>
      <Inner>
        <HeadingRow>
          <Heading>내 코드 보기</Heading>
        </HeadingRow>

        <MetaRow>
          언어: {rawLang}
          {solutionMeta && (
            <>
              {" · 제출 시각: "}
              {timeConverter(solutionMeta.createdAt)}
              {" · 메모리: "}
              {solutionMeta.memory}MB
              {" · 실행시간: "}
              {solutionMeta.runtime}ms
            </>
          )}
        </MetaRow>

        <ButtonContainer>
          <ShareButton $active={isShared} onClick={handleToggleShare}>
            {isShared ? "공유중" : "코드 공유"}
          </ShareButton>

          <RetryButton
            onClick={() =>
              problemId && navigate(`/problems/${problemId}/solve`)
            }
          >
            다시 풀기
          </RetryButton>
        </ButtonContainer>

        <ReviewSection
          code={code}
          language={hlLang}
          reviews={reviews}
          onChangeReviews={setReviews}
        />
      </Inner>
    </Page>
  );
}
