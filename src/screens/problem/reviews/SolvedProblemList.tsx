import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ProblemWrapper,
  MainContent,
  MetaInfoSection,
  MetaRow,
  MetaLabel,
  MetaValue,
  DescriptionSection,
  SectionHeader,
  InlineTagList,
  TagLink,
} from "../../../theme/ProblemDetail.Style";

import {
  ProblemListWrapper,
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
  PaginationContainer,
  PageLink,
  ButtonContainer,
} from "../../../theme/ProblemList.Style";

import type { IProblem, ProblemDetailDto } from "../../../api/problem_api";
import { fetchProblemDetail } from "../../../api/problem_api";
import {
  fetchDummyProblemDetail,
  increaseDummyView,
} from "../../../api/dummy/problem_dummy_new";

import {
  fetchSharedSolvedList,
  type MySolvedCodeResponse,
} from "../../../api/solution_api";

import { useAtomValue } from "jotai";
import { userProfileAtom } from "../../../atoms";
import styled from "styled-components";

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

const DetailsButton = styled.button`
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.logoColor ?? theme.textColor + "40"};
  background: transparent;
  color: ${({ theme }) => theme.textColor};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  line-height: 1;

  &:hover {
    background: ${({ theme }) => theme.logoColor ?? theme.textColor + "20"};
  }

  &:active {
    transform: translateY(1px);
    opacity: 0.9;
  }
`;

export default function SolvedProblemListPage() {
  const navigate = useNavigate();
  const { problemId } = useParams<{ problemId: string }>();

  const user = useAtomValue(userProfileAtom);
  const isLoggedIn = !!user;

  const [problem, setProblem] = useState<IProblem | null>(null);
  const [loadingProblem, setLoadingProblem] = useState(true);

  const [solutions, setSolutions] = useState<MySolvedCodeResponse[]>([]);
  const [loadingSolutions, setLoadingSolutions] = useState(true);
  const [solutionsError, setSolutionsError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<"latest" | "memory" | "time">(
    "latest"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!problemId) return;

    let mounted = true;

    const load = async () => {
      setLoadingProblem(true);
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
        if (mounted) setLoadingProblem(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [problemId]);

  // ✅ 공유된 풀이 목록 API 연동
  useEffect(() => {
    if (!problemId) return;

    let mounted = true;

    const load = async () => {
      setLoadingSolutions(true);
      setSolutionsError(null);
      try {
        const data = await fetchSharedSolvedList(Number(problemId));
        if (mounted) setSolutions(data);
      } catch {
        if (mounted)
          setSolutionsError("공유된 풀이 목록을 불러올 수 없습니다.");
      } finally {
        if (mounted) setLoadingSolutions(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [problemId]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const filteredSolutions = solutions
    .filter((s) => {
      const keyword = searchTerm.trim().toLowerCase();
      if (!keyword) return true;
      return s.language.toLowerCase().includes(keyword);
    })
    .sort((a, b) => {
      if (sortType === "latest") {
        return b.createdAt.localeCompare(a.createdAt);
      }
      if (sortType === "memory") {
        return a.memoryUsage - b.memoryUsage;
      }
      if (sortType === "time") {
        return a.executionTime - b.executionTime;
      }
      return 0;
    });

  const totalItems = filteredSolutions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSolutions = filteredSolutions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleViewSolutionDetail = (solutionId: number) => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    navigate(`${solutionId}`);
  };

  if (loadingProblem) return <ProblemWrapper>로딩 중...</ProblemWrapper>;
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
            <MetaValue>{problem.author}</MetaValue>
          </MetaRow>

          <MetaRow>
            <MetaLabel>푼 사람:</MetaLabel>
            <MetaValue>{problem.solvedCount}</MetaValue>

            <MetaLabel>정답률:</MetaLabel>
            <MetaValue>{problem.successRate}</MetaValue>
          </MetaRow>

          {problem.tags && problem.tags.length > 0 && (
            <MetaRow>
              <MetaLabel>태그:</MetaLabel>
              <MetaValue>
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
              </MetaValue>
            </MetaRow>
          )}
        </MetaInfoSection>

        <DescriptionSection>
          <SectionHeader>
            <h3>공유된 풀이 목록</h3>
          </SectionHeader>

          <ProblemListWrapper>
            <ControlBar>
              <SearchContainer>
                <SearchInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="언어로 검색"
                  onKeyPress={handleKeyPress}
                />
                <SearchButton onClick={handleSearch}>검색</SearchButton>
              </SearchContainer>

              <SortSelect
                value={sortType}
                onChange={(e) =>
                  setSortType(e.target.value as "latest" | "memory" | "time")
                }
              >
                <option value="latest">최신순</option>
                <option value="memory">메모리 적은순</option>
                <option value="time">실행시간 빠른순</option>
              </SortSelect>
            </ControlBar>

            {loadingSolutions && <p>공유된 풀이를 불러오는 중...</p>}
            {solutionsError && <p style={{ color: "red" }}>{solutionsError}</p>}

            <ProblemTable>
              <TableHead>
                <tr>
                  <HeaderCell width="10%">번호</HeaderCell>
                  <HeaderCell width="20%">언어</HeaderCell>
                  <HeaderCell width="20%">메모리</HeaderCell>
                  <HeaderCell width="20%">실행시간</HeaderCell>
                  <HeaderCell width="20%">작성일</HeaderCell>
                  <HeaderCell width="10%">보기</HeaderCell>
                </tr>
              </TableHead>

              <tbody>
                {currentSolutions.length > 0 ? (
                  currentSolutions.map((s, idx) => (
                    <TableRow key={s.solutionId}>
                      <TableCell>{indexOfFirstItem + idx + 1}</TableCell>
                      <TableCell>{s.language}</TableCell>
                      <TableCell>{s.memoryUsage} MB</TableCell>
                      <TableCell>{s.executionTime} ms</TableCell>
                      <TableCell>{s.createdAt}</TableCell>
                      <TableCell>
                        <ButtonContainer>
                          <DetailsButton
                            onClick={() =>
                              handleViewSolutionDetail(s.solutionId)
                            }
                          >
                            코드 보기
                          </DetailsButton>
                        </ButtonContainer>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <EmptyCell colSpan={6}>
                      공유된 풀이가 아직 없습니다.
                    </EmptyCell>
                  </TableRow>
                )}
              </tbody>
            </ProblemTable>

            <PaginationContainer>
              <PageLink
                onClick={() => handlePageChange(currentPage - 1)}
                isDisabled={currentPage === 1}
              >
                &lt; 이전
              </PageLink>

              {Array.from({ length: totalPages }, (_, index) => (
                <PageLink
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
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
        </DescriptionSection>
      </MainContent>
    </ProblemWrapper>
  );
}
