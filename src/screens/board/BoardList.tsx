// src/pages/board/BoardList.tsx
import React, { useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { BOARD_DUMMY } from "../../api/dummy/board_dummy";
import {
  ProblemListWrapper as BoardListWrapper,
  PageTitle,
  ControlBar,
  SearchContainer,
  SearchInput,
  SearchButton,
  SortSelect,
  ProblemTable as BoardTable,
  TableHead,
  HeaderCell,
  TableRow,
  TableCell,
  EmptyCell,
  TitleCell,
  PaginationContainer,
  PageLink,
  PageTitleContainer,
  AddButton,
} from "../../theme/ProblemList.Style";
import BoardDetail from "./BoardDetail";

type BoardCategory = "free" | "discussion" | "qna";
// 댓글(Comment)
export interface BoardComment {
  id: number; // 댓글 ID (API 제공 or 클라이언트 생성)
  author: string; // 작성자
  contents: string; // 댓글 내용
  anonymity: boolean; // 익명 여부
  create_time: string; // ISO 날짜
}

// 게시글(Post)
export interface BoardContent {
  post_id: number;
  post_title: string;
  author: string;
  tag?: string; // 선택적
  anonymity: boolean; // 익명 여부
  like_count: number;
  comment_count: number;
  create_time: string; // ISO 날짜
  contents: string; // 본문 내용 (상세 보기에서 추가됨)

  comments: BoardComment[]; // 댓글 배열 포함 (상세용)
}

const CATEGORY_LABEL: Record<BoardCategory, string> = {
  free: "자유게시판",
  discussion: "토론게시판",
  qna: "Q&A 게시판",
};
// 더미 데이터 임포트
const DUMMY_POSTS_BY_CATEGORY: Record<BoardCategory, BoardContent[]> = {
  free: BOARD_DUMMY["free"],
  discussion: BOARD_DUMMY["discussion"],
  qna: BOARD_DUMMY["qna"],
};

const CategoryTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;
const PostTitle = styled.span`
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
`;

const CategoryTab = styled.button<{ $active?: boolean }>`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.focusColor : "rgba(0,0,0,0.12)")};
  background: ${({ theme, $active }) =>
    $active ? theme.focusColor : "transparent"};
  color: ${({ theme, $active }) => ($active ? "white" : theme.textColor)};
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease,
    transform 0.1s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

export default function BoardList() {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory: BoardCategory =
    category === "discussion" || category === "free" ? category : "qna";

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<"latest" | "views" | "id">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const posts = DUMMY_POSTS_BY_CATEGORY[currentCategory];

  // URL의 ?no=값을 읽어서 선택된 글 ID로 사용
  const selectedPostId = searchParams.get("no");

  const selectedPost = useMemo(() => {
    if (!selectedPostId) return null;
    const idNum = Number(selectedPostId);
    if (Number.isNaN(idNum)) return null;
    return posts.find((p) => p.post_id === idNum) ?? null;
  }, [selectedPostId, posts]);

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

  const handleViewDetails = (postId: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("no", String(postId)); // 무조건 열기만 함 (닫기 없음)
        return next;
      },
      { replace: true }
    );
    window.scrollTo(0, 0);
  };

  const handleWritePost = () => {
    navigate(`/board/${currentCategory}/write`);
  };

  const handleChangeCategory = (next: BoardCategory) => {
    setSearchTerm("");
    setCurrentPage(1);
    navigate(`/board/${next}`);
  };

  const filteredAndSortedPosts = useMemo(() => {
    let result = posts;

    const keyword = searchTerm.trim();
    if (keyword.length >= 2) {
      result = result.filter((post) =>
        post.post_title.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    result = [...result].sort((a, b) => {
      if (sortType === "latest") {
        // 작성일(create_time) 기준 최신순
        return b.create_time.localeCompare(a.create_time);
      }
      if (sortType === "views") {
        // 조회수 필드는 없으니 일단 like_count 기준으로 정렬
        return (b.like_count ?? 0) - (a.like_count ?? 0);
      }
      if (sortType === "id") {
        return a.post_id - b.post_id;
      }
      return 0;
    });

    return result;
  }, [posts, searchTerm, sortType]);

  const totalItems = filteredAndSortedPosts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  return (
    <BoardListWrapper>
      <PageTitleContainer
        style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <PageTitle>{CATEGORY_LABEL[currentCategory]}</PageTitle>
          <AddButton onClick={handleWritePost}>글 쓰기</AddButton>
        </div>
        <CategoryTabs>
          {/* <CategoryTab
            $active={currentCategory === "free"}
            onClick={() => handleChangeCategory("free")}
          >
            자유게시판
          </CategoryTab> */}
          <CategoryTab
            $active={currentCategory === "discussion"}
            onClick={() => handleChangeCategory("discussion")}
          >
            토론게시판
          </CategoryTab>
          <CategoryTab
            $active={currentCategory === "qna"}
            onClick={() => handleChangeCategory("qna")}
          >
            Q&A 게시판
          </CategoryTab>
        </CategoryTabs>
      </PageTitleContainer>
      {selectedPost && <BoardDetail post={selectedPost} />}

      <ControlBar>
        <SearchContainer>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목 검색 (2자 이상)"
            onKeyPress={handleKeyPress}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchContainer>

        <SortSelect
          value={sortType}
          onChange={(e) =>
            setSortType(e.target.value as "latest" | "views" | "id")
          }
        >
          <option value="latest">최신순</option>
          <option value="views">조회순</option>
          <option value="id">번호순</option>
        </SortSelect>
      </ControlBar>

      <BoardTable>
        <TableHead>
          <tr>
            <HeaderCell width="8%">번호</HeaderCell>
            <HeaderCell width="50%">제목</HeaderCell>
            <HeaderCell width="12%">작성자</HeaderCell>
            <HeaderCell width="10%">조회수</HeaderCell>
            <HeaderCell width="15%">작성일</HeaderCell>
          </tr>
        </TableHead>

        <tbody>
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <TableRow
                key={post.post_id}
                onClick={() => handleViewDetails(post.post_id)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{post.post_id}</TableCell>
                <TitleCell>
                  <PostTitle>{post.post_title}</PostTitle>
                </TitleCell>
                <TableCell>{post.author}</TableCell>
                {/* 조회수 컬럼은 현재 like_count로 대체 */}
                <TableCell>{post.like_count}</TableCell>
                {/* 작성일은 ISO 문자열에서 날짜만 잘라서 사용 */}
                <TableCell>{post.create_time.slice(0, 10)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <EmptyCell colSpan={5}>
                {searchTerm
                  ? "검색된 게시글이 없습니다."
                  : "게시글이 없습니다."}
              </EmptyCell>
            </TableRow>
          )}
        </tbody>
      </BoardTable>

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
    </BoardListWrapper>
  );
}
