import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import type { IProblem } from "../../api/problem_api";
import { fetchDummyProblemDetail as getProblemDetail } from "../../api/dummy/problem_dummy_new";

import { IDEAPI } from "../../api/ide_api";

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

export default function ProblemSolvePage() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();

  const [problemData, setProblemData] = useState<IProblem | null>(null);
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      alert("로그인 후 이용해주세요!");
      navigate("/login");
    }
  }, [token, navigate]);

  /* 문제 로딩 */
  useEffect(() => {
    if (!problemId) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getProblemDetail(Number(problemId));
        setProblemData(data);

        if (data.allowedLanguages?.length) {
          const preferred = ["Python", "C++", "Java"];
          setLanguage(
            preferred.find((l) => data.allowedLanguages.includes(l)) ||
              data.allowedLanguages[0]
          );
        }
      } catch (e) {
        console.error("문제 정보 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [problemId]);

  /* 실행하기 */
  const handleRun = useCallback(async () => {
    if (!problemId) return "문제 ID 없음";

    const result = await IDEAPI.run({
      code,
      language,
      input: "",
    });

    // result가 실 API거나 더미거나 둘 다 같은 형식
    return `
[ 표준 출력(stdout) ]
${result.output}

[ 표준 에러(stderr) ]
${result.compileError ?? "(없음)"}

[ 실행 시간 ]
${result.compileTimeMs} ms
`.trim();
  }, [code, language, problemId]);

  /* 임시 저장 */
  const handleSaveDraft = useCallback(async () => {
    if (!problemId) return;

    await IDEAPI.saveDraft({
      problemId: Number(problemId),
      code,
      language,
    });

    alert("임시 저장 완료!");
  }, [code, language, problemId]);

  /* 임시 저장 불러오기 */
  const handleLoadDraft = useCallback(async () => {
    if (!problemId) return;

    const saved = await IDEAPI.loadDraft(Number(problemId));

    setCode(saved.code);
    setLanguage(saved.language);

    alert("불러오기 완료!");
  }, [problemId]);

  /* 제출하기 */
  const handleSubmit = useCallback(async () => {
    if (!problemId) return;

    await IDEAPI.submit({
      problemId: Number(problemId),
      code,
      language,
    });

    navigate("/problems/:username/submitted?id=" + problemId);
  }, [code, language, problemId, navigate]);

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
