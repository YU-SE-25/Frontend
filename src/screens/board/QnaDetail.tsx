// src/screens/board/BoardDetail.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReportButton from "../../components/ReportButton";
import { useNavigate } from "react-router-dom";
import type { QnaComment, QnaContent } from "./QnaList";
import EditButton from "../../components/EditButton";
import { isOwner } from "../../utils/isOwner";

interface QnaDetailProps {
  post: QnaContent;
  onClose?: () => void;
}

const DetailCard = styled.section`
  width: 100%;
  max-width: 960px;
  margin: 20px auto 24px;
  padding: 20px 24px;
  border-radius: 12px;

  background: ${({ theme }) => theme.bgColor};
  border: 1px solid rgba(0, 0, 0, 0.16);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const DetailHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DetailTitle = styled.span`
  margin: 0;
  font-size: 20px;
  color: ${({ theme }) => theme.textColor};
`;
const ProblemTitle = styled.span`
  margin-right: 8px;
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.textColor};
  display: inline;

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.focusColor};
    cursor: pointer;
  }
`;

const MetaRow = styled.div<{
  isDisabled?: boolean;
}>`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}60;

  span + span::before {
    content: " | ";
    margin: 0 4px;
  }
  p,
  span,
  strong {
    transition: none;

    color: inherit;
  }
  //Metarow의 첫번째 자식
  & > span:first-child {
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;

    ${(props) =>
      props.isDisabled &&
      `
    color: ${props.theme.textColor}60; 
    cursor: not-allowed;
    pointer-events: none; /* 클릭 이벤트 자체를 막음 */
  `}

    /* 호버 효과 (비활성화 아닐 때만) */
  &:not([aria-disabled="true"]):hover {
      text-decoration: underline;
    }
  }
`;

const VotePanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 999px; /* 둥근 직사각형 */
  border: 1px solid ${({ theme }) => theme.textColor}20;
  background: ${({ theme }) => theme.bgCardColor};
`;

const VoteButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid
    ${({ theme }) => theme.textColor ?? "rgba(255,255,255,0.15)"};
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};

  &:hover {
    background: ${({ theme }) => theme.bgColor}60;
  }
`;

const VoteCount = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textColor};
`;
const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  padding: 4px 10px;
  font-size: 13px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: transparent;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: rgba(148, 163, 184, 0.18);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusColor};
    outline-offset: 2px;
  }
`;

const ContentArea = styled.div`
  font-size: 15px;
  line-height: 1.7;
  color: ${({ theme }) => theme.textColor};
  text-align: left;
  white-space: pre-wrap;

  img {
    max-width: 100%;
    display: block;
    margin: 16px auto;
    border-radius: 8px;
  }
`;
const DetailBody = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-top: 16px;
`;

const DetailMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const StatsRow = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}70;
  display: flex;
  gap: 12px;

  span {
    color: ${({ theme }) => theme.textColor};
  }
`;

const CommentsSection = styled.section`
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.35);
`;

const CommentsHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
`;

const CommentCount = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const CommentList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const CommentItem = styled.li`
  padding: 8px 0;
  border-top: 1px solid rgba(148, 163, 184, 0.25);
  color: ${({ theme }) => theme.textColor};

  &:first-child {
    border-top: none;
  }
`;

const CommentMeta = styled.div<{
  isDisabled?: boolean;
}>`
  font-size: 12px;
  color: ${({ theme }) => theme.textColor}70;
  margin-bottom: 2px;

  strong {
    color: ${({ theme }) => theme.textColor};
    font-weight: 600;
    cursor: pointer;
    ${(props) =>
      props.isDisabled &&
      `
    color: ${props.theme.textColor}60; 
    cursor: not-allowed;
    pointer-events: none; /* 클릭 이벤트 자체를 막음 */
  `}

    /* 호버 효과 (비활성화 아닐 때만) */
  &:not([aria-disabled="true"]):hover {
      text-decoration: underline;
    }
  }
`;

const CommentContent = styled.div`
  font-size: 14px;
  white-space: pre-wrap;
  color: ${({ theme }) => theme.textColor};
`;

const CommentForm = styled.form`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  resize: vertical;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.6);

  font-size: 14px;
  font-family: inherit;
  background-color: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusColor};
    outline-offset: 2px;
  }
`;

const CommentSubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
  & > label > span {
    font-size: 13px;
    color: ${({ theme }) => theme.textColor};
  }
`;

const CommentButton = styled.button`
  font-size: 14px;
  padding: 6px 16px;
  border-radius: 999px;
  border: none;
  cursor: pointer;

  background: ${({ theme }) => theme.focusColor};
  color: ${({ theme }) => theme.bgColor};

  &:hover {
    filter: brightness(0.95);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusColor};
    outline-offset: 2px;
  }
`;

const EmptyText = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}70;
  text-align: left;
`;

