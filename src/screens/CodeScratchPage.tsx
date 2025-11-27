import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CodeEditorView from "../screens/problem/CodeEditorView";

// dummy 문제 가져오는 함수
import { getDummyProblemDetail } from "../api/dummy/problem_dummy";

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

export default function CodeScratchPage() {
  // 패널 접기 상태
  const [open, setOpen] = useState(true);

  // 문제 선택
  const [problemIdInput, setProblemIdInput] = useState("");

  // 현재 문제 정보
  const [problem, setProblem] = useState<any | null>(null);

  // 코드 & 언어
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");

  // 패널 토글
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
    if (!problemIdInput.trim()) return alert("문제 번호 입력해!");

    // 코드 저장 여부
    if (code.trim()) {
      const ok = window.confirm("현재 코드가 있습니다. 저장할까요?");
      if (ok) localStorage.setItem(codeKey, code);
    }

    try {
      const data = await getDummyProblemDetail(problemIdInput.trim());
      if (!data) return alert("문제를 찾을 수 없습니다!");

      setProblem(data);
    } catch {
      alert("문제를 찾을 수 없습니다!");
    }
  };

  // ⭐ 코드 저장
  const saveCode = () => {
    if (!problem) return alert("먼저 문제를 선택하세요!");
    localStorage.setItem(codeKey, code);
    alert("저장됨!");
  };

  // 코드 불러오기
  const loadSaved = () => {
    if (!problem) return alert("먼저 문제를 선택하세요!");
    const saved = localStorage.getItem(codeKey);
    if (!saved) return alert("저장된 코드 없음!");
    setCode(saved);
  };

  // 실행기능 (추후 실제 API로 연결), 일단 더미
  const executeCode = async () => {
    // 실행 시간 / 메모리 더미값 생성 (진짜처럼 랜덤)
    const execTime = Math.floor(Math.random() * 50) + 5; // 5~55ms
    const memory = Math.floor(Math.random() * 4000) + 2000; // 2000~6000 KB

    // 가짜 stdout
    const fakeStdout = "Hello World\n테스트 출력입니다.";

    // 가짜 stderr (10% 확률로 생성)
    const fakeStderr =
      Math.random() < 0.1 ? "RuntimeWarning: Something went wrong" : "(없음)";

    // 컴파일 로그 (언어에 따라 다르게)
    const compileLog =
      language === "C++"
        ? "g++ 컴파일 성공 (warning 0개)"
        : language === "Java"
        ? "javac 컴파일 성공"
        : language === "Python"
        ? "파이썬은 컴파일 과정이 필요하지 않습니다."
        : "컴파일 로그 없음";

    // 무한루프 더미 체크
    const infiniteLoopWarning =
      code.includes("while(true)") || code.includes("for(;;)")
        ? "\n⚠ 무한루프 감지 → 실행 중단됨"
        : "";

    // 최종 출력 문자열 정리
    return `
[ 컴파일 로그 ]
${compileLog}

[ 실행 로그 ]
프로그램이 정상적으로 실행되었습니다.${infiniteLoopWarning}

[ 표준 출력 (stdout) ]
${fakeStdout}

[ 표준 에러 (stderr) ]
${fakeStderr}

[ 자원 사용량 ]
실행 시간: ${execTime} ms
사용 메모리: ${memory} KB

------------------------------------
Docker sandbox simulation complete.
`;
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
