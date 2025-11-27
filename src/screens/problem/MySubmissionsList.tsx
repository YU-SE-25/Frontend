import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
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
  PaginationContainer,
  PageLink,
  DetailsButton,
  ButtonContainer,
  PageTitleContainer,
} from "../../theme/ProblemList.Style";
import { TOPBAR_HEIGHT } from "../../components/Topbar";
import CodeResult from "./SolveResult";
import styled, { css, keyframes } from "styled-components";

import {
  fetchSubmissions,
  type Submission,
  type SubmissionStatus,
} from "../../api/mySubmissions_api";

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  PENDING: "채점 대기",
  GRADING: "채점 중",
  CA: "정답",
  WA: "오답",
  CE: "컴파일 에러",
  RE: "런타임 에러",
  TLE: "시간 초과",
  MLE: "메모리 초과",
  DRAFT: "임시 저장",
};
const USE_DUMMY = true;

const scaleBig = keyframes`
 0% {
    max-height: 0px;
    transform: scale(0);
  }

  100% {
    max-height: 400px;
    margin-bottom: 150px;
    transform: scale(1.2);
  }
`;
const scaleSmall = keyframes`
 0% {
    max-height: 400px;
    margin-bottom: 150px;
    transform: scale(1.2);
  }

  100% {
    max-height: 0px;
    transform: scale(0);
  }
`;

const Blankdiv = styled.div<{
  $show: boolean;
  $animate: "none" | "open" | "close";
}>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  transform-origin: top;
  max-height: ${({ $show }) => ($show ? "600px" : "0")};

  animation: ${({ $animate }) => {
    if ($animate === "open") {
      return css`
        ${scaleBig} 0.7s cubic-bezier(0.368, 0.016, 0.491, 1.005) 0.2s 1 normal
          both
      `;
    }
    if ($animate === "close") {
      return css`
        ${scaleSmall} 0.7s cubic-bezier(0.368, 0.016, 0.491, 1.005) 0s 1 normal
          both
      `;
    }
    return "none";
  }};
`;

const ResultCellInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const StatusChip = styled.span<{ $status: SubmissionStatus }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #ffffff;

  background-color: ${({ $status }) => {
    switch ($status) {
      case "CA":
        return "#16a34a"; // 정답 - 초록
      case "WA":
        return "#ef4444"; // 오답 - 빨강
      case "PENDING":
      case "GRADING":
        return "#0ea5e9"; // 채점중 - 파랑
      case "CE":
      case "RE":
      case "TLE":
      case "MLE":
        return "#f97316"; // 에러류 - 주황
      case "DRAFT":
      default:
        return "#6b7280"; // 임시저장 - 회색
    }
  }};
`;

const ResultButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const SmallResultButton = styled.button`
  margin-right: 2px;
  background-color: ${(props) => props.theme.bgCardColor};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  white-space: nowrap;
  word-break: keep-all;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    background-color: ${(props) => props.theme.focusColor}60;
    cursor: pointer;
  }
`;

export const ProblemListWrapper = styled.div`
  height: 100%;
  width: 80%;
  margin: 0 auto;
  display: flex;
  padding-top: ${TOPBAR_HEIGHT + 10}px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: ${(props) => props.theme.bgColor};
`;
export const WholeWrapper = styled.div`
  height: 100%;
  width: 80%;
  margin: 0 auto;
  display: flex;
  padding-top: ${TOPBAR_HEIGHT + 10}px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: ${(props) => props.theme.bgColor};
`;

type StatusFilter = "all" | "correct" | "wrong" | "pending" | "error";

