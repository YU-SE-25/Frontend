import { useState } from "react";
import Editor from "@monaco-editor/react";
import { useAtom } from "jotai";
import { isDarkAtom } from "../../atoms";

import type { IProblem } from "../../api/problem_api";

import {
  ViewContentWrapper,
  LanguageDisplay,
  LanguageSelect,
  LanguageSelectWrapper,
  FontSizeSelect,
  EditorWrapper,
  ActionRow,
  ActionButton,
} from "../../theme/ProblemSolve.Style";

import styled from "styled-components";

const DEFAULT_LANGUAGE = "C";

//실행 결과 UI용 박스 스타일
const OutputBox = styled.pre`
  width: 100%;
  min-height: 120px;
  margin-top: 14px;
  padding: 14px;
  background: ${(p) => p.theme.bgColor};
  color: ${(p) => p.theme.textColor};
  border: 1px solid ${(p) => p.theme.textColor}33;
  border-radius: 10px;
  white-space: pre-wrap;
  font-size: 14px;
`;

interface CodeEditorViewProps {
  problem?: Partial<IProblem>;
  code: string;
  onCodeChange: (value: string) => void;
  onSaveTemp: () => void;
  onLoadTemp: () => void;
  onSubmit: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  isSubmitting?: boolean;
  hideSubmit?: boolean;

  //추가됨: 실행 기능 (IDE 에서 사용)
  onExecute?: () => Promise<string>;
}

export default function CodeEditorView({
  problem,
  code,
  onCodeChange,
  onSaveTemp,
  onLoadTemp,
  onSubmit,
  language,
  onLanguageChange,
  onExecute,
  hideSubmit,
}: CodeEditorViewProps) {
  const [isDark] = useAtom(isDarkAtom);
  const [fontSize, setFontSize] = useState(20);

  const availableLanguages = problem?.allowedLanguages?.length
    ? problem.allowedLanguages
    : [DEFAULT_LANGUAGE];

  const monacoLangMap: Record<string, string> = {
    C: "c",
    "C++": "cpp",
    Java: "java",
    Python: "python",
    Python3: "python",
    JS: "javascript",
    TS: "typescript",
  };

  const monacoLanguage = monacoLangMap[language] || "plaintext";

  // 실행 결과 상태
  const [output, setOutput] = useState("");

  const handleExecuteClick = async () => {
    console.log("실행 버튼 눌림!");

    if (!onExecute) {
      console.log("onExecute 없음!!!!!");
      return alert("실행 기능이 없습니다!");
    }

    try {
      const result = await onExecute();
      console.log("onExecute 결과:", result);
      setOutput(result);
    } catch (err: any) {
      console.log("실행 중 오류:", err);
      setOutput("실행 중 오류 발생:\n" + err?.message);
    }
  };

  return (
    <ViewContentWrapper>
      <LanguageDisplay>
        사용 언어 :
        <LanguageSelectWrapper>
          <LanguageSelect
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </LanguageSelect>
        </LanguageSelectWrapper>
        <FontSizeSelect
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        >
          {[14, 16, 18, 20, 22, 24, 28].map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </FontSizeSelect>
      </LanguageDisplay>

      {/* 모나코 에디터 */}
      <EditorWrapper>
        <Editor
          height="100%"
          language={monacoLanguage}
          value={code}
          theme={isDark ? "vs-dark" : "vs-light"}
          onChange={(value) => onCodeChange(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: fontSize,
            scrollBeyondLastLine: false,
            padding: { top: 10 },
            wordWrap: "on",
          }}
        />
      </EditorWrapper>

      {/* 버튼 */}
      <ActionRow>
        <ActionButton onClick={onLoadTemp}>불러오기</ActionButton>
        <ActionButton onClick={onSaveTemp}>임시저장</ActionButton>

        {onExecute && (
          <ActionButton onClick={handleExecuteClick}>실행</ActionButton>
        )}

        {!hideSubmit && (
          <ActionButton onClick={onSubmit}>제출하기</ActionButton>
        )}
      </ActionRow>

      {/* 실행 결과 출력창 */}
      {output && <OutputBox>{output}</OutputBox>}
    </ViewContentWrapper>
  );
}
