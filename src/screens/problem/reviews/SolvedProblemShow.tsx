import { useLocation } from "react-router-dom";
import styled from "styled-components";
import CodePreview from "../../../components/CodePreview";

const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 32px 24px;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.bgColor};
`;

const Inner = styled.div`
  width: 100%;
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Heading = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.textColor};
`;

const MetaRow = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textColor}99;
`;

const ErrorText = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
`;

type LocationState = {
  code?: string;
  language?: string;
  problemTitle?: string;
};

const langMap: Record<string, string> = {
  C: "c",
  "C++": "cpp",
  Java: "java",
  Python: "python",
  Python3: "python",
  JS: "javascript",
  TS: "typescript",
};

export default function SolvedProblemShow() {
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const code = state.code || "";
  const problemTitle = state.problemTitle || "내 제출 코드";
  const rawLang = state.language || "C";
  const hlLang = langMap[rawLang] || "text";

  if (!code) {
    return (
      <Page>
        <Inner>
          <Heading>내 코드 미리보기</Heading>
          <ErrorText>표시할 코드가 없습니다.</ErrorText>
        </Inner>
      </Page>
    );
  }

  return (
    <Page>
      <Inner>
        <Heading>내 코드 미리보기</Heading>
        <MetaRow>
          문제: {problemTitle} · 언어: {rawLang}
        </MetaRow>
        <CodePreview code={code} language={hlLang} />
      </Inner>
    </Page>
  );
}
