import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  SummaryRow,
  SummaryBox,
  TitleContainer,
  ActionInSummaryButton,
  PaginationContainer,
  PageLink,
  DetailsButton,
  ButtonContainer,
  PageTitleContainer,
  AddButton,
  TagDisplayContainer,
  TagChip,
  ProblemTagChip,
  StatusChip,
} from "../../theme/ProblemList.Style";

import type { UserProblemStatus } from "../../theme/ProblemList.Style";
import type { IProblem } from "../../api/problem_api";

import {
  fetchProblems,
  fetchAvailableTags,
  TAG_LABEL_MAP,
} from "../../api/problem_api";

import {
  fetchDummyProblems,
  ALL_AVAILABLE_TAGS,
} from "../../api/dummy/problem_dummy_new";

import { useAtomValue } from "jotai";
import { userProfileAtom } from "../../atoms";

export default function ProblemList() {
  const navigate = useNavigate();

  // ⭐ userProfileAtom 가져오기
  const user = useAtomValue(userProfileAtom);

  // ⭐ 로그인 여부 계산
  const isLoggedIn = !!user;

  // ⭐ 중요한 디버그 로그 (여기에 찍힘!)
  console.log("🔍 USER FROM ATOM:", user);
  console.log("🔍 IS LOGGED IN:", isLoggedIn);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [expandedProblemId, setExpandedProblemId] = useState<number | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filter, setFilter] = useState<
    "off" | "SOLVED" | "ATTEMPTED" | "tried"
  >("off");

  const [problems, setProblems] = useState<IProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialTags = searchParams.get("tag") ? [searchParams.get("tag")!] : [];

  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  // ⭐ 태그 로딩
  useEffect(() => {
    const loadAvailableTags = async () => {
      try {
        const tags = await fetchAvailableTags();
        console.log("🔍 TAG API RESULT:", tags);
        setAvailableTags(Array.isArray(tags) ? tags : []);
      } catch {
        console.warn("태그 API 실패 → 더미 태그 사용");
        setAvailableTags(ALL_AVAILABLE_TAGS);
      }
    };
    loadAvailableTags();
  }, []);

  // ⭐ 문제 목록 로딩
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const real = await fetchProblems();
        if (mounted) {
          console.log("🔍 PROBLEMS FROM API:", real);
          setProblems(real);
        }
      } catch (e) {
        console.warn("API 실패 → 더미 fallback");

        try {
          const dummy = await fetchDummyProblems({
            sortType,
            searchTerm,
            isLoggedIn,
            tags: selectedTags,
          });

          if (mounted) {
            const mapped = dummy.map((d: any) => ({
              ...d,
              successRate: d.successRate + "%",
            }));
            setProblems(mapped);
          }
        } catch (err) {
          if (mounted) setError("문제 목록을 불러올 수 없습니다.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [sortType, searchTerm, selectedTags, isLoggedIn]);

  // 🔥 태그 클릭하면 선택/해제
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      let newTags;

      if (prev.includes(tag)) {
        newTags = prev.filter((t) => t !== tag);
      } else {
        newTags = [...prev, tag];
      }

      // URL 파라미터 싱크
      if (newTags.length > 0) {
        setSearchParams({ tag: newTags[0] });
      } else {
        setSearchParams({});
      }

      setCurrentPage(1);
      return newTags;
    });
  };

  // 검색
  const handleSearch = () => {
    if (searchTerm.trim().length === 0) {
      alert("검색어를 입력해 주세요.");
      return;
    }
    if (searchTerm.trim().length < 2) {
      alert("두 글자 이상 입력해 주세요.");
      return;
    }
    setCurrentPage(1);
  };

  // ⭐ 요약 토글
  const handleToggleSummary = (problemId: number) => {
    setExpandedProblemId((curr) => (curr === problemId ? null : problemId));
  };

  // ⭐ 바로 코드 작성
  const handleDirectSolve = (problemId: number) => {
    if (!isLoggedIn) return alert("로그인 후 이용 가능합니다.");
    navigate(`/problems/${problemId}/solve`);
  };

  const handleViewDetails = (problemId: number) => {
    navigate(`/problem-detail/${problemId}`);
  };

  // ⭐ 기록 필터 로직
  const filteredProblems = problems.filter((problem) => {
    if (filter === "off") return true;

    if (filter === "tried") {
      return (
        problem.userStatus === "SOLVED" || problem.userStatus === "ATTEMPTED"
      );
    }

    if (filter === "SOLVED") return problem.userStatus === "SOLVED";
    if (filter === "ATTEMPTED") return problem.userStatus === "ATTEMPTED";

    return true;
  });

  // ⭐ 페이지네이션
  const totalItems = filteredProblems.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentProblems = filteredProblems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (number: number) => {
    if (number >= 1 && number <= totalPages) setCurrentPage(number);
  };

  return (
    <ProblemListWrapper>
      <PageTitleContainer>
        <PageTitle>문제 목록</PageTitle>

        {(user?.role === "INSTRUCTOR" || user?.role === "MANAGER") && (
          <AddButton onClick={() => navigate("/problem-add")}>
            문제 추가
          </AddButton>
        )}
      </PageTitleContainer>

      <ControlBar>
        {/* 검색 영역 */}
        <SearchContainer>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="문제 ID 또는 제목 검색 (2자 이상)"
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchContainer>

        {/* 정렬 */}
        <SortSelect
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="low_difficulty">난이도 낮은 순</option>
          <option value="high_difficulty">난이도 높은 순</option>
          <option value="views">조회수 순</option>
          <option value="id">문제번호 순</option>
        </SortSelect>

        {isLoggedIn && (
          <SortSelect
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value as "off" | "SOLVED" | "ATTEMPTED" | "tried"
              )
            }
            style={{ marginRight: "10px" }}
          >
            <option value="off">기록 필터</option>
            <option value="tried">전체 시도 문제</option>
            <option value="SOLVED">맞은 문제</option>
            <option value="ATTEMPTED">시도 문제</option>
          </SortSelect>
        )}
      </ControlBar>

      {/* 태그 목록 */}
      {availableTags.length > 0 && (
        <TagDisplayContainer
          style={{ maxWidth: "1200px", margin: "10px auto" }}
        >
          {availableTags.map((tag) => (
            <TagChip
              key={tag}
              $active={selectedTags.includes(tag)}
              onClick={() => handleToggleTag(tag)}
            >
              {TAG_LABEL_MAP[tag] ?? tag}
            </TagChip>
          ))}
        </TagDisplayContainer>
      )}

      {/* 로딩 & 에러 */}
      {loading && <p>문제 목록을 불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 문제 테이블 */}
      <ProblemTable>
        <TableHead>
          <tr>
            <HeaderCell width="8%">번호</HeaderCell>
            <HeaderCell width="30%">문제 제목</HeaderCell>
            <HeaderCell width="25%">태그</HeaderCell>
            <HeaderCell width="10%">난이도</HeaderCell>
            <HeaderCell width="13%">조회수</HeaderCell>
            <HeaderCell width="14%">등록일</HeaderCell>
            {isLoggedIn && <HeaderCell width="10%">기록</HeaderCell>}
          </tr>
        </TableHead>

        <tbody>
          {currentProblems.length > 0 ? (
            currentProblems.map((problem) => (
              <React.Fragment key={problem.problemId}>
                <TableRow $userStatus={problem.userStatus as UserProblemStatus}>
                  <TableCell>{problem.problemId}</TableCell>

                  <TitleCell>
                    <TitleContainer>
                      <span
                        style={{ cursor: "pointer", fontWeight: 600 }}
                        onClick={() => handleToggleSummary(problem.problemId)}
                      >
                        {problem.title}
                      </span>
                    </TitleContainer>
                  </TitleCell>

                  {isLoggedIn && (
                    <TableCell>
                      {problem.userStatus !== "NONE" && (
                        <StatusChip $status={problem.userStatus}>
                          {problem.userStatus === "SOLVED" ? "맞음" : "시도"}
                        </StatusChip>
                      )}
                    </TableCell>
                  )}

                  <TableCell>{problem.difficulty}</TableCell>
                  <TableCell>{problem.viewCount}</TableCell>
                  <TableCell>{problem.createdAt}</TableCell>
                  {isLoggedIn && (
                    <TableCell>
                      <ProblemTagChip $status={problem.userStatus}>
                        {problem.userStatus === "SOLVED"
                          ? "맞음"
                          : problem.userStatus === "ATTEMPTED"
                          ? "시도"
                          : " "}
                      </ProblemTagChip>
                    </TableCell>
                  )}
                </TableRow>

                {expandedProblemId === problem.problemId && (
                  <SummaryRow>
                    <TableCell colSpan={isLoggedIn ? 8 : 7}>
                      <SummaryBox>
                        <div>
                          <p>
                            <strong>요약:</strong> {problem.summary}
                          </p>
                          <p>
                            <strong>푼 사람:</strong> {problem.solvedCount} |
                            <strong> 정답률:</strong> {problem.successRate}
                          </p>
                        </div>

                        <ButtonContainer>
                          <DetailsButton
                            onClick={() => handleViewDetails(problem.problemId)}
                          >
                            상세보기
                          </DetailsButton>

                          {isLoggedIn && (
                            <ActionInSummaryButton
                              onClick={() =>
                                handleDirectSolve(problem.problemId)
                              }
                            >
                              바로 코드 작성
                            </ActionInSummaryButton>
                          )}
                        </ButtonContainer>
                      </SummaryBox>
                    </TableCell>
                  </SummaryRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <EmptyCell colSpan={7}>문제가 없습니다.</EmptyCell>
            </TableRow>
          )}
        </tbody>
      </ProblemTable>

      {/* 페이지네이션 */}
      <PaginationContainer>
        <PageLink
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
        >
          &lt; 이전
        </PageLink>

        {Array.from({ length: totalPages }, (_, idx) => (
          <PageLink
            key={idx}
            onClick={() => handlePageChange(idx + 1)}
            isActive={currentPage === idx + 1}
          >
            {idx + 1}
          </PageLink>
        ))}

        <PageLink
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
        >
          다음 &gt;
        </PageLink>
      </PaginationContainer>
    </ProblemListWrapper>
  );
}
