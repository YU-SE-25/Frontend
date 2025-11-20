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

const DEFAULT_LANGUAGE = "C";

interface CodeEditorViewProps {
  problem: IProblem;
  code: string;
  onCodeChange: (value: string) => void;
  onSaveTemp: () => void;
  onLoadTemp: () => void;
  onSubmit: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  isSubmitting: boolean;
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
}: CodeEditorViewProps) {
  const [isDark] = useAtom(isDarkAtom);

  // 폰트 크기 상태 (기본 20)
  const [fontSize, setFontSize] = useState(20);

  const availableLanguages = problem.allowedLanguages?.length
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

      {/* EditorWrapper로 모나코를 감싸서 배경 커스텀 */}
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
        <ActionButton $main onClick={onSubmit}>
          제출하기
        </ActionButton>
      </ActionRow>
    </ViewContentWrapper>
  );
}
