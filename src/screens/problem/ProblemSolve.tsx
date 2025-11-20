import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import type { IProblem } from "../../api/problem_api";
import { getDummyProblemDetail as getProblemDetail } from "../../api/dummy/problem_dummy";

import {
  runCode,
  saveDraft,
  loadDraft,
  submitCode,
} from "../../api/codeeditor_api";

import CodeEditorView from "./CodeEditorView";

import {
  ProblemSolveWrapper,
  ProblemInfoContainer,
  ProblemTitle,
  ProblemDetailText,
  ProblemDescriptionBox,
  ExampleContainer,
  ExamplePairWrapper,
  ExampleSection,
  EditorPanelContainer,
} from "../../theme/ProblemSolve.Style";

/* 실행/제출 결과 타입 */
interface ExecutionResult {
  status: string;
  time: string;
  memory: string;
  testCasesPassed: string;
}

export default function ProblemSolvePage() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();

  const [problemData, setProblemData] = useState<IProblem | null>(null);
  const [loading, setLoading] = useState(true);

  /* 언어 선택 */
  const [language, setLanguage] = useState("C");

  /* 코드 */
  const [code, setCode] = useState("");

  /* 실행/제출 결과 */
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);

  /* 팝업 */
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* 문제 로딩*/
  useEffect(() => {
    if (!problemId) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getProblemDetail(problemId);
        setProblemData(data);

        // allowedLanguages가 있으면 첫 번째로
        if (data.allowedLanguages && data.allowedLanguages.length > 0) {
          setLanguage(data.allowedLanguages[0]);
        } else {
          setLanguage("C");
        }
      } catch (e) {
        console.error("문제 정보 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [problemId]);

  /* 코드 실행*/
  const handleRun = useCallback(async () => {
    if (!problemId) return;

    const runResult = await runCode(code, language);

    const result: ExecutionResult = {
      status: runResult.compileError ? "RE" : "WA",
      time: `${runResult.compileTimeMs}ms`,
      memory: "64MB",
      testCasesPassed: "0/0",
    };

    setExecutionResult(result);
    setIsModalOpen(true);
  }, [code, language, problemId]);

  /*  임시 저장*/
  const handleSaveDraft = useCallback(async () => {
    if (!problemId) return;

    await saveDraft({
      problemId: Number(problemId),
      code,
      language,
    });

    alert("임시 저장 완료!");
  }, [code, language, problemId]);

  /* 임시 저장 불러오기*/
  const handleLoadDraft = useCallback(async () => {
    if (!problemId) return;

    const saved = await loadDraft(Number(problemId));

    if (!saved) {
      alert("임시 저장된 코드가 없습니다");
      return;
    }

    setCode(saved.code);
    setLanguage(saved.language);
    alert("임시 저장 불러오기 완료!");
  }, [problemId]);

  /* 제출 + 채점 */
  const nav = useNavigate();
  const handleSubmit = useCallback(async () => {
    if (!problemId) return;

    const submission = await submitCode({
      problemId: Number(problemId),
      code,
      language,
    });
    //const submissionId = submission.submissionId;

    //deprecated
    /*
    let finalData: ExecutionResult | null = null;
  
    const poll = setInterval(async () => {
      const statusData = await getSubmissionStatus(submissionId);
  
      if (statusData.status === "GRADING") return;
  
      finalData = {
        status: statusData.status,
        time: `${statusData.runtime ?? 0}ms`,
        memory: `${statusData.memory ?? 0}MB`,
        testCasesPassed:
          statusData.passedTestCases !== undefined
            ? `${statusData.passedTestCases}/${statusData.totalTestCases}`
            : "0/0",
      };
  
      clearInterval(poll);
  
      setExecutionResult(finalData);
      setIsModalOpen(true);
    }, 900);
    */

    // 🔹 제출 후 결과 페이지로 이동
    nav("/problems/:username/solved?id=" + problemId + "&showResult=true");
  }, [code, language, problemId, nav]);

  if (loading) return <ProblemSolveWrapper>로딩 중...</ProblemSolveWrapper>;
  if (!problemData)
    return <ProblemSolveWrapper>문제를 찾을 수 없습니다.</ProblemSolveWrapper>;

  return (
    <>
      <ProblemSolveWrapper>
        {/* 왼쪽: 문제 정보 */}
        <ProblemInfoContainer>
          <ProblemTitle>{problemData.title}</ProblemTitle>

          <ProblemDescriptionBox>
            {problemData.description}
          </ProblemDescriptionBox>

          <ProblemDetailText>
            입력: {problemData.inputDescription}
          </ProblemDetailText>
          <ProblemDetailText>
            출력: {problemData.outputDescription}
          </ProblemDetailText>

          <h3 style={{ marginTop: "15px" }}>입출력 예시</h3>

          <ExampleContainer>
            {problemData.examples.map((ex, idx) => (
              <ExamplePairWrapper key={idx}>
                <ExampleSection>
                  <h4>입력 예제 {idx + 1}</h4>
                  <pre>
                    <code>{ex.input}</code>
                  </pre>
                </ExampleSection>

                <ExampleSection>
                  <h4>출력 예제 {idx + 1}</h4>
                  <pre>
                    <code>{ex.output}</code>
                  </pre>
                </ExampleSection>
              </ExamplePairWrapper>
            ))}
          </ExampleContainer>

          <ProblemDetailText>
            제한: {problemData.timeLimit} / {problemData.memoryLimit}
          </ProblemDetailText>
        </ProblemInfoContainer>

        {/* 오른쪽 코드 에디터만 */}
        <EditorPanelContainer>
          <CodeEditorView
            problem={problemData}
            code={code}
            onCodeChange={setCode}
            onExecute={handleRun}
            onSaveTemp={handleSaveDraft}
            onLoadTemp={handleLoadDraft}
            onSubmit={handleSubmit}
            language={language}
            onLanguageChange={setLanguage}
          />
        </EditorPanelContainer>
      </ProblemSolveWrapper>
    </>
  );
}
