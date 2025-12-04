import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import type { IProblem } from "../../api/problem_api";
import {
  fetchProblemDetail,
  mapDetailDtoToProblem,
} from "../../api/problem_api";

import { fetchDummyProblemDetail } from "../../api/dummy/problem_dummy_new";
import { IDEAPI } from "../../api/ide_api";
import CodeEditorView from "./CodeEditorView";

import {
  ProblemSolveWrapper,
  ProblemInfoContainer,
  ProblemTitle,
  ProblemDetailText,
  ProblemDescriptionBox,
  EditorPanelContainer,
  ExampleBox,
} from "../../theme/ProblemSolve.Style";
import { userProfileAtom } from "../../atoms";
import { useAtom } from "jotai";

const languageMap: Record<string, string> = {
  Python: "PYTHON",
  "C++": "CPP",
  Java: "JAVA",
};

const reverseLanguageMap: Record<string, string> = {
  PYTHON: "Python",
  CPP: "C++",
  JAVA: "Java",
};

export default function ProblemSolvePage() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [problemData, setProblemData] = useState<IProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile] = useAtom(userProfileAtom);

  // 내가 푼 문제 다시 풀어보기(language type 확인 필요!!)
  const [language, setLanguage] = useState(
    location.state?.language ?? "Python"
  );
  const [code, setCode] = useState(location.state?.initialCode ?? "");
  const token = localStorage.getItem("accessToken");

  // 이미 라우터에서 막더라도, 토큰이 없으면 한 번 더 보호
  useEffect(() => {
    if (!token) {
      alert("로그인 후 이용해주세요!");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!problemId) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        // 1차: 실서버 문제 상세 호출
        const real = await fetchProblemDetail(Number(problemId));
        if (!mounted) return;

        setProblemData(real);

        if (real.allowedLanguages?.length) {
          const preferred = ["Python", "C++", "Java"];
          setLanguage(
            preferred.find((l) => real.allowedLanguages!.includes(l)) ??
              real.allowedLanguages[0]
          );
        }
      } catch (e) {
        console.warn("문제 상세 API 실패 → 더미 문제로 fallback 시도", e);

        try {
          //2차: 더미 상세 (DTO) 불러오기
          const dummyDto = await fetchDummyProblemDetail(Number(problemId));
          if (!mounted) return;

          // 더미는 ProblemDetailDto 형태라, IProblem으로 변환
          const mapped = mapDetailDtoToProblem(dummyDto);
          setProblemData(mapped);

          if (mapped.allowedLanguages?.length) {
            const preferred = ["Python", "C++", "Java"];
            setLanguage(
              preferred.find((l) => mapped.allowedLanguages!.includes(l)) ??
                mapped.allowedLanguages[0]
            );
          }
        } catch (err) {
          console.error("더미 문제 로드도 실패:", err);
          if (mounted) setProblemData(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [problemId]);

  // 실행하기
  const handleRun = async () => {
    if (!problemId) return "문제 ID 없음";

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

  // 임시 저장
  const handleSaveDraft = async () => {
    if (!problemId) return;

    await IDEAPI.saveDraft({
      problemId: Number(problemId),
      code,
      language: languageMap[language],
    });

    alert("임시 저장 완료!");
  };

  // 임시 저장 불러오기
  const handleLoadDraft = async () => {
    if (!problemId) return;

    const saved = await IDEAPI.loadDraft(Number(problemId));

    setCode(saved.code);
    setLanguage(reverseLanguageMap[saved.language] ?? "Python");

    alert("불러오기 완료!");
  };

  // 제출하기
  const handleSubmit = async () => {
    if (!problemId) return;

    await IDEAPI.submit({
      problemId: Number(problemId),
      code,
      language: languageMap[language],
    });

    // TODO: username 나중에 실제 값으로 치환 예정이라면 여기는 그대로 유지
    navigate(
      "/problems/" +
        userProfile?.nickname +
        "/submitted?id=" +
        problemId +
        "&showResult=true"
    );
  };

  // -----------------------------
  // 렌더링
  // -----------------------------

  if (loading) {
    return <ProblemSolveWrapper>로딩 중...</ProblemSolveWrapper>;
  }

  if (!problemData) {
    return <ProblemSolveWrapper>문제를 찾을 수 없습니다.</ProblemSolveWrapper>;
  }

  return (
    <ProblemSolveWrapper>
      <ProblemInfoContainer>
        <ProblemTitle>{problemData.title}</ProblemTitle>

        <ProblemDescriptionBox>{problemData.description}</ProblemDescriptionBox>

        <ProblemDetailText>
          제한: {problemData.timeLimit}초 / {problemData.memoryLimit}MB
        </ProblemDetailText>

        {problemData.inputOutputExample && (
          <div style={{ marginTop: "20px" }}>
            <h3>입출력 예시</h3>
            <ExampleBox>{problemData.inputOutputExample}</ExampleBox>
          </div>
        )}
      </ProblemInfoContainer>

      <EditorPanelContainer>
        <CodeEditorView
          problem={problemData}
          code={code}
          onCodeChange={setCode}
          onExecute={handleRun}
          onSaveTemp={handleSaveDraft}
          onLoadTemp={handleLoadDraft}
          onSubmit={handleSubmit}
          language={language}
          onLanguageChange={setLanguage}
        />
      </EditorPanelContainer>
    </ProblemSolveWrapper>
  );
}
