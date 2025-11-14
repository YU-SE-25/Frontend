import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// ▶ 실제 API 사용
//import { getProblemDetail, increaseView,  } from "../api/problemdetail_api";
// ▶ 더미 사용하려면 위 import 대신 이 두 줄로 바꿔서 사용
import type { IProblem } from "../../api/problem_api";
import {
  getDummyProblemDetail as getProblemDetail,
  increaseDummyView as increaseView,
} from "../../api/dummy/problem_dummy";

import {
  ProblemWrapper,
  MainContent,
  MetaInfoSection,
  MetaRow,
  MetaLabel,
  MetaValue,
  UserStatsBox,
  DescriptionSection,
  SectionHeader,
  InlineTagList,
  ExampleContainer,
  ExamplePairWrapper,
  ExampleSection,
  HintSpoiler,
  ActionSection,
  SolveButton,
  ViewCodeButton,
  TagLink,
} from "../../theme/ProblemDetail.Style";

export default function ProblemDetail() {
  const navigate = useNavigate();
  const { problemId } = useParams<{ problemId: string }>();

  const [problemData, setProblemData] = useState<IProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = true;

  useEffect(() => {
    if (!problemId) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getProblemDetail(problemId);
        setProblemData(data);
        // 조회수 증가는 실패해도 페이지 렌더에는 영향 없도록 await 안 걸어도 됨
        increaseView(problemId).catch(() => {});
      } catch (e) {
        console.error("문제 정보 로드 실패", e);
        setProblemData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [problemId]);

  const handleSolveProblem = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    navigate(`/problems/${problemId}/solve`);
  };

  const handleViewMyCode = () => {
    if (!isLoggedIn) return;
    // navigate(`/submissions?problemId=${problemId}&userId=me`);
  };

  if (loading) return <ProblemWrapper>로딩 중...</ProblemWrapper>;
  if (!problemData)
    return <ProblemWrapper>문제를 찾을 수 없습니다.</ProblemWrapper>;

  return (
    <ProblemWrapper>
      <MainContent>
        <MetaInfoSection>
          <MetaRow>
            <MetaValue>#{problemData.id}</MetaValue>
            <MetaValue style={{ fontSize: "24px", fontWeight: "bold" }}>
              {problemData.title}
            </MetaValue>
          </MetaRow>

          <MetaRow>
            <MetaLabel>난이도:</MetaLabel>
            <MetaValue>{problemData.difficulty}</MetaValue>

            <MetaLabel>조회수:</MetaLabel>
            <MetaValue>{problemData.views}</MetaValue>

            <MetaLabel>등록일:</MetaLabel>
            <MetaValue>{problemData.uploadDate}</MetaValue>

            <MetaLabel>작성자:</MetaLabel>
            <MetaValue>
              <Link to={`/mypage/${problemData.author}`}>
                {problemData.author}
              </Link>
            </MetaValue>
          </MetaRow>

          <MetaRow>
            <MetaLabel>푼 사람:</MetaLabel>
            <MetaValue>{problemData.solvedCount}</MetaValue>

            <MetaLabel>정답률:</MetaLabel>
            <MetaValue>{problemData.successRate}</MetaValue>

            <MetaLabel>시간 제한:</MetaLabel>
            <MetaValue>{problemData.timeLimit}</MetaValue>

            <MetaLabel>메모리 제한:</MetaLabel>
            <MetaValue>{problemData.memoryLimit}</MetaValue>

            <MetaLabel>사용 가능 언어:</MetaLabel>
            <MetaValue>
              {problemData.allowedLanguages?.join(", ") || "Undefined"}
            </MetaValue>
          </MetaRow>

          {isLoggedIn &&
            problemData.userStatus &&
            problemData.userStatus !== "none" && (
              <UserStatsBox $userStatus={problemData.userStatus}>
                <MetaLabel>나의 도전 횟수:</MetaLabel>
                <MetaValue>{problemData.userAttempts}</MetaValue>
                <MetaLabel>나의 정답률:</MetaLabel>
                <MetaValue>{problemData.userSuccessRate}</MetaValue>
              </UserStatsBox>
            )}
        </MetaInfoSection>
        <ActionSection>
          {/*추후 조건 추가(로그인&하나라도 풀었으면*/}
          <ViewCodeButton onClick={handleViewMyCode}>
            내 코드 보기
          </ViewCodeButton>
          <ViewCodeButton
            onClick={() => {
              if (!isLoggedIn) {
                alert("로그인 후 이용 가능합니다.");
                return;
              }
              // navigate(`/problems/${problemId}/qna`);
            }}
          >
            QnA
          </ViewCodeButton>
          <ViewCodeButton
            onClick={() => {
              if (!isLoggedIn) {
                alert("로그인 후 이용 가능합니다.");
                return;
              }
              //navigate(`/problems/${problemId}/review`);
            }}
          >
            코드 리뷰
          </ViewCodeButton>

          <SolveButton onClick={handleSolveProblem}>문제 풀기</SolveButton>
        </ActionSection>
        <DescriptionSection>
          <SectionHeader>
            <h3>문제 설명</h3>
            {problemData.tags && problemData.tags.length > 0 && (
              <InlineTagList>
                {problemData.tags.map((tag) => (
                  <TagLink
                    key={tag}
                    to={`/problem-list?tag=${encodeURIComponent(tag)}`}
                  >
                    {tag}
                  </TagLink>
                ))}
              </InlineTagList>
            )}
          </SectionHeader>
          <p style={{ whiteSpace: "pre-wrap" }}>{problemData.description}</p>
        </DescriptionSection>

        <DescriptionSection>
          <h3>입출력</h3>
          <p>입력: {problemData.inputDescription}</p>
          <p>출력: {problemData.outputDescription}</p>

          <ExampleContainer>
            {problemData.examples.map((example, index) => (
              <ExamplePairWrapper key={index}>
                <ExampleSection>
                  <h4>입력 예제 {index + 1}</h4>
                  <pre>
                    <code>{example.input}</code>
                  </pre>
                </ExampleSection>
                <ExampleSection>
                  <h4>출력 예제 {index + 1}</h4>
                  <pre>
                    <code>{example.output}</code>
                  </pre>
                </ExampleSection>
              </ExamplePairWrapper>
            ))}
          </ExampleContainer>
        </DescriptionSection>

        {problemData.hint && (
          <DescriptionSection>
            <h3>힌트</h3>
            <HintSpoiler>
              <p>{problemData.hint}</p>
            </HintSpoiler>
          </DescriptionSection>
        )}

        {problemData.source && (
          <DescriptionSection>
            <h3>출처</h3>
            <p>{problemData.source}</p>
          </DescriptionSection>
        )}
      </MainContent>
    </ProblemWrapper>
  );
}
