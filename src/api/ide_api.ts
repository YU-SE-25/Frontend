import { api } from "./axios";
import {
  DUMMY_RUN_RESULT,
  DUMMY_DRAFT,
  DUMMY_DRAFT_SAVE_RESPONSE,
  DUMMY_SUBMIT_RESPONSE,
} from "./dummy/ide_dummy";

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

//임시 저장 불러오기
export interface DraftLoadResponse {
  code: string;
  language: string;
}

//코드 실행
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

//제출하기
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
    try {
      const res = await api.patch<DraftSaveResponse>(
        "/submissions/draft",
        data
      );
      return res.data;
    } catch (err) {
      console.error("임시 저장 API 실패 → 더미로 대체");
      return DUMMY_DRAFT_SAVE_RESPONSE;
    }
  },

  // 2) 임시 저장된 코드 불러오기
  loadDraft: async (problemId: number) => {
    try {
      const res = await api.get<DraftLoadResponse>(
        `/submissions/draft?problemId=${problemId}`
      );
      return res.data;
    } catch (err) {
      console.error("임시 저장 불러오기 실패 → 더미 로드");
      return DUMMY_DRAFT;
    }
  },

  // 3) 코드 실행
  run: async (data: RunCodeRequest) => {
    try {
      const res = await api.post<RunCodeResponse>("/code/run", data);
      return res.data;
    } catch (err) {
      console.error("코드 실행 실패 → 더미 실행 결과 사용");
      return DUMMY_RUN_RESULT;
    }
  },

  // 4) 제출하기
  submit: async (data: SubmitRequest) => {
    try {
      const res = await api.post<SubmitResponse>("/submissions", data);
      return res.data;
    } catch (err) {
      console.error("제출 API 실패 → 더미 제출 결과 사용");
      return DUMMY_SUBMIT_RESPONSE;
    }
  },
};
