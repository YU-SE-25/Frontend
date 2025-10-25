import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
//전역 로그인 상태 import
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
  ExpandButton,
  SummaryRow,
  SummaryBox,
  TitleContainer,
  StatusIndicator,
  ActionInSummaryButton,
  PaginationContainer,
  PageLink,
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
    id: 1,
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
    id: 2,
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
    id: 3,
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
  const [sortType, setSortType] = useState("latest"); //정렬 기준
  const [expandedProblemId, setExpandedProblemId] = useState<number | null>(
    null
  ); // 아코디언 상태
  const [currentPage, setCurrentPage] = useState(1); //현재 페이지 (기본 1)
  const itemsPerPage = 10; //페이지당 문제 수

  //백엔드에서 들고 올 것들
  const [problems, setProblems] = useState<Problem[]>([]); //실제 문제 목록 상태
  const [loading, setLoading] = useState(true); //로딩 상태
  const [error, setError] = useState<string | null>(null); //에러 상태

  //전역 로그인 상태
  //const isLoggedIn = useAuthStore((state) => state.isLoggedIn); //로그인 여부 확인
  const isLoggedIn = true; //임시용
  //API 호출 로직
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true); // 로딩 시작
      setError(null); // 에러 초기화
      try {
        // 💡 API 호출: 정렬 기준(sortType)을 파라미터로 넘김
        // const response = await axios.get(`~~`, {
        //     params: { ~~~ } // 검색어도 함께 보낼 수 있음
        // });

        //더미 데이터 & 로그인 상태 로직 (API 연동 전 임시)
        console.log("Fetching problems with sort:", sortType);
        let fetchedProblems = DUMMY_PROBLEMS; // 일단 더미 사용

        //로그인 안 했으면 userStatus를 'none'으로 강제 설정
        if (!isLoggedIn) {
          fetchedProblems = fetchedProblems.map((p) => ({
            ...p,
            userStatus: "none",
          }));
        }
        // --- (임시 로직 끝) ---

        setProblems(fetchedProblems); // 상태 업데이트
      } catch (err) {
        setError("문제 목록을 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchProblems(); // 컴포넌트 마운트 또는 sortType 변경 시 함수 실행
  }, [sortType, isLoggedIn]); //sortType이나 로그인 상태가 바뀌면 다시 호출

  //필터링
  const filteredProblems = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm)
  );

  //검색 버튼 -> 지금 더미데이터로 하는거라 치자마자 검색이 되는데
  //백엔드에서 fetch하는 걸로 바꾸면 버튼 눌러야 검색됩니다...아마도
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

  //현재 페이지에 보여줄 문제 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //filteredProblems에서 현재 페이지 문제만
  const currentProblems = filteredProblems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  //총 페이지 수 계산
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  //페이지 변경
  const handlePageChange = (pageNumber: number) => {
    // 페이지 번호가 유효한 범위 내에 있을 때만 변경
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
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

      {loading && <p>문제 목록을 불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

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

      <PaginationContainer>
        <PageLink
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1} // 비활성화 조건
          aria-disabled={currentPage === 1} // 스크린 리더용
        >
          &lt; 이전
        </PageLink>

        {/* 페이지 번호 텍스트 링크들 */}
        {Array.from({ length: totalPages }, (_, index) => (
          <PageLink
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            isActive={currentPage === index + 1} // 현재 페이지면 활성
          >
            {index + 1}
          </PageLink>
        ))}

        {/* 다음 텍스트 링크 */}
        <PageLink
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages} // 비활성화 조건
          aria-disabled={currentPage === totalPages} // 스크린 리더용
        >
          다음 &gt;
        </PageLink>
      </PaginationContainer>
    </ProblemListWrapper>
  );
}
