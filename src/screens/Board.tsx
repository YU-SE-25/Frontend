import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  SummaryRow,
  SummaryBox,
  TitleContainer,
  StatusIndicator,
  ActionInSummaryButton,
  PaginationContainer,
  PageLink,
  DetailsButton,
  ButtonContainer,
} from "../theme/ProblemList.Style";

import type { UserProblemStatus } from "../theme/ProblemList.Style";
import type { IProblem } from "../api/problem_api";
import { fetchProblems } from "../api/problem_api";
import { fetchDummyProblems } from "../api/dummy/problem_dummy";

const USE_DUMMY = true;

export default function ProblemList() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [expandedProblemId, setExpandedProblemId] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [problems, setProblems] = useState<IProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = true;

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetcher = USE_DUMMY ? fetchDummyProblems : fetchProblems;
        const data = await fetcher({
          sortType,
          searchTerm: searchTerm.trim().length >= 2 ? searchTerm : "",
          isLoggedIn,
          page: 1,
          size: 1000,
        });
        if (mounted) setProblems(data);
      } catch (e) {
        if (mounted) setError("문제 목록을 불러오는 데 실패했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [sortType, isLoggedIn, searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim().length === 0) {
      alert("검색어를 입력해 주세요.");
      return;
    }
    if (searchTerm.trim().length < 2) {
      alert("두 자 이상의 문자를 입력해 주세요.");
      return;
    }
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleToggleSummary = (problemId: number) => {
    setExpandedProblemId((currentId) =>
      currentId === problemId ? null : problemId
    );
  };

  const handleDirectSolve = (problemId: number) => {
    if (isLoggedIn) {
      // navigate(`/problems/${problemId}?mode=solve`);
    } else {
      alert("로그인 후 이용 가능합니다.");
    }
  };

  const handleViewDetails = (problemId: number) => {
    navigate(`/problem-detail/${problemId}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(problems.length / itemsPerPage);
  const currentProblems = problems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  return (
    <ProblemListWrapper>
      <PageTitle>게시판 인 척 하는 문제 목록</PageTitle>

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

        <SortSelect
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="low_difficulty">난이도순 (낮은 순)</option>
          <option value="high_difficulty">난이도순 (높은 순)</option>
          <option value="views">조회순</option>
          <option value="id">문제번호 순</option>
          <option value="language">선호 언어 (미구현)</option>
        </SortSelect>
      </ControlBar>

      {loading && <p>문제 목록을 불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ProblemTable>
        <TableHead>
          <tr>
            <HeaderCell width="8%">번호</HeaderCell>
            <HeaderCell width="42%">문제 제목</HeaderCell>
            <HeaderCell width="15%">난이도</HeaderCell>
            <HeaderCell width="10%">조회수</HeaderCell>
            <HeaderCell width="15%">등록일</HeaderCell>
            <HeaderCell width="10%"></HeaderCell>
          </tr>
        </TableHead>
        <tbody>
          {currentProblems.length > 0 ? (
            currentProblems.map((problem) => (
              <React.Fragment key={problem.id}>
                <TableRow $userStatus={problem.userStatus as UserProblemStatus}>
                  <TableCell>{problem.id}</TableCell>
                  <TitleCell>
                    <TitleContainer>
                      <StatusIndicator
                        $userStatus={problem.userStatus as UserProblemStatus}
                      />
                      <ProblemLink
                        to={`/problem-detail/${problem.id}`}
                        as="span"
                        onClick={() => handleToggleSummary(problem.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {problem.title}
                      </ProblemLink>
                    </TitleContainer>
                  </TitleCell>
                  <TableCell>{problem.difficulty}</TableCell>
                  <TableCell>{problem.views}</TableCell>
                  <TableCell>{problem.uploadDate}</TableCell>
                  <TableCell style={{ textAlign: "center" }}></TableCell>
                </TableRow>

                {expandedProblemId === problem.id && (
                  <SummaryRow>
                    <TableCell colSpan={6}>
                      <SummaryBox>
                        <div>
                          <p>
                            <strong>요약:</strong> {problem.summary}
                          </p>
                          <p>
                            <strong>푼 사람:</strong> {problem.solvedCount} |{" "}
                            <strong>정답률:</strong> {problem.successRate}
                          </p>
                        </div>
                        <ButtonContainer>
                          <DetailsButton
                            onClick={() => handleViewDetails(problem.id)}
                          >
                            상세보기
                          </DetailsButton>
                          <ActionInSummaryButton
                            onClick={() => handleDirectSolve(problem.id)}
                          >
                            바로 코드 작성
                          </ActionInSummaryButton>
                        </ButtonContainer>
                      </SummaryBox>
                    </TableCell>
                  </SummaryRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <EmptyCell colSpan={6}>
                {searchTerm ? "검색된 문제가 없습니다." : "문제가 없습니다."}
              </EmptyCell>
            </TableRow>
          )}
        </tbody>
      </ProblemTable>

      <PaginationContainer>
        <PageLink
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          aria-disabled={currentPage === 1}
        >
          &lt; 이전
        </PageLink>

        {Array.from({ length: totalPages }, (_, index) => (
          <PageLink
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            isActive={currentPage === index + 1}
          >
            {index + 1}
          </PageLink>
        ))}

        <PageLink
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          aria-disabled={currentPage === totalPages}
        >
          다음 &gt;
        </PageLink>
      </PaginationContainer>
    </ProblemListWrapper>
  );
}
