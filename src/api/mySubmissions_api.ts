import { fetchDummySubmissions } from "./dummy/mySubmissions_dummy";

export type SubmissionStatus =
  | "PENDING"
  | "GRADING"
  | "CA"
  | "WA"
  | "CE"
  | "RE"
  | "TLE"
  | "MLE"
  | "DRAFT";

export interface Submission {
  submissionId: number;
  problemId: number;
  problemTitle: string;
  status: SubmissionStatus;
  language: "JAVA" | "PYTHON" | "C" | "CPP" | "JAVASCRIPT"; // 이것도 확장 가능
  runtime: number;
  memory: number;
  submittedAt: string; // ISO DateTime 문자열
}

export interface SubmissionListResponse {
  totalPages: number;
  totalElements: number;
  currentPage: number;
  submissions: Submission[];
}

export async function fetchSubmissions() {
  return fetchDummySubmissions();
}