export default function MySubmissionsList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? ""
  );
  const [sortType, setSortType] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const selectedSubmissionId = searchParams.get("id")
    ? Number(searchParams.get("id"))
    : null;
  const showResult = searchParams.get("showResult") === "true";

  const show = selectedSubmissionId !== null && showResult;

  const [animate, setAnimate] = useState<"none" | "open" | "close">("none");
  const firstRenderRef = React.useRef(true);

  const [filter, setFilter] = useState<StatusFilter>("all");

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = true;

  // 제출 목록 로딩
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        // 이후 실제 API 생기면 여기 분기 추가
        const data = USE_DUMMY
          ? await fetchSubmissions()
          : await fetchSubmissions(); // TODO: 실제 fetchSubmissions로 교체

        if (mounted) setSubmissions(data.submissions);
      } catch (e) {
        if (mounted) setError("제출 목록을 불러오는 데 실패했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  // 결과 패널 애니메이션 제어
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (show) {
      setAnimate("open");
    } else {
      setAnimate("close");
    }
  }, [show]);

  const handleSearch = () => {
    if (searchTerm.trim().length === 0) {
      alert("검색어를 입력해 주세요.");
      return;
    }
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleShowResult = (submissionId: number) => {
    searchParams.set("id", String(submissionId));
    searchParams.set("showResult", "true");
    setSearchParams(searchParams, { replace: true });
  };

  const handleDirectSolve = (problemId: number) => {
    if (isLoggedIn) {
      navigate(`/problems/${problemId}/solve`);
    } else {
      alert("로그인 후 이용 가능합니다.");
    }
  };

  // 검색 + 필터 + 정렬
  const filteredAndSorted = React.useMemo(() => {
    const term = searchTerm.trim();

    let list = submissions.filter((s) => {
      // 검색어: 문제 ID 또는 제목
      if (term.length > 0) {
        const asNumber = Number(term);
        const matchId =
          !Number.isNaN(asNumber) && s.problemId === Number(asNumber);
        const matchTitle = s.problemTitle.includes(term);
        if (!matchId && !matchTitle) return false;
      }

      // 상태 필터
      // 상태 필터
      if (filter === "correct") return s.status === "CA";
      if (filter === "wrong") return s.status === "WA";

      if (filter === "pending") {
        return s.status === "PENDING" || s.status === "GRADING";
      }

      if (filter === "error") {
        return (
          s.status === "CE" ||
          s.status === "RE" ||
          s.status === "TLE" ||
          s.status === "MLE"
        );
      }

      return true; // "all"
    });

    // 정렬
    list = [...list].sort((a, b) => {
      switch (sortType) {
        case "latest":
          return (
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime()
          );
        case "runtime_asc":
          return a.runtime - b.runtime;
        case "runtime_desc":
          return b.runtime - a.runtime;
        case "memory_asc":
          return a.memory - b.memory;
        case "memory_desc":
          return b.memory - a.memory;
        case "problemId":
          return a.problemId - b.problemId;
        default:
          return 0;
      }
    });

    return list;
  }, [submissions, searchTerm, filter, sortType]);

  // 페이지네이션
  const totalItems = filteredAndSorted.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentSubmissions = filteredAndSorted.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  return (
    <WholeWrapper>
      <Blankdiv $show={show} $animate={animate}>
        <CodeResult />
      </Blankdiv>

      <ProblemListWrapper>
        <PageTitleContainer>
          <PageTitle>내 제출 기록</PageTitle>
        </PageTitleContainer>

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

          {/* 정렬 */}
          <SortSelect
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="latest">최신 제출순</option>
            <option value="problemId">문제 번호순</option>
            <option value="runtime_asc">실행시간 ↑</option>
            <option value="runtime_desc">실행시간 ↓</option>
            <option value="memory_asc">메모리 ↑</option>
            <option value="memory_desc">메모리 ↓</option>
          </SortSelect>

          {/* 상태 필터 */}
          <SortSelect
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as StatusFilter);
              setCurrentPage(1);
            }}
            style={{ marginRight: "10px" }}
          >
            <option value="all">전체 결과</option>
            <option value="correct">정답만</option>
            <option value="wrong">오답만</option>
            <option value="pending">채점 대기/중</option>
            <option value="error">에러 (CE/RE/TLE/MLE)</option>
          </SortSelect>
        </ControlBar>

        {loading && <p>제출 목록을 불러오는 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <ProblemTable>
          <TableHead>
            <tr>
              <HeaderCell width="8%">번호</HeaderCell>
              <HeaderCell width="28%">문제 제목</HeaderCell>
              <HeaderCell width="10%">언어</HeaderCell>
              <HeaderCell width="12%">메모리</HeaderCell>
              <HeaderCell width="12%">실행시간</HeaderCell>
              <HeaderCell width="22%">제출일</HeaderCell>
              <HeaderCell width="8%">결과</HeaderCell>
            </tr>
          </TableHead>
          <tbody>
            {currentSubmissions.length > 0 ? (
              currentSubmissions.map((submission, idx) => (
                <TableRow key={submission.submissionId}>
                  <TableCell>{indexOfFirstItem + idx + 1}</TableCell>

                  <TitleCell>
                    <ProblemLink
                      to={`/problem-detail/${submission.problemId}`}
                      style={{ cursor: "pointer" }}
                    >
                      [{submission.problemId}] {submission.problemTitle}
                    </ProblemLink>
                  </TitleCell>

                  <TableCell>{submission.language}</TableCell>
                  <TableCell>{submission.memory} KB</TableCell>
                  <TableCell>{submission.runtime} ms</TableCell>
                  <TableCell>{submission.submittedAt}</TableCell>

                  <TableCell style={{ textAlign: "right" }}>
                    <ResultCellInner>
                      <StatusChip $status={submission.status}>
                        {STATUS_LABEL[submission.status]}
                      </StatusChip>

                      <ResultButtons>
                        <SmallResultButton
                          onClick={() =>
                            navigate(`codeView/${submission.submissionId}`)
                          }
                        >
                          코드 보기
                        </SmallResultButton>
                        <SmallResultButton
                          onClick={() =>
                            toggleShowResult(submission.submissionId)
                          }
                        >
                          결과
                        </SmallResultButton>
                        <SmallResultButton
                          onClick={() =>
                            handleDirectSolve(submission.problemId)
                          }
                        >
                          다시 풀기
                        </SmallResultButton>
                      </ResultButtons>
                    </ResultCellInner>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <EmptyCell colSpan={7}>
                  {searchTerm
                    ? "검색된 제출 기록이 없습니다."
                    : "제출 기록이 없습니다."}
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
    </WholeWrapper>
  );
}
