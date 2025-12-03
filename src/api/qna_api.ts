import type {
  BoardComment,
  BoardContent,
} from "../screens/board/BoardList.tsx";
import { api } from "./axios.ts";

/* ========================== 게시글 DTO & 매핑 ========================== */

export interface qnaPostDto {
  authorId: number;
  authorName: string;
  postId: number;
  anonymous: boolean;
  title: string;
  contents: string;
  privatePost: boolean;
  message: string | null; // null까지 받아서 이렇게
  likeCount: number;
  commentCount: number;
  attachmentUrl: string | null; // null까지
  createdAt: string; // "2025-12-01T16:40:04.527742"
  updatedAt: string;
  viewerLiked: boolean;
}
export interface qnaPostPage {
  content: qnaPostDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
/* 게시글 DTO → BoardContent 매핑 */
export function mapqnaPost(dto: qnaPostDto): BoardContent {
  return {
    post_id: dto.postId,
    post_title: dto.title,

    author: dto.authorName,
    author_id: dto.authorId,

    tag: { id: 0, name: "" },
    anonymity: dto.anonymous,

    like_count: dto.likeCount,
    comment_count: dto.commentCount,

    create_time: dto.createdAt,
    updated_time: dto.updatedAt,

    is_private: dto.privatePost,
    contents: dto.contents,

    viewer_liked: dto.viewerLiked,
    attachment_url: dto.attachmentUrl,
    message: dto.message,

    comments: [], // 댓글은 별도 API로 가져올 예정
  };
}

export function mapqnaPostPage(pageDto: qnaPostPage) {
  return {
    content: pageDto.content.map(mapqnaPost),
    page: pageDto.page,
    size: pageDto.size,
    totalElements: pageDto.totalElements,
    totalPages: pageDto.totalPages,
    last: pageDto.last,
  };
}

export function mapCommentDto(dto: any): BoardComment {
  return {
    comment_id: dto.comment_id,
    post_id: dto.post_id,
    parent_id: dto.parent_id,

    author_id: dto.author_id,
    author_name: dto.author_name,

    anonymity: dto.anonymity,
    content: dto.content,
    is_private: dto.is_private,

    like_count: dto.like_count,
    viewer_liked: dto.viewerLiked,

    created_at: dto.created_at,
    updated_at: dto.updated_at,

    message: dto.message,
  };
}

/* ========================== 게시글 API ========================== */

/* 게시글 단건 조회: GET /api/qna_board/{postId} */
export async function fetchqnaPost(postId: number): Promise<BoardContent> {
  const res = await api.get(`/qna_board/${postId}`);
  return mapqnaPost(res.data);
}

/* 게시글 수정: PUT /api/qna_board/{postId} */
export async function updateqnaPost(postId: number, payload: any) {
  const res = await api.put(`/qna_board/${postId}`, payload);
  return res.data;
}

/* 게시글 삭제: DELETE /api/qna_board/{postId} */
export async function deleteqnaPost(postId: number) {
  const res = await api.delete(`/qna_board/${postId}`);
  return res.data;
}

/* 게시글 목록(페이지 기반): GET /api/qna_board?page= */
export async function fetchqnaList(page = 1) {
  const res = await api.get<qnaPostPage>("/qna_board", {
    params: { page },
  });
  return mapqnaPostPage(res.data);
}
/* 게시글 생성: POST /api/qna_board */
export async function createqnaPost(payload: any) {
  const res = await api.post("/qna_board", payload);
  return res.data;
}

/* 게시글 신고: POST /api/qna_board/{postId}/reports */
export async function reportqnaPost(postId: number, payload: any) {
  const res = await api.post(`/qna_board/${postId}/reports`, payload);
  return res.data;
}

/* ========================== 투표 API ========================== */

/* 투표 정보 조회: GET /api/qna_board/{postId}/poll */
export async function fetchqnaPoll(postId: number) {
  const res = await api.get(`/qna_board/${postId}/poll`);
  return res.data;
}

/* 투표 생성/수정: POST /api/qna_board/{postId}/poll */
export async function createOrUpdateqnaPoll(postId: number, payload: any) {
  const res = await api.post(`/qna_board/${postId}/poll`, payload);
  return res.data;
}

/* 투표하기: POST /api/qna_board/{postId}/poll/{pollId}/vote */
export async function voteqnaPoll(
  postId: number,
  pollId: number,
  payload?: any
) {
  const res = await api.post(
    `/qna_board/${postId}/poll/${pollId}/vote`,
    payload
  );
  return res.data;
}

/* ========================== 좋아요 & 첨부파일 ========================== */

/* 게시글 좋아요: POST /api/qna_board/{postId}/like */
export async function likeqnaPost(postId: number) {
  const res = await api.post(`/qna_board/${postId}/like`);
  return res.data;
}

/* 첨부파일 업로드: POST /api/qna_board/{postId}/attach */
export async function attachqnaFile(postId: number, formData: FormData) {
  const res = await api.post(`/qna_board/${postId}/attach`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/* ========================== 게시글 검색 ========================== */

/* 게시글 검색: GET /api/qna_board/search */
export interface qnaSearchParams {
  keyword: string;
  page?: number;
  size?: number;
}

export async function searchqnaPosts(params: qnaSearchParams) {
  const res = await api.get<qnaPostPage>("/qna_board/search", { params });
  return mapqnaPostPage(res.data);
}

/* ========================== 댓글 API ========================== */

/* 단일 댓글 조회: GET /api/qna_board/comment/{commentId} */
export async function fetchCommentsById(postId: number) {
  const res = await api.get(`/qna_board/comment/${postId}`);
  return res.data.map(mapCommentDto);
}

/* 댓글 수정: PUT /api/qna_board/comment/{commentId} */
export async function updateComment(commentId: number, payload: any) {
  const res = await api.put(`/qna_board/comment/${commentId}`, payload);
  return res.data;
}

/* 댓글 삭제: DELETE /api/qna_board/comment/{commentId} */
export async function deleteComment(commentId: number) {
  await api.delete(`/qna_board/comment/${commentId}`);
}

/* 특정 게시글의 댓글 목록 조회: GET /api/qna_board/{postId}/comments */
export async function fetchCommentsByPostId(
  postId: number
): Promise<BoardComment[]> {
  const res = await api.get(`/qna_board/${postId}/comments`);
  return res.data.map(mapCommentDto);
}

/* 특정 게시글에 댓글 작성: POST /api/qna_board/{postId}/comments */
export async function createComment(
  postId: number,
  payload: {
    contents: string;
    anonymity: boolean;
    is_private: boolean;
    parent_id: number | null;
  }
) {
  const res = await api.post(`/qna_board/${postId}/comments`, payload);
  return res.data;
}

/* 댓글 신고: POST /api/qna_board/comment/{commentId}/reports */
export async function reportComment(commentId: number, payload: any) {
  await api.post(`/qna_board/comment/${commentId}/reports`, payload);
}

/* 댓글 좋아요: POST /api/qna_board/comment/{commentId}/like */
export async function likeComment(
  commentId: number
): Promise<{ likeCount: number; liked: boolean }> {
  const res = await api.post(`/qna_board/comment/${commentId}/like`);
  return res.data;
}
