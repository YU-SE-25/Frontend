import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  fetchProblemDetail,
  mapDetailDtoToProblem,
} from "../../../api/problem_api";
import type { IProblem } from "../../../api/problem_api";
import {
  fetchSolvedCode,
  fetchReviewsBySolution,
  fetchCommentsByReview,
} from "../../../api/solution_api";
import {
  fetchDummyProblemDetail,
  increaseDummyView,
} from "../../../api/dummy/problem_dummy_new";
import ProblemMeta from "../../../components/ProblemMeta";
import { timeConverter } from "../../../utils/timeConverter";
import { isOwner } from "../../../utils/isOwner";
import { ButtonContainer } from "../../../theme/ProblemList.Style";
import ReviewSection from "./Review";
import type { Review } from "./Review";
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

const OtherCodeButton = styled.button`
  padding: 10px 12px;
  font-size: 13px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.logoColor};
  color: white;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
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

export default function SolvedProblemShow() {
  const { problemId, solutionId } = useParams<{
    problemId: string;
    solutionId: string;
  }>();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [rawLang, setRawLang] = useState("C");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isMine, setIsMine] = useState(false);
  const [ownerName, setOwnerName] = useState<string | null>(null);

  const [problem, setProblem] = useState<IProblem | null>(null);

  const [solutionMeta, setSolutionMeta] = useState<{
    createdAt: string;
    memory: number;
    runtime: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!problemId) return;

    let mounted = true;

    const loadProblem = async () => {
      try {
        const real = await fetchProblemDetail(Number(problemId));
        if (mounted) setProblem(real);
        increaseDummyView(Number(problemId));
      } catch {
        try {
          const dummy = await fetchDummyProblemDetail(Number(problemId));
          if (mounted) setProblem(mapDetailDtoToProblem(dummy));
        } catch {
          if (mounted) setProblem(null);
        }
      }
    };

    loadProblem();

    return () => {
      mounted = false;
    };
  }, [problemId]);

  useEffect(() => {
    if (!problemId) return;

    let mounted = true;

    const loadSolvedAndReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const solved = await fetchSolvedCode(Number(problemId));

        if (!solved || solved.solutions.length === 0) {
          if (mounted) setError("아직 제출된 풀이가 없습니다.");
          return;
        }

        let targetSolution = solved.solutions[0];

        if (solutionId) {
          const found = solved.solutions.find(
            (s) => s.submissionId === Number(solutionId)
          );
          if (found) targetSolution = found;
        }
        setIsMine(isOwner(targetSolution));
        setOwnerName(targetSolution.username);

        const reviewsRes = await fetchReviewsBySolution(
          targetSolution.submissionId
        );

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

        setCode(targetSolution.code);
        setRawLang(targetSolution.language);
        setSolutionMeta({
          createdAt: targetSolution.submittedAt,
          memory: targetSolution.memory,
          runtime: targetSolution.runtime,
        });
        setReviews(reviewsWithComments);
      } catch (e) {
        if (mounted) {
          console.error("SolvedProblemShow load error:", e);
          setError("제출된 코드를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSolvedAndReviews();

    return () => {
      mounted = false;
    };
  }, [problemId, solutionId]);

  const hlLang = langMap[rawLang] || "text";

  if (loading) {
    return (
      <Page>
        <Inner>
          {problem && <ProblemMeta problem={problem} />}

          <HeadingRow>
            <Heading>제출된 코드</Heading>
            <OtherCodeButton disabled>다른 사람 풀이 보기</OtherCodeButton>
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
          {problem && <ProblemMeta problem={problem} />}

          <HeadingRow>
            <Heading>제출된 코드</Heading>
            <OtherCodeButton
              onClick={() =>
                problemId && navigate(`/problem-detail/${problemId}/solved`)
              }
            >
              다른 사람 풀이 보기
            </OtherCodeButton>
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
          {problem && <ProblemMeta problem={problem} />}

          <HeadingRow>
            <Heading>제출된 코드</Heading>
            <OtherCodeButton
              onClick={() =>
                problemId && navigate(`/problem-detail/${problemId}/solved`)
              }
            >
              다른 사람 풀이 보기
            </OtherCodeButton>
          </HeadingRow>
          <ErrorText>표시할 코드가 없습니다.</ErrorText>
        </Inner>
      </Page>
    );
  }

  const handleViewOtherSolutions = () => {
    if (!problemId) return;
    navigate(`/problem-detail/${problemId}/solved`);
  };

  return (
    <Page>
      <Inner>
        {problem && <ProblemMeta problem={problem} />}

        <HeadingRow>
          <Heading>제출된 코드</Heading>
          <ButtonContainer>
            {isMine && (
              <OtherCodeButton
                onClick={() => {
                  navigate(`/users/${ownerName}/submissions/${solutionId}`);
                }}
              >
                편집...
              </OtherCodeButton>
            )}

            <OtherCodeButton onClick={handleViewOtherSolutions}>
              다른 사람 풀이 보기
            </OtherCodeButton>
          </ButtonContainer>
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
