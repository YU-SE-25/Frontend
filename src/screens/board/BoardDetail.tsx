// src/screens/board/BoardDetail.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReportButton from "../ReportButton";

export interface BoardComment {
  id: number;
  author: string;
  contents: string;
  anonymity: boolean;
  create_time: string; // ISO 문자열
}

export interface BoardContent {
  post_id: number;
  post_title: string;
  author: string;
  tag?: string;
  anonymity: boolean;
  like_count: number;
  comment_count: number;
  create_time: string; // ISO 문자열
  contents: string;
  comments: BoardComment[];
}

interface BoardDetailProps {
  post: BoardContent;
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

const DetailTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  color: ${({ theme }) => theme.textColor};
`;

const MetaRow = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}70;

  span + span::before {
    content: " | ";
    margin: 0 4px;
  }
  p,
  span,
  strong {
    color: inherit;
  }
`;

const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  margin-top: 4px;
  width: fit-content;

  background: rgba(148, 163, 184, 0.18);
  color: ${({ theme }) => theme.textColor}70;
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

const CommentMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textColor}70;
  margin-bottom: 2px;

  strong {
    color: ${({ theme }) => theme.textColor};
    font-weight: 600;
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

export default function BoardDetail({ post, onClose }: BoardDetailProps) {
  const [localComments, setLocalComments] = useState<BoardComment[]>(
    post.comments ?? []
  );
  const [draft, setDraft] = useState("");
  useEffect(() => {
    setLocalComments(post.comments ?? []);
    window.scrollTo(0, 0);
  }, [post.post_id]);

  const displayAuthor = post.anonymity ? "익명" : post.author;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const next: BoardComment = {
      id: Date.now(),
      author: "Guest", // TODO: 나중에 실제 로그인 유저 닉네임으로 교체
      contents: text,
      anonymity: false,
      create_time: new Date().toISOString(),
    };

    setLocalComments((prev) => [...prev, next]);
    setDraft("");
  };

  return (
    <DetailCard>
      <DetailHeader>
        <TitleBlock>
          <DetailTitle>{post.post_title}</DetailTitle>

          <MetaRow>
            <span>
              <strong>작성자:</strong> {displayAuthor}
            </span>
            <span>
              <strong>작성일:</strong> {post.create_time.slice(0, 10)}
            </span>
            <span>
              <strong>조회수:</strong> {post.like_count}
            </span>
          </MetaRow>

          {post.tag && <TagChip>#{post.tag}</TagChip>}
        </TitleBlock>

        <div style={{ display: "flex", gap: "8px" }}>
          <ReportButton
            targetContentId={post.post_id}
            targetContentType="post"
          />
          {onClose && <CloseButton onClick={onClose}>닫기</CloseButton>}
        </div>
      </DetailHeader>

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
                  <CommentMeta>
                    <strong>{commentAuthor}</strong> · {date}
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
            <CommentButton type="submit">댓글 작성</CommentButton>
          </CommentSubmitRow>
        </CommentForm>
      </CommentsSection>
    </DetailCard>
  );
}
