import styled from "styled-components";
import { Link } from "react-router-dom";

//Type Definitions (TypeScript)
export interface StatusProps {
  $userStatus: UserProblemStatus; // 'solved' | 'attempted' | 'none'
}
// HeaderCell 너비 prop 타입
export interface HeaderCellProps {
  width: string;
}
// 푼 문제 상태 타입
export type UserProblemStatus = "solved" | "attempted" | "none";
export interface StatusProps {
  userStatus: UserProblemStatus;
}

//레이아웃 및 컨트롤 스타일
export const ProblemListWrapper = styled.div`
  height: 100%;
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: ${(props) => props.theme.bgColor};
`;
export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  color: ${(props) => props.theme.textColor};
`;
export const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 3px;
`;
export const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
`;
export const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  width: 300px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
`;
export const SearchButton = styled.button`
  padding: 8px 15px;
  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.authHoverTextColor};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
`;
export const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
`;

//문제 목록 테이블 스타일
export const ProblemTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  background-color: ${(props) => props.theme.headerBgColor};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
`;
export const TableHead = styled.thead`
  background-color: ${(props) => props.theme.logoColor};
`;
export const HeaderCell = styled.th<HeaderCellProps>`
  width: ${(props) => props.width};
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;
export const TableRow = styled.tr<StatusProps>`
  border-bottom: 1px solid ${(props) => props.theme.authHoverBgColor};
`;
export const TableCell = styled.td`
  padding: 15px;
  color: ${(props) => props.theme.textColor};
  font-size: 14px;
  vertical-align: middle;
`;
export const EmptyCell = styled(TableCell)`
  text-align: center;
  padding: 40px;
  color: ${(props) => props.theme.authHoverBgColor};
  font-style: italic;
`;

//제목 셀, 링크, 아코디언 스타일
export const ProblemLink = styled(Link)`
  color: ${(props) => props.theme.textColor};
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  /* 제목 텍스트가 너무 길 경우 처리 (선택 사항) */
  /* white-space: nowrap; */
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */

  &:hover {
    text-decoration: underline;
    color: ${(props) => props.theme.focusColor};
  }
`;
export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

// 푼 문제 표시 점 스타일 (초록/빨강)
export const StatusIndicator = styled.span<StatusProps>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${
    (props) =>
      props.$userStatus === "solved"
        ? props.theme.logoColor /* 초록 */
        : props.$userStatus === "attempted"
        ? "#ff3838" /* 빨강 */
        : "transparent" /* 안 푼 문제 */
  };
  flex-shrink: 0;
`;
export const TitleCell = styled(TableCell)`
  /* TitleCell 고유 스타일이 있다면 여기에 추가 */
`;

// 아코디언 펼치기 버튼
export const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  padding: 5px;
  line-height: 1;
  margin-left: auto;

  &:hover {
    color: ${(props) => props.theme.focusColor};
  }
`;
// 아코디언 내용 행
export const SummaryRow = styled.tr`
  background-color: ${(props) =>
    props.theme.bgColor}; /* 기본 행과 구분되는 배경 */
  border-bottom: 1px solid ${(props) => props.theme.authHoverBgColor};
`;
// 아코디언 내용 박스
export const SummaryBox = styled.div`
  padding: 15px 20px;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  line-height: 1.6;
  text-align: left;

  /* 내부 요소들을 좌우로 분리 */
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* 상단 정렬 */

  p {
    margin-bottom: 8px;
  }
`;
//코드 바로 작성 버튼
export const ActionInSummaryButton = styled.button`
  padding: 6px 12px; /* SearchButton보다 살짝 작게 */
  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.authHoverTextColor};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  transition: background-color 0.2s;
  white-space: nowrap; /* 버튼 글자 줄바꿈 방지 */

  &:hover {
    background-color: ${(props) => props.theme.focusColor};
  }
`;

//페이지네이션
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px; /* 버튼 사이 간격 */
  margin-top: 30px; /* 테이블과의 간격 */
`;

export const PageLink = styled.span<{
  isActive?: boolean;
  isDisabled?: boolean;
}>`
  /* 기본 텍스트 스타일 */
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  cursor: pointer;
  padding: 5px; /* 클릭 영역 확보 */
  text-decoration: none;
  transition: color 0.2s;

  /* 현재 페이지 강조 (굵게) */
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
  color: ${(props) =>
    props.isActive ? props.theme.focusColor : props.theme.textColor};

  /* 비활성화 상태 (클릭 불가, 흐리게) */
  ${(props) =>
    props.isDisabled &&
    `
    color: ${props.theme.authHoverBgColor}; /* 흐린 색상 */
    cursor: not-allowed;
    pointer-events: none; /* 클릭 이벤트 자체를 막음 */
  `}

  /* 호버 효과 (비활성화 아닐 때만) */
  &:not([aria-disabled="true"]):hover {
    color: ${(props) => props.theme.focusColor};
    text-decoration: underline;
  }
`;
