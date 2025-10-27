import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, Link, useNavigate } from "react-router-dom";
// import axiosInstance from '../api/axiosInstance';
// import { useAuthStore } from '../store/authStore'; // 전역 상태
import {
  ProblemWrapper,
  MetaInfoSection,
  MetaRow,
  MetaLabel,
  MetaValue,
  DescriptionSection,
  ExampleSection,
  ActionSection,
  SolveButton,
  ViewCodeButton,
  TagSection,
  TagLink,
} from "../theme/ProblemDetail.Style";

//문제 상세 데이터 타입 (더미)
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
  inputExample: string;
  outputExample: string;
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
  id: 1001,
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
  inputExample: "1 2",
  outputExample: "3",
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

  //로딩/데이터 없음 처리
  if (loading) return <ProblemWrapper>로딩 중...</ProblemWrapper>;
  if (!problemData)
    return <ProblemWrapper>문제를 찾을 수 없습니다.</ProblemWrapper>;

  return (
    <ProblemWrapper>
      {/* 1. 문제 메타 정보 섹션 */}
      <MetaInfoSection>
        <MetaRow>
          <MetaValue>#{problemData.id}</MetaValue> |
          <MetaValue style={{ fontSize: "20px", fontWeight: "bold" }}>
            {problemData.title}
          </MetaValue>{" "}
          |<MetaLabel>난이도:</MetaLabel>{" "}
          <MetaValue>{problemData.difficulty}</MetaValue> |
          <MetaLabel>조회수:</MetaLabel>{" "}
          <MetaValue>{problemData.views}</MetaValue> |
          <MetaLabel>등록일:</MetaLabel>{" "}
          <MetaValue>{problemData.uploadDate}</MetaValue> |
          <MetaLabel>작성자:</MetaLabel>{" "}
          <MetaValue>
            <Link to={`/profile/${problemData.author}`}>
              {problemData.author}
            </Link>
          </MetaValue>
        </MetaRow>
        <MetaRow>
          <MetaLabel>푼 사람:</MetaLabel>{" "}
          <MetaValue>{problemData.solvedCount}</MetaValue> |
          <MetaLabel>정답률:</MetaLabel>{" "}
          <MetaValue>{problemData.successRate}</MetaValue> |
          <MetaLabel>시간 제한:</MetaLabel>{" "}
          <MetaValue>{problemData.timeLimit}</MetaValue> |
          <MetaLabel>메모리 제한:</MetaLabel>{" "}
          <MetaValue>{problemData.memoryLimit}</MetaValue> |
          <MetaLabel>사용 가능 언어:</MetaLabel>{" "}
          <MetaValue>{problemData.allowedLanguages.join(", ")}</MetaValue>
        </MetaRow>
        {isLoggedIn &&
          problemData.userStatus &&
          problemData.userStatus !== "none" && (
            <MetaRow
              style={{
                color: problemData.userStatus === "solved" ? "green" : "red",
              }}
            >
              <MetaLabel>나의 도전 횟수:</MetaLabel>{" "}
              <MetaValue>{problemData.userAttempts}</MetaValue> |
              <MetaLabel>나의 정답률:</MetaLabel>{" "}
              <MetaValue>{problemData.userSuccessRate}</MetaValue>
            </MetaRow>
          )}
      </MetaInfoSection>

      <DescriptionSection>
        <h3>문제 설명</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{problemData.description}</p>
        {/* ... 입출력 형식 등 추가 ... */}

        <h3>입출력 예제</h3>
        <ExampleSection>
          <h4>입력</h4>
          <pre>
            <code>{problemData.inputExample}</code>
          </pre>
        </ExampleSection>
        <ExampleSection>
          <h4>출력</h4>
          <pre>
            <code>{problemData.outputExample}</code>
          </pre>
        </ExampleSection>

        {/*옵션 항목들*/}
        {problemData.hint && (
          <div>
            <h3>힌트</h3>
            <p>{problemData.hint}</p>
          </div>
        )}
        {problemData.source && (
          <div>
            <h3>출처</h3>
            <p>{problemData.source}</p>
          </div>
        )}
      </DescriptionSection>

      <ActionSection>
        <SolveButton onClick={handleSolveProblem}>문제 풀기</SolveButton>
        {/* 내 코드 보기 버튼 (로그인 & 푼 기록 있을 때) */}
        {isLoggedIn && problemData.userStatus === "solved" && (
          <ViewCodeButton onClick={handleViewMyCode}>
            내 코드 보기
          </ViewCodeButton>
        )}
      </ActionSection>

      {/*태그 영역 */}
      {problemData.tags && problemData.tags.length > 0 && (
        <TagSection>
          <h3>태그</h3>
          {problemData.tags.map((tag) => (
            <TagLink key={tag} to={`/problems?tag=${tag}`}>
              {tag}
            </TagLink>
          ))}
        </TagSection>
      )}
    </ProblemWrapper>
  );
}
