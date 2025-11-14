//타입 정의

// 코드 실행 결과
export interface ICodeRunResult {
  output: string;
  compileError: string | null;
  compileTimeMs: number;
}

// 임시 저장
export interface ICodeDraftRequest {
  problemId: number;
  code: string;
  language: string;
}
export interface ICodeDraftLoadResult {
  code: string;
  language: string;
}

// 제출
export interface ICodeSubmitRequest {
  problemId: number;
  code: string;
  language: string;
}
export interface ICodeSubmitResult {
  submissionId: number;
  message: string;
}

// 제출 결과 상태
export type SubmissionStatus =
  | "GRADING"
  | "CA"
  | "WA"
  | "TLE"
  | "MLE"
  | "RE"
  | string;

export interface ISubmissionStatusResult {
  status: SubmissionStatus;
  currentTestCase?: number;
  totalTestCases: number;
  runtime?: number;
  memory?: number;
  passedTestCases?: number;
  failedTestCase?: number;
}

/* 코드 실행 더미: /api/code/run*/
export function dummyRunCode(
  code: string,
  language: string
): Promise<ICodeRunResult> {
  return new Promise((resolve) => {
    console.log("[DUMMY] 실행 요청");

    setTimeout(() => {
      resolve({
        output: "정답이 아닙니다",
        compileError: null,
        compileTimeMs: Math.floor(Math.random() * 100) + 50,
      });
    }, 600);
  });
}

/* 임시 저장: /api/submissions/draft*/
export function dummySaveDraft(
  req: ICodeDraftRequest
): Promise<{ message: string }> {
  return new Promise((resolve) => {
    localStorage.setItem(`draft_${req.problemId}`, JSON.stringify(req));
    resolve({ message: "draft saved" });
  });
}

export function dummyLoadDraft(
  problemId: number
): Promise<ICodeDraftLoadResult | null> {
  return new Promise((resolve) => {
    const raw = localStorage.getItem(`draft_${problemId}`);
    if (!raw) return resolve(null);

    const data = JSON.parse(raw) as ICodeDraftLoadResult;
    resolve(data);
  });
}

/* 제출: /api/submissions*/
let submissionCounter = 1;

export function dummySubmitCode(
  req: ICodeSubmitRequest
): Promise<ICodeSubmitResult> {
  console.log("[DUMMY] 제출 요청:", req);

  return new Promise((resolve) => {
    const submissionId = submissionCounter++;
    resolve({
      submissionId,
      message: "제출 완료",
    });
  });
}

/* 제출 상태 조회: /api/submissions/{id}/status*/

// 제출별 상태 진척도 저장
const submissionHistory: Record<number, number> = {};

export function dummyGetSubmissionStatus(
  submissionId: number
): Promise<ISubmissionStatusResult> {
  return new Promise((resolve) => {
    const count = (submissionHistory[submissionId] ?? 0) + 1;
    submissionHistory[submissionId] = count;

    // 1~2차 poll → GRADING
    if (count === 1) {
      return resolve({
        status: "GRADING",
        currentTestCase: 1,
        totalTestCases: 5,
      });
    }

    if (count === 2) {
      return resolve({
        status: "GRADING",
        currentTestCase: 3,
        totalTestCases: 5,
      });
    }

    //임시 시나리오 :  첫 제출 → WA, 두 번째 제출 → CA (정답)
    const finalStatus: SubmissionStatus = submissionId === 1 ? "WA" : "CA";

    return resolve({
      status: finalStatus,
      totalTestCases: 5,
      passedTestCases: finalStatus === "CA" ? 5 : 3,
      failedTestCase: finalStatus === "CA" ? 0 : 2,
      runtime: 120,
      memory: 64,
    });
  });
}
