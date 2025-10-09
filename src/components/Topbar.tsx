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
  background: teal;
  color: white;
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
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: 800;
  color: inherit;
  text-decoration: none;
  outline: none;
  &:focus-visible {
    outline: 2px solid #ffd700;
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
  color: white;
  text-decoration: none;
  outline: none;
  &:hover {
    color: #ffd700;
  }
  &.active {
    text-decoration: underline;
  }
  &:focus-visible {
    outline: 2px solid #ffd700;
    outline-offset: 2px;
  }
`;

const Auth = styled.div`
  display: flex;
  gap: 12px;
`;

const AuthLink = styled(Link)`
  font-size: 14px;
  color: white;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 10px;
  outline: none;
  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
  &:focus-visible {
    outline: 2px solid #ffd700;
    outline-offset: 2px;
  }
`;

export const TOPBAR_HEIGHT = HEADER_H;

export default function Topbar({ isLoggedIn = false }: TopbarProps) {
  return (
    <TopbarContainer>
      <TopbarContent aria-label="Top navigation">
        <Logo to="/">[LOGO]</Logo>
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
            <AuthLink to="/mypage">마이페이지</AuthLink>
          ) : (
            <>
              <AuthLink to="/login">로그인</AuthLink>
              <AuthLink to="/register">회원가입</AuthLink>
            </>
          )}
        </Auth>
      </TopbarContent>
    </TopbarContainer>
  );
}
