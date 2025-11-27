import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import type { IProblem } from "../../api/problem_api";
import { fetchDummyProblemDetail as getProblemDetail } from "../../api/dummy/problem_dummy_new";

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
  EditorPanelContainer,
  ExampleBox,
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
  const [language, setLanguage] = useState("Python");

  /* 코드 */
  const [code, setCode] = useState("");

  /* 실행,제출 결과 */
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  /* 문제 로딩 */
  useEffect(() => {
    if (!problemId) return;

    const load = async () => {
      setLoading(true);
      try {
        if (!problemId) return;
        const data = await getProblemDetail(Number(problemId));
        setProblemData(data);

        if (data.allowedLanguages && data.allowedLanguages.length > 0) {
          const preferred = ["Python", "C++", "Java"]; // 우선순위
          const picked =
            preferred.find((lang) => data.allowedLanguages.includes(lang)) ??
            data.allowedLanguages[0];

          setLanguage(picked);
        } else {
          setLanguage("Python");
        }
      } catch (e) {
        console.error("문제 정보 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [problemId]);

  /* 코드 실행 */
  const handleRun = useCallback(async () => {
    if (!problemId) return "문제 ID 없음";

    const runResult = await runCode(code, language);

    const result: ExecutionResult = {
      status: runResult.compileError ? "RE" : "WA",
      time: `${runResult.compileTimeMs}ms`,
      memory: "64MB",
      testCasesPassed: "0/0",
    };

    setExecutionResult(result);
    setIsModalOpen(true);

    const statusText = runResult.compileError ? "컴파일 에러(RE)" : "정상 실행";

    return [
      ">>> 실행 결과",
      `상태: ${statusText}`,
      `컴파일 시간: ${runResult.compileTimeMs}ms`,
      `사용 메모리: 64MB`,
      `통과 테스트: 0/0`,
    ].join("\n");
  }, [code, language, problemId]);

  /* 임시 저장 */
  const handleSaveDraft = useCallback(async () => {
    if (!problemId) return;

    await saveDraft({
      problemId: Number(problemId),
      code,
      language,
    });

    alert("임시 저장 완료!");
  }, [code, language, problemId]);

  /* 임시 저장된 코드 불러오기 */
  const handleLoadDraft = useCallback(async () => {
    if (!problemId) return;

    const saved = await loadDraft(Number(problemId));

    if (!saved) {
      alert("임시 저장 없음");
      return;
    }

    setCode(saved.code);
    setLanguage(saved.language);
    alert("불러오기 완료!");
  }, [problemId]);

  /* 제출 */
  const nav = useNavigate();
  const handleSubmit = useCallback(async () => {
    if (!problemId) return;

    await submitCode({
      problemId: Number(problemId),
      code,
      language,
    });

    nav("/problems/:username/submitted?id=" + problemId + "&showResult=true");
  }, [code, language, problemId, nav]);

  if (loading) return <ProblemSolveWrapper>로딩 중...</ProblemSolveWrapper>;
  if (!problemData)
    return <ProblemSolveWrapper>문제를 찾을 수 없습니다.</ProblemSolveWrapper>;

  return (
    <ProblemSolveWrapper>
      <ProblemInfoContainer>
        <ProblemTitle>{problemData.title}</ProblemTitle>

        <ProblemDescriptionBox>{problemData.description}</ProblemDescriptionBox>

        <ProblemDetailText>
          제한: {problemData.timeLimit}초 / {problemData.memoryLimit}MB
        </ProblemDetailText>

        {problemData.inputOutputExample && (
          <div style={{ marginTop: "20px" }}>
            <h3>입출력 예시</h3>
            <ExampleBox>{problemData.inputOutputExample}</ExampleBox>
          </div>
        )}
      </ProblemInfoContainer>

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
  );
}
