import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ProblemListWrapper,
  PageTitle,
  ControlBar,
  SearchContainer,
  SearchInput,
  SearchButton,
  SortSelect,
  ProblemTable,
  TableHead,
  HeaderCell,
  TableRow,
  TableCell,
  EmptyCell,
  TitleCell,
  ProblemLink,
  Pagination,
  ExpandButton,
  SummaryRow,
  SummaryBox,
  TitleContainer,
  StatusIndicator,
  InfoActionCell,
  ActionInSummaryButton,
} from "../theme/ProblemList.Style";

import type {
  HeaderCellProps,
  StatusProps,
  UserProblemStatus,
} from "../theme/ProblemList.Style";

interface Problem {
  id: number;
  title: string;
  difficulty: string; // '하', '중', '상' 등도 union type으로 만들면 더 좋습니다.
  views: number;
  summary: string;
  uploadDate: string;
  solvedCount: number;
  successRate: string;
  userStatus: UserProblemStatus;
}
// 더미 데이터
const DUMMY_PROBLEMS: Problem[] = [
  {
    id: 1001,
    title: "두 수의 합",
    difficulty: "하",
    views: 50,
    summary: "...",
    uploadDate: "2025-10-24",
    solvedCount: 150,
    successRate: "85%",
    userStatus: "solved",
  },
  {
    id: 1002,
    title: "정렬된 배열...",
    difficulty: "중",
    views: 120,
    summary: "...",
    uploadDate: "2025-09-19",
    solvedCount: 80,
    successRate: "60%",
    userStatus: "attempted",
  },
  {
    id: 1003,
    title: "가장 긴 팰린드롬",
    difficulty: "상",
    views: 80,
    summary: "...",
    uploadDate: "2025-09-16",
    solvedCount: 30,
    successRate: "40%",
    userStatus: "none",
  },
];

export default function ProblemList() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("latest"); // 정렬 기준
  const [expandedProblemId, setExpandedProblemId] = useState<number | null>(
    null
  ); // 아코디언 상태

  const filteredProblems = DUMMY_PROBLEMS.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm)
  );

  //검색 버튼 -> 꼭 필요할까? 의논필요
  const handleSearch = () => {
    if (searchTerm.trim().length === 0) {
      alert("검색어를 입력해 주세요.");
      return;
    }
    if (searchTerm.trim().length < 2) {
      alert("두 자 이상의 문자를 입력해 주세요.");
      return;
    }
    console.log(`검색 실행: ${searchTerm}, 정렬: ${sortType}`);
    // API 호출
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 아코디언 토글 함수
  const handleToggleSummary = (problemId: number) => {
    setExpandedProblemId((currentId) =>
      currentId === problemId ? null : problemId
    );
  };

  //코드작성 시 로그인 여부 확인
  const handleDirectSolve = (problemId: number) => {
    //로그인 상태 확인 로직 추가 (useAuthStore 등 사용)
    const isLoggedIn = true; // 임시 로그인 상태
    if (isLoggedIn) {
      //navigate(`/problems/${problemId}?mode=solve`); // solve 모드로 바로 이동
    } else {
      alert("로그인 후 이용 가능합니다.");
      // navigate('/login');
    }
  };

  return (
    <ProblemListWrapper>
      <PageTitle>문제 목록</PageTitle>

      {/* 검색 및 정렬 바 */}
      <ControlBar>
        <SearchContainer>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="문제 ID 또는 제목 검색 (2자 이상)"
            onKeyPress={handleKeyPress}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchContainer>

        {/* 최신 정렬 기준 반영 */}
        <SortSelect
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="latest">최신순</option>
          {/* <option value="oldest">오래된 순</option> */}{" "}
          {/* SRS에 없으므로 일단 주석 */}
          <option value="low_difficulty">난이도순 (낮은 순)</option>
          <option value="high_difficulty">난이도순 (높은 순)</option>
          <option value="views">조회순</option>
          <option value="id">문제번호 순</option>
          <option value="language">선호 언어 (미구현)</option>
        </SortSelect>
      </ControlBar>

      {/* 문제 목록 테이블 */}
      <ProblemTable>
        <TableHead>
          <tr>
            {/* 헤더 컬럼 */}
            <HeaderCell width="8%">번호</HeaderCell>
            <HeaderCell width="42%">문제 제목</HeaderCell>
            <HeaderCell width="15%">난이도</HeaderCell>
            <HeaderCell width="10%">조회수</HeaderCell>
            <HeaderCell width="15%">등록일</HeaderCell>
            <HeaderCell width="10%"> </HeaderCell>
          </tr>
        </TableHead>
        <tbody>
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem) => (
              <React.Fragment key={problem.id}>
                <TableRow $userStatus={problem.userStatus}>
                  <TableCell>{problem.id}</TableCell>
                  <TitleCell>
                    <TitleContainer>
                      <StatusIndicator $userStatus={problem.userStatus} />
                      <ProblemLink to={`/problems/${problem.id}`}>
                        {problem.title}
                      </ProblemLink>
                      {/* ExpandButton은 TitleContainer 밖으로 이동 */}
                    </TitleContainer>
                  </TitleCell>
                  <TableCell>{problem.difficulty}</TableCell>
                  <TableCell>{problem.views}</TableCell>
                  <TableCell>{problem.uploadDate}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <ExpandButton
                      onClick={() => handleToggleSummary(problem.id)}
                    >
                      {expandedProblemId === problem.id ? "▼" : "▶"}
                    </ExpandButton>
                  </TableCell>
                </TableRow>

                {/* 아코디언 내용 행 */}
                {expandedProblemId === problem.id && (
                  <SummaryRow>
                    \
                    <TableCell colSpan={6}>
                      <SummaryBox>
                        {/* 왼쪽 텍스트 영역 */}
                        <div>
                          <p>
                            <strong>요약:</strong> {problem.summary}
                          </p>
                          <p>
                            {/* 등록일 제거 */}
                            <strong>푼 사람:</strong> {problem.solvedCount} |{" "}
                            <strong>정답률:</strong> {problem.successRate}
                          </p>
                        </div>
                        {/* 오른쪽 버튼 영역 */}
                        <div>
                          <ActionInSummaryButton
                            onClick={() => handleDirectSolve(problem.id)}
                          >
                            바로 코드 작성
                          </ActionInSummaryButton>
                        </div>
                      </SummaryBox>
                    </TableCell>
                  </SummaryRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              {/*위에 빨간줄 ???*/}
              <EmptyCell colSpan={6}>
                {searchTerm ? "검색된 문제가 없습니다." : "문제가 없습니다."}
              </EmptyCell>
            </TableRow>
          )}
        </tbody>
      </ProblemTable>

      <Pagination>페이지네이션 영역</Pagination>
    </ProblemListWrapper>
  );
}
