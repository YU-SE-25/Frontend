// src/screens/board/BoardDetail.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReportButton from "../../components/ReportButton";
import { useNavigate } from "react-router-dom";
import type { BoardCategory, BoardComment, BoardContent } from "./BoardList";
import EditButton from "../../components/EditButton";
import { isOwner } from "../../utils/isOwner";
import {
  fetchDiscussPost,
  fetchCommentsByPostId,
  createComment as apiCreateComment,
  updateComment as apiUpdateComment,
  deleteComment as apiDeleteComment,
  likeDiscussPost,
  deleteDiscussPost,
} from "../../api/board_api";
import { useQuery } from "@tanstack/react-query";

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

const MetaRow = styled.div<{ isDisabled?: boolean }>`
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

  & > span:first-child {
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;

    ${({ isDisabled, theme }) =>
      isDisabled &&
      `
        color: ${theme.textColor}60;
        cursor: not-allowed;
        pointer-events: none;
      `}

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
  border-radius: 999px;
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

const CommentActionButton = styled.button<{ $danger?: boolean }>`
  margin-left: 8px;
  font-size: 12px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme, $danger }) => ($danger ? "#ff4d4f" : theme.muteColor)};

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusColor};
    outline-offset: 2px;
  }
`;

const CommentItem = styled.li`
  padding: 8px 0;
  border-top: 1px solid rgba(148, 163, 184, 0.25);
  color: ${({ theme }) => theme.textColor};

  &:first-child {
    border-top: none;
  }
