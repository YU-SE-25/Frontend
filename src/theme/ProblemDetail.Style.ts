import styled from "styled-components";
import { Link } from "react-router-dom";

const HEADER_H = 50;

// 1. 페이지 전체 레이아웃
export const ProblemWrapper = styled.div`
  height: 100%;
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: ${(props) => props.theme.bgColor};
`;

// 2. 문제 메타 정보 섹션
export const MetaInfoSection = styled.section`
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${(props) => props.theme.authHoverBgColor};
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* 작은 화면에서 줄바꿈 허용 */
  gap: 5px 15px; /* 세로 간격 5px, 가로 간격 15px */
  margin-bottom: 10px;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const MetaLabel = styled.span`
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

export const MetaValue = styled.span`
  color: ${(props) => props.theme.textColor};
  /* Link 스타일을 포함 (작성자 링크용) */
  a {
    color: ${(props) => props.theme.focusColor};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

// 3. 문제 설명 및 예제 섹션
export const DescriptionSection = styled.section`
  margin-bottom: 40px;
  line-height: 1.7; /* 줄 간격 */

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin-top: 30px;
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid ${(props) => props.theme.authHoverBgColor};
  }

  p,
  pre {
    /* 본문과 코드 예제 스타일 */
    font-size: 16px;
    margin-bottom: 15px;
  }

  pre {
    background-color: ${(props) =>
      props.theme.headerBgColor}; /* 코드 블록 배경 */
    padding: 15px;
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.authHoverBgColor};
    white-space: pre-wrap; /* 자동 줄바꿈 */
    word-break: break-all;
  }

  code {
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
  }
`;
export const ExampleSection = styled.div`
  margin-bottom: 20px;
  h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
`;

// 4. 액션 버튼 영역
export const ActionSection = styled.section`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
`;
// 문제 풀기 버튼
export const SolveButton = styled.button`
  padding: 10px 25px;
  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.authHoverTextColor};
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    background-color: ${(props) => props.theme.authHoverBgColor};
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background-color: ${(props) => props.theme.focusColor};
  }
`;
// 내 코드 보기 버튼 (보조 버튼 스타일)
export const ViewCodeButton = styled.button`
  padding: 10px 25px;
  background-color: ${(props) => props.theme.authHoverBgColor};
  color: ${(props) => props.theme.textColor};
  border: 1px solid ${(props) => props.theme.authActiveBgColor};
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.authActiveBgColor};
  }
`;

//태그 영역
export const TagSection = styled.section`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid ${(props) => props.theme.authHoverBgColor};

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 15px;
  }
`;

export const TagLink = styled(Link)`
  display: inline-block;
  background-color: ${(props) => props.theme.authHoverBgColor};
  color: ${(props) => props.theme.textColor};
  padding: 5px 10px;
  border-radius: 15px; /* 타원형 모양 */
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 13px;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.focusColor};
    color: ${(props) => props.theme.bgColor};
  }
`;
