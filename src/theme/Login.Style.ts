import styled from "styled-components";
import { Link } from "react-router-dom";
import { TOPBAR_HEIGHT } from "../components/Topbar";

export const LoginPageWrapper = styled.div`
  margin-top: ${TOPBAR_HEIGHT}px;
  height: 100%;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgColor};
`;
export const LoginBox = styled.div`
  width: 400px;
  padding: 40px;
  background-color: ${(props) => props.theme.headerBgColor};
  border-radius: 5px;
  color: ${(props) => props.theme.textColor};
  border: 2px solid ${(props) => props.theme.focusColor};
  position: relative;
`;

//'로그인'
export const LoginTitle = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  color: ${(props) => props.theme.textColor};
`;
export const InputGroup = styled.div`
  margin-bottom: 15px;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  display: flex;
  align-items: center;
`;
//아이디, 로그인 글씨
export const Label = styled.label`
  flex-shrink: 0;
  margin-right: 15px;
  font-weight: 600;
`;
//텍스트 입력창
export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  /* 입력창 경계선 색상은 텍스트 색상 또는 포커스 색상 활용 */
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
`;
//로그인 유지
export const OptionsGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
`;
export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;
//로그인 버튼
export const MainButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  /* 메인 버튼 색상은 logoColor (#4ade80) 사용 */
  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.authHoverTextColor};
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.focusColor};
  }
`;
//로그인 실패
export const ErrorMessage = styled.p`
  color: #ff3838; /* 오류 메시지는 눈에 띄는 빨간색 */
  font-size: 14px;
  text-align: center;
  margin-bottom: 10px;
`;

//링크들
export const SubLinks = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
`;
//비밀번호 재설정, 회원가입
export const SubLink = styled(Link)`
  margin: 0 10px;
  color: ${(props) => props.theme.textColor};
  text-decoration: none;

  &:hover {
    color: ${(props) => props.theme.focusColor};
    text-decoration: underline;
  }
`;
//소셜링크
export const SocialLoginGroup = styled.div`
  font-weight: bold;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid ${(props) => props.theme.authHoverBgColor};
  text-align: center;
  color: ${(props) => props.theme.textColor};
`;
//소셜버튼
export interface SocialButtonProps {
  platform: "google" | "github"; // platform은 이 두 값 중 하나여야 한다고 명시
}
export const SocialButton = styled.button<SocialButtonProps>`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: none;

  /*소셜 로그인 색상은 플랫폼 고유색*/
  background-color: ${(props) =>
    props.platform === "google" ? "#db4437" : "#333"};
  color: white;
`;

//뒤로가기
export const BackButton = styled.button`
  position: absolute;
  top: 70px;
  left: 30px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;
`;