`;

const CommentMeta = styled.div<{ isDisabled?: boolean }>`
  font-size: 12px;
  color: ${({ theme }) => theme.textColor}70;
  margin-bottom: 2px;

  strong {
    color: ${({ theme }) => theme.textColor};
    font-weight: 600;
    cursor: pointer;

    ${({ isDisabled, theme }) =>
      isDisabled &&
      `
        color: ${theme.textColor}60;
        cursor: not-allowed;
        pointer-events: none;
      `}

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

// 댓글 DTO → BoardComment 매핑
function mapComment(dto: any): BoardComment {
  return {
    id: dto.comment_id ?? dto.id ?? dto.commentId,
    author: dto.authorNickname ?? dto.author ?? dto.username ?? "익명",
    contents: dto.content ?? dto.contents ?? dto.text ?? "",
    anonymity: dto.anonymity ?? dto.anonymous ?? false,
    create_time:
      dto.created_at ??
      dto.createdAt ??
      dto.create_time ??
      new Date().toISOString(),
  };
}

export default function BoardDetail({ post, onClose }: BoardDetailProps) {
  const nav = useNavigate();
  const postId = post.post_id;
  const currentCategory =
    (window.location.pathname.split("/")[2] as BoardCategory) ?? "daily";
  // 1) 서버에서 최신 글 정보 & 댓글 가져오기 (화면에는 바로 안 쓰고, 내부 state로 흘려보냄)
  const { data: postData, isFetching: isPostFetching } = useQuery<BoardContent>(
    {
      queryKey: ["postDetail", postId],
      queryFn: () => fetchDiscussPost(postId),
      staleTime: 0,
      refetchOnMount: "always",
    }
  );
  const { data: commentsData, isFetching: isCommentsFetching } = useQuery<
    BoardComment[]
  >({
    queryKey: ["postComments", postId],
    queryFn: async () => {
      const res = await fetchCommentsByPostId(postId);
      const raw = Array.isArray(res) ? res : res.comments ?? res.content ?? [];
      return raw.map(mapComment);
    },
    staleTime: 0,
    refetchOnMount: "always",
  });
  // 2) 화면에 실제로 보여줄 "안정된" 상태
  const [stablePost, setStablePost] = useState<BoardContent>(post);
  const [localComments, setLocalComments] = useState<BoardComment[]>(
    post.comments ?? []
  );
  const [vote, setLike] = useState(post.like_count);
  const [voteState, setLikeState] = useState<"up" | "down" | null>(null);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [anonymity, setAnonymity] = useState(false);

  // 이 글(postId)에 대해 "스크롤을 이미 위로 올렸는지" 여부
  const [hasScrolledForPost, setHasScrolledForPost] = useState(false);

  const isLoadingAll = isPostFetching || isCommentsFetching;

  // 🔁 서버에서 새 글 데이터를 다 가져왔을 때만 화면 상태 교체
  useEffect(() => {
    if (postData) {
      setStablePost(postData);
      setLike(postData.like_count);
    }
  }, [postData]);

  // 🔁 서버에서 새 댓글 데이터를 다 가져왔을 때만 화면 댓글 교체
  useEffect(() => {
    if (commentsData) {
      setLocalComments(commentsData);
    }
  }, [commentsData]);

  // 🔁 postId가 바뀌면 “이번 글에 대해서는 아직 스크롤 안 했다”로 초기화
  useEffect(() => {
    setHasScrolledForPost(false);
  }, [postId]);

  // 🔁 로딩이 모두 끝난 순간에만, 그리고 딱 한 번만 스크롤 위로 고정
  useEffect(() => {
    if (!hasScrolledForPost && !isPostFetching && !isCommentsFetching) {
      window.scrollTo(0, 0);
      setHasScrolledForPost(true);
    }
  }, [hasScrolledForPost, isPostFetching, isCommentsFetching, postId]);

  const displayAuthor = stablePost.anonymity ? "익명" : stablePost.author;

  // ✅ 게시글 수정 버튼 클릭 시
  const handleEditPost = () => {
    nav(`/board/${currentCategory}/write`, {
      state: {
        post: {
          id: stablePost.post_id,
          category: currentCategory,
          title: stablePost.post_title,
          content: stablePost.contents,
          isAnonymous: stablePost.anonymity,
          isPrivate: stablePost.is_private,
          groupId: null,
        },
      },
    });
  };

  // 게시글 삭제 버튼 클릭 시
  const handleDeletePost = async () => {
    const ok = window.confirm("정말로 게시글을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteDiscussPost(stablePost.post_id);
      alert("삭제되었습니다.");
      window.location.reload(); // or nav(0);
    } catch (e) {
      console.error("게시글 삭제 실패:", e);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 투표
  const handleUpvote = async () => {
    setLikeState("up");
    setLike((v) => (voteState === "down" ? v + 2 : v + 1));
    try {
      await likeDiscussPost(stablePost.post_id);
    } catch (e) {
      console.error("좋아요 요청 실패:", e);
    }
  };

  const handleDownvote = () => {
    setLikeState("down");
    setLike((v) => (voteState === "up" ? v - 2 : v - 1));
  };

  // 댓글 수정/삭제
  const handleEditComment = (comment: BoardComment) => {
    setDraft(comment.contents);
    setAnonymity(comment.anonymity);
    setEditingCommentId(comment.id);
  };

  const handleDeleteComment = async (commentId: number) => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (!ok) return;

    try {
      await apiDeleteComment(commentId);
      setLocalComments((prev) => prev.filter((c) => c.id !== commentId));

      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setDraft("");
      }
    } catch (e) {
      console.error("댓글 삭제 실패:", e);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    try {
      // 수정 모드
      if (editingCommentId !== null) {
        const payload = {
          contents: text,
          anonymity,
          is_private: stablePost.is_private ?? false,
        };

        await apiUpdateComment(editingCommentId, payload);

        setLocalComments((prev) =>
          prev.map((c) =>
            c.id === editingCommentId
              ? {
                  ...c,
                  contents: text,
                  anonymity,
                }
              : c
          )
        );
        setEditingCommentId(null);
        setDraft("");
        return;
      }

      // 새 댓글 작성
      const payload = {
        contents: text,
        anonymity,
        is_private: stablePost.is_private ?? false,
        parent_id: 0,
      };

      const created = await apiCreateComment(stablePost.post_id, payload);
      const newComment = mapComment(created);

      setLocalComments((prev) => [...prev, newComment]);
      setDraft("");
    } catch (e) {
      console.error("댓글 저장 실패:", e);
      alert("댓글 저장 중 오류가 발생했습니다.");
    }
  };

  const handleNavigateMypage = (username: string) => () => {
    if (!username || username === "익명") return;
    nav(`/mypage/${username}`);
  };

  return (
    <DetailCard>
      <DetailHeader>
        <TitleBlock>
          <DetailTitle>{stablePost.post_title}</DetailTitle>

          <MetaRow isDisabled={stablePost.anonymity}>
            <span onClick={handleNavigateMypage(displayAuthor)}>
              <strong>작성자:</strong> {displayAuthor}
            </span>
            <span>
              <strong>작성일:</strong> {stablePost.create_time.slice(0, 10)}
            </span>
            <span>
              <strong>조회수:</strong> {vote}
            </span>
            {isLoadingAll && (
              <span style={{ fontSize: 12, opacity: 0.6 }}>업데이트 중…</span>
            )}
          </MetaRow>
        </TitleBlock>

        <HeaderActions>
          {isOwner({
            author: stablePost.author,
            anonymity: stablePost.anonymity,
          }) && (
            <EditButton
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              // confirmMessage="정말로 이 게시글을 삭제하시겠습니까?"  // 필요하면 커스텀
            />
          )}
          <ReportButton
            targetContentId={stablePost.post_id}
            targetContentType="post"
          />
          {onClose && <CloseButton onClick={onClose}>닫기</CloseButton>}
        </HeaderActions>
      </DetailHeader>

      <DetailBody>
        <DetailMain>
          <ContentArea>{stablePost.contents}</ContentArea>

          <StatsRow>
            <span>👍 {vote}</span>
            <span>💬 {localComments.length}</span>
          </StatsRow>

          <CommentsSection>
            <CommentsHeader>
              <CommentCount>댓글 {localComments.length}</CommentCount>
            </CommentsHeader>

            {localComments.length === 0 ? (
              <EmptyText>
                {isLoadingAll
                  ? "댓글을 불러오는 중입니다…"
                  : "첫 번째 댓글을 남겨보세요."}
              </EmptyText>
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
                        {isOwner(c) && (
                          <>
                            <CommentActionButton
                              type="button"
                              onClick={() => handleEditComment(c)}
                            >
                              수정
                            </CommentActionButton>

                            <CommentActionButton
                              type="button"
                              $danger
                              onClick={() => handleDeleteComment(c.id)}
                            >
                              삭제
                            </CommentActionButton>
                          </>
                        )}
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
                    onChange={(e) => setAnonymity(e.target.checked)}
                  />
                </label>

                <CommentButton type="submit">
                  {editingCommentId !== null ? "댓글 수정" : "댓글 작성"}
                </CommentButton>
              </CommentSubmitRow>
            </CommentForm>
          </CommentsSection>
        </DetailMain>

        <VotePanel>
          <VoteButton onClick={handleUpvote}>▲</VoteButton>
          <VoteCount>{vote}</VoteCount>
          <VoteButton onClick={handleDownvote}>▼</VoteButton>
        </VotePanel>
      </DetailBody>
    </DetailCard>
  );
}
