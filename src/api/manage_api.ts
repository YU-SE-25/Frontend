// src/api/manage_api.ts
import { api } from "./axios";

export interface ProblemListItem {
  problemId: number;
  title: string;
  tags: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  viewCount: number;
  createdAt: string;
  isSolved: boolean;
}

export interface SortInfo {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface PageableInfo {
  pageSize: number;
  pageNumber: number;
  paged: boolean;
  unpaged: boolean;
  offset: number;
  sort: SortInfo;
}

export interface ProblemListResponse {
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  pageable: PageableInfo;
  first: boolean;
  last: boolean;
  size: number;
  content: ProblemListItem[];
  number: number;
  sort: SortInfo;
  empty: boolean;
}

export async function fetchPendingProblemList(params: {
  title?: string;
  difficulty?: string;
  page?: number;
  size?: number;
  sort?: string;
}) {
  const res = await api.get<ProblemListResponse>("/problems/list", { params });
  return res.data;
}