export default function QnaDetail({ post, onClose }: QnaDetailProps) {
  const nav = useNavigate();
  const [anonymity, setAnonimity] = useState(false);
  const [localComments, setLocalComments] = useState<QnaComment[]>(
    post.comments ?? []
  );
  const [vote, setVote] = useState(post.like_count); // 투표
  const [voteState, setVoteState] = useState<"up" | "down" | null>(null);
  const [draft, setDraft] = useState("");
  useEffect(() => {
    setLocalComments(post.comments ?? []);
    window.scrollTo(0, 0);
  }, [post.post_id]);
  useEffect(() => {
    setVote(post.like_count);
  }, [post.like_count]);

  const displayAuthor = post.anonymity ? "익명" : post.author;

  //투표
  const handleUpvote = () => {
    setVoteState("up");
    setVote((v) => (voteState === "down" ? v + 2 : v + 1));
  };

  const handleDownvote = () => {
    setVoteState("down");
    setVote((v) => (voteState === "up" ? v - 2 : v - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const next: QnaComment = {
      id: Date.now(),
      author: "Guest", // TODO: 나중에 실제 로그인 유저 닉네임으로 교체
      contents: text,
      anonymity: anonymity,
      create_time: new Date().toISOString(),
    };

    setLocalComments((prev) => [...prev, next]);
    setDraft("");
  };
  const handleNavigateMypage = (username: string) => () => {
    nav(`/mypage/${username}`);
  };
  const handleNavigateProblem = (problemId: number) => () => {
    nav(`/problem-detail/${problemId}`);
  };

  return (
    <DetailCard>
      <DetailHeader>
        <TitleBlock>
          <DetailTitle>
            <ProblemTitle onClick={handleNavigateProblem(post.problem_id)}>
              #{post.problem_id}번 문제
            </ProblemTitle>
            | {post.post_title}
          </DetailTitle>

          <MetaRow isDisabled={post.anonymity}>
            <span onClick={handleNavigateMypage(displayAuthor)}>
              <strong>작성자:</strong> {displayAuthor}
            </span>
            <span>
              <strong>작성일:</strong> {post.create_time.slice(0, 10)}
            </span>
            <span>
              <strong>조회수:</strong> {vote}
            </span>
          </MetaRow>
        </TitleBlock>

        <HeaderActions>
          {isOwner({ author: post.author, anonymity: post.anonymity }) && (
            <EditButton
              to={`/qna/write`}
              state={{
                post: {
                  state: "edit",
                  id: post.post_id,
                  title: post.post_title,
                  content: post.contents,
                  isAnonymous: post.anonymity,
                  isPrivate: post.is_private,
                  problemId: post.problem_id,
                },
              }}
            />
          )}
          <ReportButton
            targetContentId={post.post_id}
            targetContentType="post"
          />
          {onClose && <CloseButton onClick={onClose}>닫기</CloseButton>}
        </HeaderActions>
      </DetailHeader>

      {/* 👇 여기부터 새로 감싼 부분 */}
      <DetailBody>
        <DetailMain>
          <ContentArea>{post.contents}</ContentArea>

          <StatsRow>
            <span>👍 {post.like_count}</span>
            <span>💬 {localComments.length}</span>
          </StatsRow>

          <CommentsSection>
            <CommentsHeader>
              <CommentCount>댓글 {localComments.length}</CommentCount>
            </CommentsHeader>

            {localComments.length === 0 ? (
              <EmptyText>첫 번째 댓글을 남겨보세요.</EmptyText>
            ) : (
              <CommentList>
                {localComments.map((c) => {
                  const commentAuthor = c.anonymity ? "익명" : c.author;
                  const date = c.create_time.slice(0, 10);
                  return (
                    <CommentItem key={c.id}>
                      <CommentMeta isDisabled={c.anonymity}>
                        <strong onClick={handleNavigateMypage(commentAuthor)}>
                          {commentAuthor}
                        </strong>{" "}
                        · {date}
                        <ReportButton
                          targetContentId={c.id}
                          targetContentType="comment"
                        />
                      </CommentMeta>
                      <CommentContent>{c.contents}</CommentContent>
                    </CommentItem>
                  );
                })}
              </CommentList>
            )}

            <CommentForm onSubmit={handleSubmit}>
              <CommentTextarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="댓글을 입력하세요."
              />

              <CommentSubmitRow>
                <label
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span>익명</span>
                  <input
                    type="checkbox"
                    checked={anonymity}
                    onChange={(e) => setAnonimity(e.target.checked)}
                  />
                </label>

                <CommentButton type="submit">댓글 작성</CommentButton>
              </CommentSubmitRow>
            </CommentForm>
          </CommentsSection>
        </DetailMain>

        {/* 👉 오른쪽 투표 패널 */}
        <VotePanel>
          <VoteButton onClick={handleUpvote}>▲</VoteButton>
          <VoteCount>{vote}</VoteCount>
          <VoteButton onClick={handleDownvote}>▼</VoteButton>
        </VotePanel>
      </DetailBody>
    </DetailCard>
  );
}
