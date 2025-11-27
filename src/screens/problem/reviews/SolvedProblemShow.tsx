import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import CodePreview from "./CodePreview";
import type { IProblem } from "../../../api/problem_api";
import {
  fetchMySolvedCode,
  fetchSolutionReviews,
  updateShareMyCode,
} from "../../../api/solution_api";

// ✅ 공통 문제 메타
import ProblemMeta from "../../../components/ProblemMeta";";

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

// 머리 부분
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

// 체크 박스
const ShareRow = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
`;

const ShareLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.textColor};
`;

const ErrorText = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
`;

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

const langMap: Record<string, string> = {
  C: "c",
  "C++": "cpp",
  Java: "java",
  Python: "python",
  Python3: "python",
  JS: "javascript",
  TS: "typescript",
};

// ===================== 컴포넌트 =====================

export default function SolvedProblemShow() {
  const { problemId, solutionId } = useParams<{
    problemId: string;
    solutionId: string;
  }>();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [rawLang, setRawLang] = useState("C");
  const [problemTitle, setProblemTitle] = useState("내 제출 코드");
  const [shareCode, setShareCode] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>(
    {}
  );

  // ✅ 문제 전체 정보 (ProblemMeta용)
  const [problem, setProblem] = useState<IProblem | null>(null);

  // ✅ 풀이 메타 (제출 시각 / 메모리 / 실행시간)
  const [solutionMeta, setSolutionMeta] = useState<{
    createdAt: string;
    memoryUsage: number;
    executionTime: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 코드 + 문제 정보 + 공유 여부 + 리뷰 로딩
  useEffect(() => {
    if (!problemId) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const solved = await fetchMySolvedCode(Number(problemId));

        if (!solved) {
          if (mounted) setError("아직 제출한 풀이가 없습니다.");
          return;
        }
        const revs: Review[] = await fetchSolutionReviews(solved.solutionId);

        if (!mounted) return;

        setCode(solved.code);
        setRawLang(solved.language);
        setProblemTitle(solved.problem?.title || "내 제출 코드");
        setShareCode(solved.isShared);
        setReviews(revs);
        setProblem(solved.problem ?? null);
        setSolutionMeta({
          createdAt: solved.createdAt,
          memoryUsage: solved.memoryUsage,
          executionTime: solved.executionTime,
        });
      } catch (e) {
        if (mounted) {
          setError("내 제출 코드를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [problemId]);

  const hlLang = langMap[rawLang] || "text";

  if (loading) {
    return (
      <Page>
        <Inner>
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

  // 다른 사람 풀이 보기
  const handleViewOtherSolutions = () => {
    if (!problemId) return;
    navigate(`/problem-detail/${problemId}/solved`);
  };

  const handleCommentSubmit = (e: React.FormEvent, reviewId: number) => {
    e.preventDefault();
    const text = commentDrafts[reviewId]?.trim();
    if (!text) return;

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              comments: [
                ...r.comments,
                {
                  id: Date.now(),
                  author: "현재유저", // TODO: 실제 로그인 유저로 교체
                  content: text,
                  createdAt: "방금 전",
                },
              ],
            }
          : r
      )
    );

    setCommentDrafts((prev) => ({
      ...prev,
      [reviewId]: "",
    }));
  };

  const handleShareChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!solutionId) return;

    const next = e.target.checked;

    if (next) {
      const ok = window.confirm("다른 사람들에게 내 풀이를 공유하시겠습니까?");
      if (!ok) {
        e.target.checked = false;
        return;
      }
    } else {
      const ok = window.confirm("내 풀이를 비공개하시겠습니까?");
      if (!ok) {
        e.target.checked = true;
        return;
      }
    }

    setShareCode(next);
    try {
      await updateShareMyCode(Number(solutionId), next);
    } catch {
      setShareCode(!next);
      e.target.checked = !next;
      alert("공유 설정 변경에 실패했습니다.");
    }
  };

  return (
    <Page>
      <Inner>
        <HeadingRow>
          <Heading>제출된 코드</Heading>
          <OtherCodeButton onClick={handleViewOtherSolutions}>
            다른 사람 풀이 보기
          </OtherCodeButton>
        </HeadingRow>

        {/* ✅ 공통 문제 메타 */}
        {problem && <ProblemMeta problem={problem} />}

        {/* ✅ 풀이 전용 메타 (언어 / 제출 시각 / 메모리 / 실행시간) */}
        <MetaRow>
          언어: {rawLang}
          {solutionMeta && (
            <>
              {" · 제출 시각: "}
              {solutionMeta.createdAt}
              {" · 메모리: "}
              {solutionMeta.memoryUsage}MB
              {" · 실행시간: "}
              {solutionMeta.executionTime}ms
            </>
          )}
        </MetaRow>

        <CodePreview code={code} language={hlLang} />

        <ShareRow>
          <ShareLabel>
            <input
              type="checkbox"
              checked={shareCode}
              onChange={handleShareChange}
            />
            <span>내 코드 공유하기</span>
          </ShareLabel>
        </ShareRow>

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
                      {review.author} · {review.createdAt}
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
                            등록
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
      </Inner>
    </Page>
  );
}
