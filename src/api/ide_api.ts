import { api } from "./axios";

// 임시 저장
export interface DraftSaveRequest {
  problemId: number;
  code: string;
  language: string;
}
export interface DraftSaveResponse {
  message: string;
  draftSubmissionId: number;
}

// 임시 저장 불러오기
export interface DraftLoadResponse {
  code: string;
  language: string;
}

// 코드 실행
export interface RunCodeRequest {
  code: string;
  language: string;
  input: string;
}
export interface RunCodeResponse {
  output: string; // 실행 결과
  compileError: string | null;
  compileTimeMs: number;
}

// 제출하기
export interface SubmitRequest {
  problemId: number;
  code: string;
  language: string;
}
export interface SubmitResponse {
  submissionId: number;
  message: string;
}

export const IDEAPI = {
  // 1) 임시 저장
  saveDraft: async (data: DraftSaveRequest) => {
    const res = await api.patch<DraftSaveResponse>("/submissions/draft", data);
    return res.data;
  },

  // 2) 임시 저장된 코드 불러오기
  loadDraft: async (problemId: number) => {
    const res = await api.get<DraftLoadResponse>(
      `/submissions/draft?problemId=${problemId}`
    );
    return res.data;
  },

  // 3) 코드 실행
  run: async (data: RunCodeRequest) => {
    const res = await api.post<RunCodeResponse>("/code/run", data);
    return res.data;
  },

  // 4) 제출하기
  submit: async (data: SubmitRequest) => {
    const res = await api.post<SubmitResponse>("/submissions", data);
    return res.data;
  },
};
