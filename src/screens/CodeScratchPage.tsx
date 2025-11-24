import React, { useState, useEffect } from "react";
import CodeEditorView from "./problem/CodeEditorView";
import styled from "styled-components";

const ScratchWrapper = styled.div`
  width: 80%;
  padding-top: 70px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 30px;
  margin-bottom: 10px;
  color: ${(p) => p.theme.textColor};
`;

const Subtitle = styled.p`
  font-size: 20px;
  margin-bottom: 30px;
  color: ${(p) => p.theme.textColor};
`;

export default function CodeScratchPage() {
  const STORAGE_KEY = "scratchpad-code";

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setCode(saved);
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, code);
    alert("저장 완료!");
  };

  const handleLoad = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return alert("저장된 코드 없음!");
    setCode(saved);
    alert("불러오기 완료!");
  };

  const handleExecute = async () => {
    return ">>> 실행 결과 예시\nHello World!";
  };

  return (
    <ScratchWrapper>
      <Title>코드 연습장</Title>
      <Subtitle>코드를 마음껏 치세요!</Subtitle>

      <CodeEditorView
        problem={{ allowedLanguages: ["Python", "C++", "Java"] }}
        code={code}
        onCodeChange={setCode}
        onSaveTemp={handleSave}
        onLoadTemp={handleLoad}
        onSubmit={() => {}}
        hideSubmit={true}
        language={language}
        onLanguageChange={setLanguage}
        onExecute={handleExecute}
      />
    </ScratchWrapper>
  );
}
