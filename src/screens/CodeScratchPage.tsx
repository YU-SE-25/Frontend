import { useState, useEffect } from "react";
import styled from "styled-components";
import CodeEditorView from "../screens/problem/CodeEditorView";
import { api } from "../api/axios";
// dummy 문제 가져오는 함수

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

const PanelContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 80px);
  margin-top: 80px;
`;

// 왼쪽 문제 패널
const LeftPanel = styled.div<{ $open: boolean }>`
  width: ${(p) => (p.$open ? "35%" : "0px")};
  overflow: hidden;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.bgColor};
`;

// 접기 핸들
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

// 헤더
const HeaderRow = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 문제 선택 UI
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

// 삭제 버튼
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

//백엔드 api
interface ProblemDetailResponse {
  problemId: number;
  title: string;
  description: string;
  inputOutputExample: string;
}

async function fetchProblemDetailWithFallback(problemId: number) {
  try {
    // 백엔드 문제 상세 API
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
  } catch (e) {
    console.warn("백엔드 문제 불러오기 실패 → 더미로 대체");

    return null;
  }
}

export default function CodeScratchPage() {
  const [open, setOpen] = useState(true);
  const [problemIdInput, setProblemIdInput] = useState("");
  const [problem, setProblem] = useState<any | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const togglePanel = () => setOpen((prev) => !prev);
  // 문제별 코드 저장 키
  const codeKey = problem ? `scratch-${problem.problemId}` : "scratch-null";

  // 문제 불러올 때 자동 코드 불러오기
  useEffect(() => {
    if (!problem) return;
    const saved = localStorage.getItem(codeKey);
    setCode(saved || "");
  }, [problem]);

  // 문제 삭제 기능
  const clearProblem = () => {
    const ok = window.confirm("문제를 제거할까요? 현재 코드 저장할까요?");
    if (ok) localStorage.setItem(codeKey, code);
    setProblem(null);
    setCode("");
  };

  // 문제 불러오기 기능
  const loadProblem = async () => {
    if (!problemIdInput.trim()) return alert("문제를 선택해주세요.");

    // 코드 저장 여부
    if (code.trim()) {
      const ok = window.confirm("현재 코드가 있습니다. 저장할까요?");
      if (ok) localStorage.setItem(codeKey, code);
    }

    try {
      const data = await fetchProblemDetailWithFallback(
        Number(problemIdInput.trim())
      );
      if (!data) return alert("문제를 찾을 수 없습니다!");

      setProblem(data);
    } catch {
      alert("문제를 찾을 수 없습니다!");
    }
  };

  // 코드 저장
  const saveCode = async () => {
    if (!problem) return alert("먼저 문제를 선택하세요!");

    await IDEAPI.saveDraft({
      problemId: Number(problem.problemId),
      code,
      language: languageMap[language],
    });

    alert("임시 저장 완료!");
  };

  // 코드 불러오기
  const loadSaved = async () => {
    if (!problem) return alert("먼저 문제를 선택하세요!");

    const saved = await IDEAPI.loadDraft(Number(problem.problemId));

    setCode(saved.code);

    const reverseMap: Record<string, string> = {
      PYTHON: "Python",
      CPP: "C++",
      JAVA: "Java",
    };

    setLanguage(reverseMap[saved.language] ?? "Python");

    alert("불러오기 완료!");
  };

  // 실행기능
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

            {problem?.examples?.length > 0 && (
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
          hideSubmit={!problem} // 문제 있을 때만 제출 버튼 표시
          language={language}
          onLanguageChange={setLanguage}
        />
      </EditorPanelContainer>
    </PanelContainer>
  );
}
