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
  SummaryRow,
  SummaryBox,
  TitleContainer,
  StatusIndicator,
  ActionInSummaryButton,
  PaginationContainer,
  PageLink,
  DetailsButton,
  ButtonContainer,
  PageTitleContainer,
  TagDisplayContainer,
  TagChip,
  ProblemTagChip,
} from "../../theme/ProblemList.Style";
import { TOPBAR_HEIGHT } from "../../components/Topbar";
import type { UserProblemStatus } from "../../theme/ProblemList.Style";
import type { IProblem } from "../../api/problem_api";
import { fetchProblems, fetchAvailableTags } from "../../api/problem_api";
import { fetchDummyProblems } from "../../api/dummy/problem_dummy";
import CodeResult from "./SolveResult";
import styled, { css, keyframes } from "styled-components";

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
    // 첫 렌더 등, 아무 애니메이션도 안 걸고 싶은 순간
    return "none";
  }};
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

export default function MySolvedProblemList() {
  const navigate = useNavigate();
  //문제 상세 -> 테그 연동
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("latest");
  const selectedProblemId = searchParams.get("id")
    ? Number(searchParams.get("id"))
    : null;
  const showresult = searchParams.get("showResult") === "true";
  const isExpanded = searchParams.get("expand") === "true";

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const show = selectedProblemId !== null && showresult;
  const [animate, setAnimate] = useState<"none" | "open" | "close">("none");
  const firstRenderRef = React.useRef(true);

  const [filter, setFilter] = useState<
    "off" | "solved" | "attempted" | "tried"
  >("off");

  const [problems, setProblems] = useState<IProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = true;

  // 'tag' 파라미터가 있으면 그 값을 배열로 초기화, 없으면 빈 배열로 초기화
  const initialTags = searchParams.get("tag") ? [searchParams.get("tag")!] : []; // !는 값이 반드시 있음을 타입스크립트에 알림

  //AVAILABLE TAGS 상태 정의 (API로 불러올 태그 전체 목록)
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  // SELECTED TAGS 상태 정의 (사용자가 클릭해서 선택한 필터 태그)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  //사용 가능한 태그 목록 불러오기 (컴포넌트 마운트 시 1회)
  useEffect(() => {
    const loadAvailableTags = async () => {
      try {
        const tags = await fetchAvailableTags(); //API 호출
        setAvailableTags(tags);
      } catch (e) {
        console.error("사용 가능한 태그 목록을 불러오는 데 실패했습니다.", e);
      }
    };
    loadAvailableTags();
  }, []); //마운트 시 1회 실행

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
          tags: selectedTags.length > 0 ? selectedTags : undefined, //selectedTags를 API 인자로 전달
        });
        if (mounted) setProblems(data || []);
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
  }, [sortType, isLoggedIn, searchTerm, selectedTags]);

  useEffect(() => {
    // 첫 렌더에서는 애니메이션 안 건다
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    // show 값이 변할 때만 애니메이션 방향 설정
    if (show) {
      setAnimate("open");
    } else {
      setAnimate("close");
    }
  }, [show]);
  //태그 칩 클릭 핸들러
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prevTags) => {
      let newTags;
      //필터 해제
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        newTags = [...prevTags, tag];
      }
      //필터 적용
      if (newTags.length > 0) {
        // 여러 태그 필터링을 지원한다면, 쿼리 파라미터 처리가 더 복잡해질 수 있습니다.
        // 여기서는 단순하게 첫 번째 태그만 쿼리로 유지하거나, 아니면 복수 쿼리 파라미터를 사용해야 합니다.
        // 간단하게, 첫 번째 태그만 쿼리에 반영하거나, 태그를 제거합니다. (현재 문제 상세에서 1개만 전달하므로, 1개만 고려)
        const newTagQuery = newTags[0];
        setSearchParams({ tag: newTagQuery }, { replace: true });
      } else {
        // 태그가 없으면 쿼리 파라미터에서 제거
        setSearchParams({}, { replace: true });
      }

      // 태그 필터가 바뀌면 1페이지로 돌아가게 설정
      setCurrentPage(1);
      return newTags;
    });
  };

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
  //id 파라미터 추가/업데이트 함수
  const handleAddIdParams = (problemId: number) => {
    // 새로 열기 → id=problemId 추가/업데이트
    searchParams.set("id", String(problemId));
    setSearchParams(searchParams, { replace: true });
  };
  // expand 파라미터 토글 함수
  const handleToggleExpand = (problemId: number) => {
    searchParams.set(
      "expand",
      isExpanded && problemId === selectedProblemId ? "false" : "true"
    );
    setSearchParams(searchParams);
  };
  const toggleShowResult = () => {
    const showResult = searchParams.get("showResult");
    searchParams.set("showResult", showResult === "true" ? "false" : "true");
    setSearchParams(searchParams);
  };

  const handleDirectSolve = (problemId: number) => {
    if (isLoggedIn) {
      navigate(`/problems/${problemId}/solve`);
    } else {
      alert("로그인 후 이용 가능합니다.");
    }
  };

  const handleViewDetails = (problemId: number) => {
    console.log("view details", problemId); //debug
    navigate(`/problem-detail/${problemId}`);
  };

  const filteredProblems = problems.filter((problem) => {
    if (filter === "off") return true;
    if (filter === "tried")
      return (
        problem.userStatus === "solved" || problem.userStatus === "attempted"
      );

    if (filter === "solved") {
      return problem.userStatus === "solved";
    }
    if (filter === "attempted") {
      return problem.userStatus === "attempted";
    }
    return true;
  });
  // 페이지네이션 계산을 필터링된 목록 기준으로 변경
  const totalItems = filteredProblems.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentProblems = filteredProblems.slice(
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
          <PageTitle>내가 푼 문제</PageTitle>
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

          {/*기록 필터링 Select */}
          <SortSelect
            value={filter}
            onChange={(e) => {
              setFilter(
                e.target.value as "off" | "solved" | "attempted" | "tried"
              );
              setCurrentPage(1);
            }}
            style={{ marginRight: "10px" }}
          >
            <option value="off">문제 필터</option>
            <option value="tried">시도 문제</option>
            <option value="solved">맞은 문제</option>
            <option value="attempted">틀린 문제</option>
          </SortSelect>
        </ControlBar>

        {availableTags.length > 0 && (
          <TagDisplayContainer
            style={{
              maxWidth: "1200px",
              margin: "15px auto",
              padding: "0 20px",
              flexWrap: "wrap",
            }}
          >
            {availableTags.map((tag) => (
              <TagChip
                key={tag}
                // 선택된 태그 배열에 현재 태그가 포함되어 있으면 'active' 스타일 적용
                $active={selectedTags.includes(tag)}
                onClick={() => handleToggleTag(tag)} //클릭 핸들러 바인딩
              >
                {tag}
              </TagChip>
            ))}
          </TagDisplayContainer>
        )}

        {loading && <p>문제 목록을 불러오는 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <ProblemTable>
          <TableHead>
            <tr>
              <HeaderCell width="8%">번호</HeaderCell>
              <HeaderCell width="30%">문제 제목</HeaderCell>
              <HeaderCell width="25%">태그</HeaderCell>
              <HeaderCell width="10%">난이도</HeaderCell>
              <HeaderCell width="13%">조회수</HeaderCell>
              <HeaderCell width="19%">등록일</HeaderCell>
              <HeaderCell width="5%">기록</HeaderCell>
            </tr>
          </TableHead>
          <tbody>
            {currentProblems.length > 0 ? (
              currentProblems.map((problem) => (
                <React.Fragment key={problem.id}>
                  <TableRow
                    $userStatus={problem.userStatus as UserProblemStatus}
                  >
                    <TableCell>{problem.id}</TableCell>
                    <TitleCell>
                      <TitleContainer>
                        <ProblemLink
                          to={`/problem-detail/${problem.id}`}
                          as="span"
                          onClick={() => {
                            handleToggleExpand(problem.id);
                            handleAddIdParams(problem.id);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {problem.title}
                        </ProblemLink>
                      </TitleContainer>
                    </TitleCell>

                    <TableCell>
                      <TagDisplayContainer>
                        {problem.tags?.map((tag, idx) => (
                          <ProblemTagChip key={idx}>{tag}</ProblemTagChip>
                        ))}
                      </TagDisplayContainer>
                    </TableCell>
                    <TableCell>{problem.difficulty}</TableCell>
                    <TableCell>{problem.views}</TableCell>
                    <TableCell>{problem.uploadDate}</TableCell>

                    <TableCell style={{ textAlign: "center" }}>
                      {problem.userStatus !== "none" && (
                        <StatusIndicator
                          style={{ cursor: "pointer" }}
                          $userStatus={problem.userStatus}
                          onClick={() => {
                            searchParams.set("showResult", "true");
                            handleAddIdParams(problem.id);
                          }}
                        >
                          {problem.userStatus === "solved" ? "맞춤" : "시도"}
                        </StatusIndicator>
                      )}
                    </TableCell>
                  </TableRow>

                  {selectedProblemId === problem.id && isExpanded && (
                    <SummaryRow>
                      <TableCell colSpan={7}>
                        <SummaryBox>
                          <div>
                            <p>
                              <strong>요약:</strong> {problem.summary}
                            </p>
                            <p>
                              <strong>푼 사람:</strong> {problem.solvedCount} |
                              <strong>정답률:</strong> {problem.successRate}
                            </p>
                          </div>
                          <ButtonContainer>
                            <DetailsButton onClick={() => toggleShowResult()}>
                              채점 결과
                            </DetailsButton>
                            <DetailsButton
                              onClick={() => handleViewDetails(problem.id)}
                            >
                              문제보기
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
                <EmptyCell colSpan={7}>
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
    </WholeWrapper>
  );
}
