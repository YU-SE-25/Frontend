import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";

type TopbarProps = { isLoggedIn?: boolean };
const HEADER_H = 50;

const TopbarContainer = styled.header`
  height: ${HEADER_H}px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: ${(props) => props.theme.headerBgColor};
  color: ${(props) => props.theme.textColor};
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const TopbarContent = styled.nav`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: 800;
  color: inherit;
  text-decoration: none;
  outline: none;
  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.focusColor};
    outline-offset: 2px;
  }
`;

const Menu = styled.ul`
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuLink = styled(NavLink)`
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  text-decoration: none;
  outline: none;
  &:hover {
    color: ${(props) => props.theme.focusColor};
  }
  &.active {
    text-decoration: underline;
  }
  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.focusColor};
    outline-offset: 2px;
  }
`;

const Auth = styled.div`
  display: flex;
  gap: 12px;
`;

const AuthLink = styled(Link)`
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 10px;
  outline: none;
  &:hover {
    background: ${(props) => props.theme.authHoverBgColor};
    color: ${(props) => props.theme.authHoverTextColor};
    transform: scale(1.05);
  }
  &:active {
    background: ${(props) => props.theme.authActiveBgColor};
    color: ${(props) => props.theme.authHoverTextColor};
    transform: scale(0.95);
  }
  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.focusColor};
    outline-offset: 2px;
  }
`;

export const TOPBAR_HEIGHT = HEADER_H;

export default function Topbar({ isLoggedIn = false }: TopbarProps) {
  return (
    <TopbarContainer>
      <TopbarContent aria-label="Top navigation">
        <Logo to="/">
          <img
            src="../res/Logo.png"
            alt="Logo"
            style={{ height: "50px", verticalAlign: "middle" }}
          />
        </Logo>
        <Menu>
          <li>
            <MenuLink to="/problems">문제</MenuLink>
          </li>
          <li>
            <MenuLink to="/board">게시판</MenuLink>
          </li>
          <li>
            <MenuLink to="/studygroup">스터디 그룹</MenuLink>
          </li>
        </Menu>
        <Auth>
          {isLoggedIn ? (
            <AuthLink to="/mypage">마이페이지</AuthLink> //추후 프로필 사진으로 변경
          ) : (
            <>
              <AuthLink to="/login">로그인</AuthLink>
              <AuthLink to="/register">회원가입</AuthLink>

              <AuthLink to="/mypage">삭제예정 - 마이페이지</AuthLink>
            </>
          )}
        </Auth>
      </TopbarContent>
    </TopbarContainer>
  );
}
