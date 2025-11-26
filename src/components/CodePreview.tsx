import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import styled from "styled-components";
import { useAtomValue } from "jotai";
import { isDarkAtom } from "../atoms";
import {
  atomDarkForIDE as atomDark,
  oneLightForIDE as oneLight,
} from "../theme/codeTheme";

const PreviewBox = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.bgColor};
  border: 1px solid ${({ theme }) => theme.textColor}33;
  overflow-x: auto;
  font-size: 14px;
`;

interface Props {
  code: string;
  language: string;
}

export default function CodePreview({ code, language }: Props) {
  const isDark = useAtomValue(isDarkAtom);
  const style = isDark ? atomDark : oneLight;

  return (
    <PreviewBox>
      <SyntaxHighlighter
        language={language}
        style={style} // 다크/라이트에 따라 atomDark / oneLight
        showLineNumbers
        wrapLines
        customStyle={{
          background: "transparent", // 테마 배경 날리고
          margin: 0,
          padding: 0,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </PreviewBox>
  );
}
