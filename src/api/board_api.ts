import type { BoardContent } from "../screens/board/BoardList.tsx";
import { api } from "./axios.ts";

/* ========================== 게시글 DTO & 매핑 ========================== */

export interface DiscussPostDto {
  authorId: number;
  authorName: string;
  postId: number;
  anonymous: boolean;
  title: string;
  contents: string;
  privatePost: boolean;
  message?: string;
  likeCount: number;
  commentCount: number;
  attachmentUrl?: string;
  viewerLiked?: boolean;
}
/* 게시글 DTO → BoardContent 매핑 */
export function mapDiscussPost(dto: DiscussPostDto): BoardContent {
  return {
    post_id: dto.postId,
    post_title: dto.title,
    // authorNickname이 없고 authorId만 있으니까 일단 이렇게 표시
    author: dto.authorName,
    tag: { id: 0, name: "" }, // 아직 태그 정보 없으니까 기본값
    anonymity: dto.anonymous,
    like_count: dto.likeCount,
    comment_count: dto.commentCount,
    // 지금 응답에 createdAt 같은 게 없으니 일단 빈 문자열
    create_time: "",
    is_private: dto.privatePost,
    contents: dto.contents,
    comments: [], // 댓글 목록은 별도 API로 채울 예정
  };
}

/* ========================== 게시글 API ========================== */

/* 게시글 단건 조회: GET /api/dis_board/{postId} */
export async function fetchDiscussPost(postId: number): Promise<BoardContent> {
  const res = await api.get(`/dis_board/${postId}`);
  return mapDiscussPost(res.data);
}

/* 게시글 수정: PUT /api/dis_board/{postId} */
export async function updateDiscussPost(postId: number, payload: any) {
  const res = await api.put(`/dis_board/${postId}`, payload);
  return res.data;
}

/* 게시글 삭제: DELETE /api/dis_board/{postId} */
export async function deleteDiscussPost(postId: number) {
  const res = await api.delete(`/dis_board/${postId}`);
  return res.data;
}

/* 게시글 목록(페이지 기반): GET /api/dis_board?page= */
export async function fetchDiscussList(page: number): Promise<BoardContent[]> {
  const res = await api.get<DiscussPostDto[]>("/dis_board/list", {
    params: { page },
  });
  const raw = Array.isArray(res.data) ? res.data : [];
  return raw.map(mapDiscussPost);
}
/* 게시글 생성: POST /api/dis_board */
export async function createDiscussPost(payload: any) {
  const res = await api.post("/dis_board", payload);
  return res.data;
}

/* 게시글 신고: POST /api/dis_board/{postId}/reports */
export async function reportDiscussPost(postId: number, payload: any) {
  const res = await api.post(`/dis_board/${postId}/reports`, payload);
  return res.data;
}

/* ========================== 투표 API ========================== */

/* 투표 정보 조회: GET /api/dis_board/{postId}/poll */
export async function fetchDiscussPoll(postId: number) {
  const res = await api.get(`/dis_board/${postId}/poll`);
  return res.data;
}

/* 투표 생성/수정: POST /api/dis_board/{postId}/poll */
export async function createOrUpdateDiscussPoll(postId: number, payload: any) {
  const res = await api.post(`/dis_board/${postId}/poll`, payload);
  return res.data;
}

/* 투표하기: POST /api/dis_board/{postId}/poll/{pollId}/vote */
export async function voteDiscussPoll(
  postId: number,
  pollId: number,
  payload?: any
) {
  const res = await api.post(
    `/dis_board/${postId}/poll/${pollId}/vote`,
    payload
  );
  return res.data;
}

/* ========================== 좋아요 & 첨부파일 ========================== */

/* 게시글 좋아요: POST /api/dis_board/{postId}/like */
export async function likeDiscussPost(postId: number) {
  const res = await api.post(`/dis_board/${postId}/like`);
  return res.data;
}

/* 첨부파일 업로드: POST /api/dis_board/{postId}/attach */
export async function attachDiscussFile(postId: number, formData: FormData) {
  const res = await api.post(`/dis_board/${postId}/attach`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/* ========================== 게시글 검색 ========================== */

/* 게시글 검색: GET /api/dis_board/search */
export interface DiscussSearchParams {
  keyword: string;
  page?: number;
  size?: number;
}

export async function searchDiscussPosts(params: DiscussSearchParams) {
  const res = await api.get("/dis_board/search", { params });
  return res.data;
}

/* ========================== 댓글 API ========================== */

/* 단일 댓글 조회: GET /api/dis_board/comment/{commentId} */
export async function fetchCommentById(commentId: number) {
  const res = await api.get(`/dis_board/comment/${commentId}`);
  return res.data;
}

/* 댓글 수정: PUT /api/dis_board/comment/{commentId} */
export async function updateComment(commentId: number, payload: any) {
  const res = await api.put(`/dis_board/comment/${commentId}`, payload);
  return res.data;
}

/* 댓글 삭제: DELETE /api/dis_board/comment/{commentId} */
export async function deleteComment(commentId: number) {
  await api.delete(`/dis_board/comment/${commentId}`);
}

/* 특정 게시글의 댓글 목록 조회: GET /api/dis_board/{postId}/comments */
export async function fetchCommentsByPostId(postId: number) {
  const res = await api.get(`/dis_board/${postId}/comments`);
  return res.data;
}

/* 특정 게시글에 댓글 작성: POST /api/dis_board/{postId}/comments */
export async function createComment(
  postId: number,
  payload: {
    contents: string;
    anonymity: boolean;
    is_private: boolean;
    parent_id: number | null;
  }
) {
  const res = await api.post(`/dis_board/${postId}/comments`, payload);
  return res.data;
}

/* 댓글 신고: POST /api/dis_board/comment/{commentId}/reports */
export async function reportComment(commentId: number, payload: any) {
  await api.post(`/dis_board/comment/${commentId}/reports`, payload);
}

/* 댓글 좋아요: POST /api/dis_board/comment/{commentId}/like */
export async function likeComment(
  commentId: number
): Promise<{ likeCount: number; liked: boolean }> {
  const res = await api.post(`/dis_board/comment/${commentId}/like`);
  return res.data;
}
