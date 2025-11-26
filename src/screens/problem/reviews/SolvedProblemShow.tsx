import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import CodePreview from "./CodePreview";

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

const Heading = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.textColor};
`;

const MetaRow = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textColor}99;
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

type LocationState = {
  code?: string;
  language?: string;
  problemTitle?: string;
};

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

const initialReviews: Review[] = [
  {
    id: 1,
    lineNumber: 5,
    content:
      "sum 변수를 for문 밖에서 선언한 건 좋은데, const로 못 바꾸는지 한 번만 체크해보면 좋을 것 같아요.",
    author: "gamppe",
    createdAt: "2025-11-26",
    comments: [
      {
        id: 1,
        author: "helper01",
        content: "동의합니다. 특히 값이 바뀌지 않는다면 const가 더 안전하죠.",
        createdAt: "2025-11-26 13:42",
      },
    ],
  },
  {
    id: 2,
    lineNumber: 12,
    content:
      "반복문의 종료 조건을 n이 아니라 vec.size()로 두면 더 안전할 것 같습니다.",
    author: "helper02",
    createdAt: "2025-11-25",
    comments: [],
  },
];

export default function SolvedProblemShow() {
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const code = state.code || "";
  const problemTitle = state.problemTitle || "내 제출 코드";
  const rawLang = state.language || "C";
  const hlLang = langMap[rawLang] || "text";

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>(
    {}
  );

  if (!code) {
    return (
      <Page>
        <Inner>
          <Heading>내 코드 미리보기</Heading>
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

  return (
    <Page>
      <Inner>
        <Heading>내 코드 미리보기</Heading>
        <MetaRow>
          문제: {problemTitle} · 언어: {rawLang}
        </MetaRow>

        <CodePreview code={code} language={hlLang} />

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

                      <CommentSection
                        onClick={(e) => e.stopPropagation()} // 카드 토글 방지
                      >
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
