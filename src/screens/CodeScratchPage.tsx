import { useState, useEffect } from "react";
import styled from "styled-components";
import CodeEditorView from "../screens/problem/CodeEditorView";
import { api } from "../api/axios";
import { IDEAPI } from "../api/ide_api";

import {
  ProblemTitle,
  ProblemDetailText,
  ProblemDescriptionBox,
  ExampleContainer,
  ExamplePairWrapper,
  ExampleSection,
  EditorPanelContainer,
} from "../theme/ProblemSolve.Style";

// ---------------- 스타일 그대로 유지 ------------------

const PanelContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 80px);
  margin-top: 80px;
`;

const LeftPanel = styled.div<{ $open: boolean }>`
  width: ${(p) => (p.$open ? "35%" : "0px")};
  overflow: hidden;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.bgColor};
`;

const CollapseHandle = styled.div`
  width: 12px;
  background: ${(p) => p.theme.textColor}33;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(p) => p.theme.textColor}55;
  }
`;

const HeaderRow = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProblemSelectBox = styled.div`
  padding: 0 20px;
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ProblemInput = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid ${(p) => p.theme.textColor}55;
  background: ${(p) => p.theme.bgColor};
  color: ${(p) => p.theme.textColor};
  width: 160px;
`;

const PrettyButton = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  background: ${(p) => p.theme.focusColor};
  color: white;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    transform: scale(1.05);
  }
`;

const EmptyInfo = styled.div`
  padding: 20px;
  opacity: 0.7;
`;

const DeleteButton = styled.button`
  padding: 6px 10px;
  border: none;
  border-radius: 8px;
  background: #ff4f4f;
  color: white;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
`;

const languageMap: Record<string, string> = {
  Python: "PYTHON",
  "C++": "CPP",
  Java: "JAVA",
};

interface ProblemDetailResponse {
  problemId: number;
  title: string;
  description: string;
  inputOutputExample: string;
}

async function fetchProblemDetail(problemId: number) {
  const res = await api.get(`/problems/detail/${problemId}`);

  const dto = res.data as ProblemDetailResponse;

  return {
    problemId: dto.problemId,
    title: dto.title,
    description: dto.description,
    inputDescription: dto.inputOutputExample ?? "",
    outputDescription: "",
    examples: [],
  };
}

// ---------------- 컴포넌트 ------------------

