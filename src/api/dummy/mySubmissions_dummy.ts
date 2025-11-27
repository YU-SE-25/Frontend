import type { Submission } from "../mySubmissions_api";
import type { SubmissionListResponse } from "../mySubmissions_api";

export const dummySubmissions: Submission[] = [
  {
    submissionId: 201,
    problemId: 1,
    problemTitle: "두 수의 합",
    status: "CA",
    language: "PYTHON",
    runtime: 45,
    memory: 512,
    submittedAt: "2025-11-27T09:10:00",
  },
  {
    submissionId: 202,
    problemId: 1,
    problemTitle: "두 수의 합",
    status: "WA",
    language: "JAVA",
    runtime: 120,
    memory: 1024,
    submittedAt: "2025-11-27T09:15:00",
  },
  {
    submissionId: 203,
    problemId: 2,
    problemTitle: "정렬된 배열에서 원소 찾기",
    status: "CA",
    language: "CPP",
    runtime: 30,
    memory: 256,
    submittedAt: "2025-11-27T09:20:00",
  },
  {
    submissionId: 204,
    problemId: 2,
    problemTitle: "정렬된 배열에서 원소 찾기",
    status: "TLE",
    language: "PYTHON",
    runtime: 2100,
    memory: 2048,
    submittedAt: "2025-11-27T09:25:00",
  },
  {
    submissionId: 205,
    problemId: 3,
    problemTitle: "가장 긴 팰린드롬",
    status: "GRADING",
    language: "JAVA",
    runtime: 0,
    memory: 0,
    submittedAt: "2025-11-27T09:30:00",
  },
  {
    submissionId: 206,
    problemId: 3,
    problemTitle: "가장 긴 팰린드롬",
    status: "CA",
    language: "PYTHON",
    runtime: 320,
    memory: 4096,
    submittedAt: "2025-11-27T09:35:00",
  },
  {
    submissionId: 207,
    problemId: 2,
    problemTitle: "정렬된 배열에서 원소 찾기",
    status: "RE",
    language: "C",
    runtime: 80,
    memory: 512,
    submittedAt: "2025-11-27T09:40:00",
  },
  {
    submissionId: 208,
    problemId: 1,
    problemTitle: "두 수의 합",
    status: "CE",
    language: "JAVA",
    runtime: 0,
    memory: 0,
    submittedAt: "2025-11-27T09:45:00",
  },
  {
    submissionId: 209,
    problemId: 3,
    problemTitle: "가장 긴 팰린드롬",
    status: "MLE",
    language: "CPP",
    runtime: 600,
    memory: 65536,
    submittedAt: "2025-11-27T09:50:00",
  },
  {
    submissionId: 210,
    problemId: 2,
    problemTitle: "정렬된 배열에서 원소 찾기",
    status: "DRAFT",
    language: "PYTHON",
    runtime: 0,
    memory: 0,
    submittedAt: "2025-11-27T09:55:00",
  },
];
export function fetchDummySubmissions(): Promise<SubmissionListResponse> {
  return Promise.resolve({
    totalPages: 1,
    totalElements: dummySubmissions.length,
    currentPage: 0,
    submissions: dummySubmissions,
  });
}
export function fetchDummySubmissionById(
  submissionId: number
): Promise<Submission | undefined> {
  return Promise.resolve(
    dummySubmissions.find(
      (submission) => submission.submissionId === submissionId
    )
  );
}
