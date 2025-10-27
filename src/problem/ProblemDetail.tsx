import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
// import axiosInstance from '../api/axiosInstance';
// import { useAuthStore } from '../store/authStore'; // 전역 상태
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
} from "../theme/ProblemDetail.Style";

//문제 상세 데이터 타입 (더미)
interface ProblemExample {
  input: string;
  output: string;
}
interface ProblemDetailData {
  id: number;
  title: string;
  difficulty: string;
  views: number;
  uploadDate: string;
  author: string; // 작성자 닉네임
  solvedCount: number;
  successRate: string;
  timeLimit: string;
  memoryLimit: string;
  allowedLanguages: string[];
  description: string;
  inputDescription: string;
  outputDescription: string;
  examples: ProblemExample[];
  hint?: string;
  source?: string;
  // 푼 문제 상태 (로그인 시)
  userStatus?: "solved" | "attempted" | "none";
  userAttempts?: number;
  userSuccessRate?: string;
  tags?: string[];
}

//더미 데이터
const DUMMY_PROBLEM_DETAIL: ProblemDetailData = {
  id: 1,
  title: "두 수의 합",
  difficulty: "하",
  views: 152,
  uploadDate: "2025-10-24",
  author: "율무",
  solvedCount: 150,
  successRate: "85%",
  timeLimit: "1초",
  memoryLimit: "128MB",
  allowedLanguages: ["Java", "Python", "C++"],
  description:
    "두 개의 정수 A와 B를 입력받아, A+B를 출력하는 프로그램을 작성하시오.",
  inputDescription:
    "첫째 줄에 정수 A와 B가 공백으로 구분되어 주어집니다. (0 < A, B < 10)",
  outputDescription: "첫째 줄에 A+B를 출력합니다.",
  examples: [
    { input: "1 2", output: "3" },
    { input: "5 7", output: "12" },
  ],
  hint: "덧셈 연산자를 사용하세요.",
  source: "기본 알고리즘",
  userStatus: "solved", // 'solved', 'attempted', 'none' 중 하나 (로그인 시)
  userAttempts: 3,
  userSuccessRate: "100%",
  tags: ["구현", "기초"],
};

export default function ProblemDetailPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  //상태 정의
  const [problemData, setProblemData] = useState<ProblemDetailData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const [showHint, setShowHint] = useState(false);

  //로그인 상태 가져오기 (전역 상태 사용 가정)
  // const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const isLoggedIn = true; // 임시: 로그인 상태로 가정

  //API 호출
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      console.log(`문제 #${problemId} 정보 로딩 및 조회수 증가 요청`);
      try {
        // TODO: 실제 API 호출 (GET /api/problems/{problemId})
        // const response = await axiosInstance.get(`/problems/${problemId}`);
        // setProblemData(response.data);

        // TODO: 조회수 증가 API 호출 (POST /api/problems/{problemId}/view) - 백그라운드 요청
        // axiosInstance.post(`/problems/${problemId}/view`);

        setProblemData(DUMMY_PROBLEM_DETAIL); // 임시 더미 데이터 사용
      } catch (error) {
        console.error("문제 정보 로드 실패", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  //'문제 풀기' 버튼 핸들러
  const handleSolveProblem = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다."); // TODO: 로그인 모달 띄우기
      // navigate('/login');
      return;
    }
    //navigate(`/problems/${problemId}/~~(주소미정)`); // 예시 경로
  };

  //'내 코드 보기' 버튼 핸들러
  const handleViewMyCode = () => {
    if (!isLoggedIn) return; // 로그인 상태 재확인
    // TODO: 내 제출 내역 페이지 또는 코드 편집기로 이동 (상세 구현 필요)
    //navigate(`/submissions?problemId=${problemId}&userId=me`); // 예시 경로
  };

  //로딩.데이터 없음 처리
  if (loading) return <ProblemWrapper>로딩 중...</ProblemWrapper>;
  if (!problemData)
    return <ProblemWrapper>문제를 찾을 수 없습니다.</ProblemWrapper>;

  return (
    <ProblemWrapper>
      <MainContent>
        {/* 문제 메타 정보 섹션 */}
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
              <Link to={`/profile/${problemData.author}`}>
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
            <MetaValue>{problemData.allowedLanguages.join(", ")}</MetaValue>
          </MetaRow>

          {/* 푼 문제 통계 (로그인 O & 푼 기록 O) */}
          {isLoggedIn &&
            problemData.userStatus &&
            problemData.userStatus !== "none" && (
              <UserStatsBox userStatus={problemData.userStatus}>
                <MetaLabel>나의 도전 횟수:</MetaLabel>
                <MetaValue>{problemData.userAttempts}</MetaValue>
                <MetaLabel>나의 정답률:</MetaLabel>
                <MetaValue>{problemData.userSuccessRate}</MetaValue>
              </UserStatsBox>
            )}
        </MetaInfoSection>

        {/* 문제 설명 영역 */}
        <DescriptionSection>
          <SectionHeader>
            <h3>문제 설명</h3>
            {/* 태그를 바로 옆에 표시*/}
            {problemData.tags && problemData.tags.length > 0 && (
              <InlineTagList>
                {problemData.tags.map((tag) => (
                  <TagLink key={tag} to={`/problems?tag=${tag}`}>
                    {tag}
                  </TagLink>
                ))}
              </InlineTagList>
            )}
          </SectionHeader>
          <p style={{ whiteSpace: "pre-wrap" }}>{problemData.description}</p>
        </DescriptionSection>

        {/* 입출력 섹션 */}
        <DescriptionSection>
          <h3>입출력</h3>
          <p>
            <strong>입력:</strong> {problemData.inputDescription}
          </p>
          <p>
            <strong>출력:</strong> {problemData.outputDescription}
          </p>

          {/* 예제 렌더링 */}
          <ExampleContainer>
            {problemData.examples.map((example, index) => (
              // 💡 각 예제 쌍을 ExamplePairWrapper로 감쌉니다.
              <ExamplePairWrapper key={index}>
                {/* 입력 예제 */}
                <ExampleSection>
                  <h4>입력 예제 {index + 1}</h4>
                  <pre>
                    <code>{example.input}</code>
                  </pre>
                </ExampleSection>
                {/* 출력 예제 */}
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

        {/* 힌트 */}
        {problemData.hint && (
          <DescriptionSection>
            {" "}
            {/* 다른 섹션과 동일한 스타일 사용 */}
            <h3>힌트</h3>
            <HintSpoiler>
              {/* 힌트 내용은 p 태그 안에 넣음 */}
              <p>{problemData.hint}</p>
            </HintSpoiler>
          </DescriptionSection>
        )}
        {/* 출처 */}
        {problemData.source && (
          <DescriptionSection>
            <h3>출처</h3>
            <p>{problemData.source}</p>
          </DescriptionSection>
        )}

        {/* 액션 버튼 영역 */}
        <ActionSection>
          <SolveButton onClick={handleSolveProblem}>문제 풀기</SolveButton>
          {isLoggedIn && problemData.userStatus === "solved" && (
            <ViewCodeButton onClick={handleViewMyCode}>
              내 코드 보기
            </ViewCodeButton>
          )}
        </ActionSection>
      </MainContent>
    </ProblemWrapper>
  );
}
