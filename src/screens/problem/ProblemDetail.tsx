import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProblemDetail } from "../../api/problem_api";
import {
  fetchDummyProblemDetail,
  increaseDummyView,
} from "../../api/dummy/problem_dummy_new";

import {
  ProblemWrapper,
  MainContent,
  MetaInfoSection,
  MetaRow,
  MetaLabel,
  MetaValue,
  //UserStatsBox,
  DescriptionSection,
  SectionHeader,
  InlineTagList,
  //ExampleContainer,
  //ExamplePairWrapper,
  //ExampleSection,
  HintSpoiler,
  ActionSection,
  SolveButton,
  ViewCodeButton,
  TagLink,
} from "../../theme/ProblemDetail.Style";

import { useAtomValue } from "jotai";
import { userProfileAtom } from "../../atoms";
import type { IProblem, ProblemDetailDto } from "../../api/problem_api";

function mapDetailDto(dto: ProblemDetailDto): IProblem {
  return {
    problemId: dto.problemId,
    title: dto.title,
    tags: dto.tags,
    difficulty: dto.difficulty,
    viewCount: dto.viewCount,
    createdAt: dto.createdAt.slice(0, 10),

    description: dto.description,
    inputOutputExample: dto.inputOutputExample,
    author: dto.createdByNickname,
    timeLimit: dto.timeLimit,
    memoryLimit: dto.memoryLimit,
    visibility: dto.visibility,
    hint: dto.hint,
    source: dto.source,

    summary: dto.description.slice(0, 50) + "...",
    solvedCount: dto.acceptedSubmissions,
    successRate: dto.acceptanceRate + "%",

    canEdit: dto.canEdit,
    userStatus: "NONE",
  };
}

export default function ProblemDetail() {
  const navigate = useNavigate();
  const { problemId } = useParams<{ problemId: string }>();

  const [problem, setProblem] = useState<IProblem | null>(null);
  const [loading, setLoading] = useState(true);

  const user = useAtomValue(userProfileAtom);
  const userRole = user?.role;
  const isLoggedIn = !!user;

  useEffect(() => {
    if (!problemId) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        const real = await fetchProblemDetail(Number(problemId));
        if (mounted) setProblem(real);
        increaseDummyView(Number(problemId));
      } catch {
        try {
          const dummy = await fetchDummyProblemDetail(Number(problemId));
          if (mounted) setProblem(mapDetailDto(dummy));
        } catch {
          if (mounted) setProblem(null);
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

  const handleSolveProblem = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    navigate(`/problems/${problemId}/solve`);
  };

  const handleViewMyCode = () => {
    if (!problem) return;
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 임시 코드 (원본 그대로 복구함)
    const code = `
#include <stdio.h>
int main() {
  int sum = 0;
  for(int i=1;i<=5;i++) sum+=i;
  printf("Total: %d\\n", sum);
}
`.trim();

    navigate("/my-code-preview", {
      state: {
        code,
        language: "C++",
        problemTitle: problem.title,
      },
    });
  };

  if (loading) return <ProblemWrapper>로딩 중...</ProblemWrapper>;
  if (!problem)
    return <ProblemWrapper>문제를 찾을 수 없습니다.</ProblemWrapper>;

  return (
    <ProblemWrapper>
      <MainContent>
        <MetaInfoSection>
          <MetaRow>
            <MetaValue>#{problem.problemId}</MetaValue>
            <MetaValue style={{ fontSize: "24px", fontWeight: "bold" }}>
              {problem.title}
            </MetaValue>
          </MetaRow>

          <MetaRow>
            <MetaLabel>난이도:</MetaLabel>
            <MetaValue>{problem.difficulty}</MetaValue>

            <MetaLabel>조회수:</MetaLabel>
            <MetaValue>{problem.viewCount}</MetaValue>

            <MetaLabel>등록일:</MetaLabel>
            <MetaValue>{problem.createdAt}</MetaValue>

            <MetaLabel>작성자:</MetaLabel>
            <MetaValue>
              <Link to={`/mypage/${problem.author}`}>{problem.author}</Link>
            </MetaValue>
          </MetaRow>

          <MetaRow>
            <MetaLabel>푼 사람:</MetaLabel>
            <MetaValue>{problem.solvedCount}</MetaValue>

            <MetaLabel>정답률:</MetaLabel>
            <MetaValue>{problem.successRate}</MetaValue>

            <MetaLabel>시간 제한:</MetaLabel>
            <MetaValue>{problem.timeLimit}초</MetaValue>

            <MetaLabel>메모리 제한:</MetaLabel>
            <MetaValue>{problem.memoryLimit}MB</MetaValue>
          </MetaRow>
        </MetaInfoSection>

        <ActionSection>
          <ViewCodeButton onClick={handleViewMyCode}>
            내 코드 보기
          </ViewCodeButton>

          <ViewCodeButton onClick={() => navigate(`/qna?id=${problemId}`)}>
            QnA
          </ViewCodeButton>

          <ViewCodeButton
            onClick={() => navigate(`/reviews?problem=${problemId}`)}
          >
            코드 리뷰
          </ViewCodeButton>

          <SolveButton onClick={handleSolveProblem}>문제 풀기</SolveButton>

          {(userRole === "MANAGER" || userRole === "INSTRUCTOR") &&
            problem.canEdit && (
              <ViewCodeButton
                onClick={() => navigate(`/problem-edit/${problemId}`)}
              >
                문제 수정
              </ViewCodeButton>
            )}
        </ActionSection>

        <DescriptionSection>
          <SectionHeader>
            <h3>문제 설명</h3>
            <InlineTagList>
              {problem.tags.map((tag) => (
                <TagLink
                  key={tag}
                  to={`/problem-list?tag=${encodeURIComponent(tag)}`}
                >
                  {tag}
                </TagLink>
              ))}
            </InlineTagList>
          </SectionHeader>

          <p style={{ whiteSpace: "pre-wrap" }}>{problem.description}</p>
        </DescriptionSection>

        <DescriptionSection>
          <h3>입출력 예제</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {problem.inputOutputExample}
          </pre>
        </DescriptionSection>

        {problem.hint && (
          <DescriptionSection>
            <h3>힌트</h3>
            <HintSpoiler>
              <p>{problem.hint}</p>
            </HintSpoiler>
          </DescriptionSection>
        )}

        {problem.source && (
          <DescriptionSection>
            <h3>출처</h3>
            <p>{problem.source}</p>
          </DescriptionSection>
        )}
      </MainContent>
    </ProblemWrapper>
  );
}
