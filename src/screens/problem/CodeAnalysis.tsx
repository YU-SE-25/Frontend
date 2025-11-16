//확인용 링크: http://localhost:5173/problems/1/submissions/123

import { useRef, useState } from "react";
import { useAtom } from "jotai";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { isDarkAtom } from "../../atoms";

import {
  Container,
  LeftPanel,
  ProblemInfo,
  Toolbar,
  CodeBox,
  Accordion,
  Resizer,
  RightPanel,
  Tabs,
  TabButton,
  Content,
  FontSizeSelect,
} from "../../theme/CodeAnalysis.Style";

import CodePerformance from "./CodePerformance";
import CodeProfiling from "./CodeProfiling";
import CodeFlowchart from "./CodeFlowchart";

export default function CodeAnalysis() {
  const { problemId, submissionId } = useParams();

  const [fontSize, setFontSize] = useState(16);
  const [isDark] = useAtom(isDarkAtom);

  const [panelWidth, setPanelWidth] = useState(380);
  const [activeTab, setActiveTab] = useState("performance");

  const dragging = useRef(false);

  const [openMeta, setOpenMeta] = useState(false);
  const [openTest, setOpenTest] = useState(false);

  const code = `function hello() {
  console.log("Hello Danbi!");
}`;

  const handleMouseDown = () => (dragging.current = true);
  const handleMouseUp = () => (dragging.current = false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 240 && newWidth < 700) setPanelWidth(newWidth);
  };

  return (
    <Container onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <LeftPanel>
        <ProblemInfo>
          <span>문제 {problemId} · 문제 제목 (임시) · 문제 요약 요약...</span>
        </ProblemInfo>

        <Toolbar>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>사용 언어 : JavaScript</span>

            <FontSizeSelect
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            >
              {[14, 16, 18, 20, 22, 24, 28].map((v) => (
                <option key={v} value={v}>
                  {v}px
                </option>
              ))}
            </FontSizeSelect>
          </div>
        </Toolbar>

        <CodeBox>
          <Editor
            height="100%"
            value={code}
            defaultLanguage="javascript"
            theme={isDark ? "vs-dark" : "light"}
            options={{
              readOnly: true,
              fontSize,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </CodeBox>

        <Accordion onClick={() => setOpenMeta((v) => !v)}>
          <strong>📄 제출 정보</strong>

          {openMeta && <div style={{ marginTop: "10px" }}>추후 추가</div>}
        </Accordion>

        <Accordion onClick={() => setOpenTest((v) => !v)}>
          <strong>✔ 테스트 케이스 결과</strong>

          {openTest && <div style={{ marginTop: "10px" }}>추후 추가</div>}
        </Accordion>
      </LeftPanel>

      <Resizer onMouseDown={handleMouseDown} />

      <RightPanel width={panelWidth}>
        <Tabs>
          <TabButton
            active={activeTab === "performance"}
            onClick={() => setActiveTab("performance")}
          >
            Code Performance
          </TabButton>

          <TabButton
            active={activeTab === "profiling"}
            onClick={() => setActiveTab("profiling")}
          >
            Code Profiling
          </TabButton>

          <TabButton
            active={activeTab === "flowchart"}
            onClick={() => setActiveTab("flowchart")}
          >
            Code Flowchart
          </TabButton>
        </Tabs>

        <Content>
          {activeTab === "performance" && <CodePerformance />}
          {activeTab === "profiling" && <CodeProfiling />}
          {activeTab === "flowchart" && <CodeFlowchart />}
        </Content>
      </RightPanel>
    </Container>
  );
}
