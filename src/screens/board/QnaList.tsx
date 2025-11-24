// src/pages/board/BoardList.tsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
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
import BoardDetail from "./QnaDetail";
import { QNA_DUMMY } from "../../api/dummy/qna_dummy";
import { useQuery } from "@tanstack/react-query";
import type { BoardContent } from "./BoardList";

export interface BoardTag {
  id: number;
  name: string;
}
// 댓글(Comment)
export interface QnaComment {
  id: number; // 댓글 ID (API 제공 or 클라이언트 생성)
  author: string; // 작성자
  contents: string; // 댓글 내용
  anonymity: boolean; // 익명 여부
  create_time: string; // ISO 날짜
}

// 게시글(Post)
export interface QnaContent extends Omit<BoardContent, "tag" | "comments"> {
  problem_id: number;
  comments: QnaComment[];
}

const PostTitle = styled.span`
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
`;

// 기존 함수 선언 → props 형태로 변경됨
export default function QnaList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<"latest" | "id">("id");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //기존 posts 제거하고 상태로 관리하도록 변경됨
  const [posts, setPosts] = useState<QnaContent[]>([]);

  // URL의 ?no=값을 읽어서 선택된 글 ID로 사용
  const selectedPostId = searchParams.get("no");
  const problemId = searchParams.get("id");
  useEffect(() => {
    setPosts(QNA_DUMMY);
  }, []);
  const selectedPost = useMemo(() => {
    if (!selectedPostId) return null;
    const idNum = Number(selectedPostId);
    if (Number.isNaN(idNum)) return null;
    return posts.find((p) => p.post_id === idNum) ?? null;
  }, [selectedPostId, posts]);

  //함수 선언

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

  // 게시글 필터링 및 정렬
  const filteredAndSortedPosts = useMemo(() => {
    let result = posts;

    const keyword = searchTerm.trim();

    // 🔎 검색어가 있으면 제목 + 문제 번호 검색
    if (keyword.length > 0) {
      const lower = keyword.toLowerCase();

      result = result.filter((post) => {
        const titleMatch = post.post_title.toLowerCase().includes(lower);

        const problemMatch = post.problem_id?.toString().includes(lower);

        return titleMatch || problemMatch;
      });
    }

    // 🔽 정렬
    result = [...result].sort((a, b) => {
      if (sortType === "latest") {
        return b.create_time.localeCompare(a.create_time);
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
  const handleWritePost = () => {
    navigate(`/qna/write`);
  };

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
          <PageTitle>Q&A 게시판</PageTitle>
          <AddButton onClick={handleWritePost}>질문 쓰기</AddButton>
        </div>
      </PageTitleContainer>
      {selectedPost && <BoardDetail post={selectedPost} />}

      <ControlBar>
        <SearchContainer>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목 검색"
          />
          <SearchButton>검색</SearchButton>
        </SearchContainer>

        <SortSelect
          value={sortType}
          onChange={(e) => setSortType(e.target.value as "latest" | "id")}
        >
          <option value="latest">최신순</option>
          <option value="id">번호순</option>
        </SortSelect>
      </ControlBar>

      <BoardTable>
        <TableHead>
          <tr>
            <HeaderCell width="8%">게시글</HeaderCell>
            <HeaderCell width="12%">문제번호</HeaderCell>
            <HeaderCell width="50%">제목</HeaderCell>
            <HeaderCell width="10%">작성자</HeaderCell>
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
                <TableCell>#{post.problem_id}</TableCell>
                <TitleCell>
                  {post.is_private ? (
                    <PostTitle>🔒 비공개 질문입니다</PostTitle>
                  ) : (
                    <PostTitle>{post.post_title}</PostTitle>
                  )}
                </TitleCell>
                <TableCell>{post.anonymity ? "익명" : post.author}</TableCell>
                {/* 조회수 컬럼은 현재 like_count로 대체 */}
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
