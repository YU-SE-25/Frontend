//import { api } from "./axios";
import {
  DUMMY_STUDY_DISCUSS_LIST,
  DUMMY_STUDY_DISCUSS_DETAIL,
  DUMMY_STUDY_DISCUSS_COMMENTS,
} from "./dummy/studygroupdiscussion_dummy";

// 타입 선언
export interface StudyGroupPostSummary {
  post_id: number;
  post_title: string;
  author: string;
  tag: string;
  anonymity: boolean;
  like_count: number;
  comment_count: number;
  create_time: string;
}

export interface StudyGroupPostDetail {
  post_id: number;
  post_title: string;
  contents: string;
  author: string;
  tag: string;
  anonymity: boolean;
  like_count: number;
  comment_count: number;
  create_time: string;
  modify_time: string;
}

export interface StudyGroupComment {
  comment_id: number;
  author: string;
  contents: string;
  anonymity: boolean;
  like_count: number;
  parent_id?: number;
  create_time: string;
}

export interface StudyGroupPostListResponse {
  page: number;
  pageSize: number;
  total: number;
  posts: StudyGroupPostSummary[];
}

// 게시글 리스트 조회
export const fetchStudyGroupPosts = async (
  groupId: number,
  page = 1,
  pageSize = 10
): Promise<StudyGroupPostListResponse> => {
  return DUMMY_STUDY_DISCUSS_LIST;

  // const res = await api.get(`/api/studygroup/${groupId}/discuss/${page}`, {
  //   params: { pageSize },
  // });
  // return res.data;
};

//게시글 상세 조회
export const fetchStudyGroupPostDetail = async (
  groupId: number,
  postId: number
): Promise<StudyGroupPostDetail> => {
  return DUMMY_STUDY_DISCUSS_DETAIL;

  // const res = await api.get(`/api/studygroup/${groupId}/discuss/${postId}`);
  // return res.data;
};

// 댓글 목록
export const fetchStudyGroupComments = async (
  groupId: number,
  postId: number
): Promise<StudyGroupComment[]> => {
  return DUMMY_STUDY_DISCUSS_COMMENTS; // 더미

  // const res = await api.get(`/api/studygroup/${groupId}/discuss/${postId}/comment`);
  // return res.data.comments;
};

//게시글 작성
export const writeStudyGroupPost = async (
  groupId: number,
  payload: {
    post_title: string;
    contents: string;
    tag: string;
    anonymity: boolean;
    is_private: boolean;
  }
) => {
  return { message: "더미 작성 완료", post_id: 99 };

  // const res = await api.post(`/api/studygroup/${groupId}/discuss/1`, payload);
  // return res.data;
};

// 댓글 작성
export const writeStudyGroupComment = async (
  groupId: number,
  postId: number,
  payload: { author: string; contents: string; anonymity: boolean }
) => {
  return { comment_id: 999, message: "더미 댓글 작성 완료" };

  // const res = await api.post(`/api/studygroup/${groupId}/discuss/${postId}/comment/post`, payload);
  // return res.data;
};