export default function CodeScratchPage() {
  const [open, setOpen] = useState(true);
  const [problemIdInput, setProblemIdInput] = useState("");
  const [problem, setProblem] = useState<any | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");

  const togglePanel = () => setOpen((prev) => !prev);

  const codeKey = problem ? `scratch-${problem.problemId}` : "scratch-null";

  // 문제 바뀌면 자동 로컬 코드 로드
  useEffect(() => {
    if (!problem) return;
    const saved = localStorage.getItem(codeKey);
    setCode(saved || "");
  }, [problem]);

  // 문제 삭제
  const clearProblem = () => {
    const ok = window.confirm("문제를 제거할까요? 현재 코드 저장할까요?");
    if (ok) localStorage.setItem(codeKey, code);

    setProblem(null);
    setCode("");
  };

  // 문제 불러오기
  const loadProblem = async () => {
    if (!problemIdInput.trim()) return alert("문제 번호를 입력해주세요.");

    const numericId = Number(problemIdInput.trim());
    if (isNaN(numericId)) return alert("올바른 문제번호가 아닙니다.");

    // 기존 코드 저장할지
    if (code.trim()) {
      const ok = window.confirm("현재 코드가 있습니다. 저장할까요?");
      if (ok) localStorage.setItem(codeKey, code);
    }

    try {
      const data = await fetchProblemDetail(numericId);
      setProblem(data);
    } catch {
      alert("문제를 찾을 수 없습니다.");
    }
  };

  // 임시 저장
  const saveCode = async () => {
    if (!problem) return alert("먼저 문제를 선택하세요!");

    const numericId = Number(problem.problemId);
    if (isNaN(numericId)) return alert("문제ID 오류!");

    await IDEAPI.saveDraft({
      problemId: numericId,
      code,
      language: languageMap[language],
    });

    alert("임시 저장 완료!");
  };

  // 임시 저장 불러오기
  const loadSaved = async () => {
    if (!problem) return alert("먼저 문제를 선택하세요!");

    const numericId = Number(problem.problemId);
    if (isNaN(numericId)) return alert("문제ID 오류!");

    const saved = await IDEAPI.loadDraft(numericId);

    setCode(saved.code);

    const reverseMap: Record<string, string> = {
      PYTHON: "Python",
      CPP: "C++",
      JAVA: "Java",
    };

    setLanguage(reverseMap[saved.language] ?? "Python");

    alert("불러오기 완료!");
  };

  // 실행 기능
  const executeCode = async () => {
    const result = await IDEAPI.run({
      code,
      language: languageMap[language],
      input: "",
    });

    return `
[ 표준 출력(stdout) ]
${result.output}

[ 표준 에러(stderr) ]
${result.compileError ?? "(없음)"}

[ 실행 시간 ]
${result.compileTimeMs} ms
`.trim();
  };

  // ---------------- 렌더 ----------------

  return (
    <PanelContainer>
      <LeftPanel $open={open}>
        <HeaderRow>
          <ProblemTitle>{problem ? problem.title : "코드 연습장"}</ProblemTitle>

          {problem && (
            <DeleteButton onClick={clearProblem}>문제 제거</DeleteButton>
          )}
        </HeaderRow>

        <ProblemSelectBox>
          <ProblemInput
            type="number"
            placeholder="문제 번호 입력"
            value={problemIdInput}
            onChange={(e) => setProblemIdInput(e.target.value)}
          />
          <PrettyButton onClick={loadProblem}>문제 불러오기</PrettyButton>
        </ProblemSelectBox>

        {!problem && (
          <EmptyInfo>문제를 선택하면 문제풀이 기능이 활성화돼요!</EmptyInfo>
        )}

        {problem && (
          <div style={{ padding: "0 20px" }}>
            <ProblemDescriptionBox>{problem.description}</ProblemDescriptionBox>

            <ProblemDetailText>
              입력: {problem.inputDescription}
            </ProblemDetailText>
            <ProblemDetailText>
              출력: {problem.outputDescription}
            </ProblemDetailText>

            {problem.examples.length > 0 && (
              <>
                <h3 style={{ marginTop: "15px" }}>입출력 예시</h3>
                <ExampleContainer>
                  {problem.examples.map((ex: any, idx: number) => (
                    <ExamplePairWrapper key={idx}>
                      <ExampleSection>
                        <h4>입력 {idx + 1}</h4>
                        <pre>
                          <code>{ex.input}</code>
                        </pre>
                      </ExampleSection>
                      <ExampleSection>
                        <h4>출력 {idx + 1}</h4>
                        <pre>
                          <code>{ex.output}</code>
                        </pre>
                      </ExampleSection>
                    </ExamplePairWrapper>
                  ))}
                </ExampleContainer>
              </>
            )}
          </div>
        )}
      </LeftPanel>

      <CollapseHandle onClick={togglePanel}>{open ? "‹" : "›"}</CollapseHandle>

      <EditorPanelContainer style={{ flex: 1 }}>
        <CodeEditorView
          problem={problem}
          code={code}
          onCodeChange={setCode}
          onSaveTemp={saveCode}
          onLoadTemp={loadSaved}
          onExecute={executeCode}
          onSubmit={() => alert("제출 기능은 문제풀이 페이지에서 구현!")}
          hideSubmit={!problem}
          language={language}
          onLanguageChange={setLanguage}
        />
      </EditorPanelContainer>
    </PanelContainer>
  );
}
