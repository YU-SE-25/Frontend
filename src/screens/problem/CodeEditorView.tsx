import { useState } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
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

// ⭐ 우리가 직접 정의할 언어 ID들
const JAVA_LANG_ID = "java-simple";
const CPP_LANG_ID = "cpp-simple";
const PY_LANG_ID = "python-simple";

// ⭐ 언어 토큰 규칙 등록 (키워드/문자열/주석/숫자 정도)
const setupLanguages = (monaco: Monaco) => {
  const already = monaco.languages.getLanguages().map((l) => l.id);

  if (!already.includes(JAVA_LANG_ID)) {
    monaco.languages.register({ id: JAVA_LANG_ID });
    monaco.languages.setMonarchTokensProvider(JAVA_LANG_ID, {
      tokenizer: {
        root: [
          [
            /\b(class|public|private|protected|static|void|int|long|double|float|boolean|if|else|for|while|return|new|try|catch|finally|import|package|extends|implements|this|super)\b/,
            "keyword",
          ],
          [/\/\/.*$/, "comment"],
          [/\/\*.*\*\//, "comment"],
          [/".*?"/, "string"],
          [/'.*?'/, "string"],
          [/\b\d+(\.\d+)?\b/, "number"],
        ],
      },
    });
  }

  if (!already.includes(CPP_LANG_ID)) {
    monaco.languages.register({ id: CPP_LANG_ID });
    monaco.languages.setMonarchTokensProvider(CPP_LANG_ID, {
      tokenizer: {
        root: [
          [
            /\b(int|long|double|float|char|void|bool|if|else|for|while|return|class|struct|namespace|using|std|include|new|delete|public|private|protected)\b/,
            "keyword",
          ],
          [/\/\/.*$/, "comment"],
          [/\/\*.*\*\//, "comment"],
          [/".*?"/, "string"],
          [/'.*?'/, "string"],
          [/\b\d+(\.\d+)?\b/, "number"],
        ],
      },
    });
  }

  if (!already.includes(PY_LANG_ID)) {
    monaco.languages.register({ id: PY_LANG_ID });
    monaco.languages.setMonarchTokensProvider(PY_LANG_ID, {
      tokenizer: {
        root: [
          [
            /\b(def|class|return|if|elif|else|for|while|import|from|as|try|except|finally|with|lambda|yield|pass|break|continue|True|False|None)\b/,
            "keyword",
          ],
          [/#.*$/, "comment"],
          [/""".*?"""/, "string"],
          [/'''.*?'''/, "string"],
          [/".*?"/, "string"],
          [/'.*?'/, "string"],
          [/\b\d+(\.\d+)?\b/, "number"],
        ],
      },
    });
  }
};

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

  // ⭐ 화면에서 선택하는 문자열 -> 우리가 만든 커스텀 언어 ID
  const monacoLangMap: Record<string, string> = {
    C: CPP_LANG_ID, // C도 C++룰로 색칠
    "C++": CPP_LANG_ID,
    Java: JAVA_LANG_ID,
    Python: PY_LANG_ID,
    Python3: PY_LANG_ID,
    JS: "javascript",
    TS: "typescript",
  };

  const monacoLanguage = monacoLangMap[language] || "plaintext";

  // 실행 결과 상태
  const [output, setOutput] = useState("");

  const handleExecuteClick = async () => {
    if (!onExecute) {
      return alert("실행 기능이 없습니다!");
    }

    try {
      const result = await onExecute();
      setOutput(result);
    } catch (err: any) {
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
          beforeMount={setupLanguages} // ⭐ 여기서 언어/색 규칙 전부 등록
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
