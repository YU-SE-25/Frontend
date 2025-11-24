// src/pages/board/BoardList.tsx
import React, { useState, useMemo, useEffect } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { fetchStudyGroupPosts } from "../../api/studygroupdiscussion_api";
import { fetchBoardList } from "../../api/board_api";

export interface BoardTag {
  id: number; // tag_id
  name: string; // 예: "토론 게시판", "강의", "홍보", "오타"
}
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
  tag: BoardTag; //카테고리
  anonymity: boolean; // 익명 여부
  like_count: number;
  is_private?: boolean;
  comment_count: number;
  create_time: string; // ISO 날짜
  contents: string; // 본문 내용 (상세 보기에서 추가됨)

  comments: BoardComment[]; // 댓글 배열 포함 (상세용)
}

//스터디그룹용
interface BoardListProps {
  mode?: "global" | "study";
  groupId?: number;
}

const CATEGORY_LABEL = {
  daily: "토론 게시판",
  lecture: "강의",
  promotion: "홍보",
  typo: "오타",
} as const;

export type BoardCategory = keyof typeof CATEGORY_LABEL;

// 더미 데이터 임포트
const DUMMY_POSTS_BY_CATEGORY: Record<BoardCategory, BoardContent[]> = {
  daily: BOARD_DUMMY["daily"],
  lecture: BOARD_DUMMY["lecture"],
  promotion: BOARD_DUMMY["promotion"],
  typo: BOARD_DUMMY["typo"],
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

// 기존 함수 선언 → props 형태로 변경됨
export default function BoardList({
  mode = "global",
  groupId,
}: BoardListProps) {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  //params로 받은 category가 유효한지 검사
  const isBoardCategory = (value: string | undefined): value is BoardCategory =>
    !!value && value in CATEGORY_LABEL;

  const currentCategory: BoardCategory = isBoardCategory(category)
    ? category
    : "daily"; // 기본값: 토론 게시판

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<"latest" | "views" | "id">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //기존 posts 제거하고 상태로 관리하도록 변경됨
  const [posts, setPosts] = useState<BoardContent[]>([]);
  //스터디그룹 api 추가
  React.useEffect(() => {
    if (mode === "study" && groupId) {
      //스터디 그룹 API 호출
      fetchStudyGroupPosts(groupId, 1) // page = 1
        .then((res) => {
          //StudyGroupPostSummary[] → BoardContent[] 변환
          const converted: BoardContent[] = res.posts.map((p) => ({
            post_id: p.post_id,
            post_title: p.post_title,
            author: p.author,
            tag: { id: 0, name: "" }, // 스터디그룹에는 태그 개념이 없음
            anonymity: p.anonymity,
            like_count: p.like_count,
            comment_count: p.comment_count,
            create_time: p.create_time,

            //BoardContent에서 필요한데 API 요약에 없는 값들:
            contents: "", // 상세내용은 없음 → 비워두기
            comments: [], // 댓글 목록도 없음 → 빈 배열
          }));
          setPosts(converted);
        })
        .catch((err) => console.error(err));
    } else {
      setPosts(DUMMY_POSTS_BY_CATEGORY[currentCategory]);
    }
  }, [mode, groupId, currentCategory]);

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
    if (mode === "study" && groupId) {
      navigate(`/studygroup/${groupId}/discuss/write`);
      return;
    }
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
        return b.create_time.localeCompare(a.create_time);
      }
      if (sortType === "views") {
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
    <BoardListWrapper $fullWidth={mode === "study"}>
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
        {mode !== "study" && (
          <CategoryTabs>
            {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
              <CategoryTab
                key={key}
                $active={currentCategory === key}
                onClick={() => handleChangeCategory(key as BoardCategory)}
              >
                {label}
              </CategoryTab>
            ))}
          </CategoryTabs>
        )}
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
                  {post.is_private ? (
                    <PostTitle>🔒 비공개 글입니다</PostTitle>
                  ) : (
                    <PostTitle>{post.post_title}</PostTitle>
                  )}
                </TitleCell>
                <TableCell>{post.anonymity ? "익명" : post.author}</TableCell>
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
