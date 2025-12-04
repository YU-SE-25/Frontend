import type { SubmissionStatus } from "./mySubmissions_api";
// 타입 그대로 사용 (단비 제공본)
export * from "./dummy/codeeditor_dummy";

import { api } from "./axios";
// 지금은 dummy API 사용
import {
  dummyRunCode,
  dummySaveDraft,
  dummyLoadDraft,
  dummySubmitCode,
} from "./dummy/codeeditor_dummy";

// 실제 API와 동일한 인터페이스 제공
export const runCode = dummyRunCode;
export const saveDraft = dummySaveDraft;
export const loadDraft = dummyLoadDraft;
export const submitCode = dummySubmitCode;

// 코드 실행 API 응답 타입: /api/code/run
export interface ICodeRunResult {
  output: string;
  compileError: string | null;
  compileTimeMs: number;
}

// 코드 임시 저장 API 요청/응답 타입: /api/submissions/draft
export interface ICodeDraftRequest {
  problemId: number;
  code: string;
  language: string;
}
export interface ICodeDraftLoadResult {
  code: string;
  language: string;
}

// 코드 제출 API 요청/응답 타입: /api/submissions
export interface ICodeSubmitRequest {
  problemId: number;
  code: string;
  language: string;
}
export interface ICodeSubmitResult {
  submissionId: number;
  message: string;
}

// 제출 상태 및 결과 조회 API 응답 타입: /api/submissions/{submissionId}/status

export interface ISubmissionStatusResult {
  status: SubmissionStatus;
  currentTestCase?: number;
  totalTestCases: number;
  // 채점 완료 시 추가되는 필드
  runtime?: number; // ms 단위
  memory?: number;
  passedTestCases?: number;
  failedTestCase?: number;
}

// 실제 백엔드 연동용 axios 버전
/*

import axios from "axios";


const api = axios.create({
  baseURL: "", 
});

// 실행
export async function runCode(code: string, language: string) {
  const res = await api.post("/api/code/run", { code, language });
  return res.data;
}

// 임시 저장
export async function saveDraft(req) {
  const res = await api.post("/api/submissions/draft", req);
  return res.data;
}

// 임시 저장 불러오기
export async function loadDraft(problemId: number) {
  const res = await api.get("/api/submissions/draft", {
    params: { problemId },
  });
  return res.data;
}

// 제출
export async function submitCode(req) {
  const res = await api.post("/api/submissions", req);
  return res.data;
}

// 제출 상태 조회


*/
export async function getSubmissionStatus(
  submissionId: number
): Promise<SubmissionStatus> {
  const res = await api.get(`/api/submissions/${submissionId}/status`);
  return res.data;
}
