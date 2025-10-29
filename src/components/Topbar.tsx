import { Link, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useState } from "react"; // useState는 Theme Toggle 시뮬레이션용으로 사용

//전역 상태 관리 (Zustand/Jotai를 위한 Placeholder)
//실제 프로젝트에서는 이 부분을 useAuthStore.ts 등에서 import 해야 합니다.
const useAuthStore = () => ({
  // isLoggedin 상태를 가져오거나 set 하는 함수 (실제 스토어 사용 시 구현 필요)
  logout: () => {
    console.log("Global Auth State Reset initiated.");
    // 예: set((state) => ({ isLoggedIn: false, user: null }))
  },
});
//테마 관리 PLACEHOLDER -> 얘도 임시입니당
const useThemeStore = () => {
  const [isDark, setIsDark] = useState(false); // 로컬에서 임시로 다크 모드 상태 관리
  const toggleTheme = () => setIsDark((prev) => !prev);
  return { isDark, toggleTheme };
};

type TopbarProps = { isLoggedIn?: boolean };
const HEADER_H = 50;

const TopbarContainer = styled.header`
  height: ${HEADER_H}px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  justify-content: space-between;

  background-color: ${(props) => props.theme.headerBgColor};
  color: ${(props) => props.theme.textColor};
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const TopbarContent = styled.nav`
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;
//오른쪽 영역 (테마 토글 + 인증)을 묶는 컨테이너
const RightSection = styled.div`
  display: flex;
  align-items: center;
  width: 30%;
  gap: 20px; /* 테마 토글과 인증 버튼 사이 간격 */
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

// **********************************************

//라이트.다크모드 변경 버튼(추후에 뺄수도 있음, css확인용)
const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  cursor: pointer;
  span {
    font-size: 14px;
    margin-right: 8px;
    color: ${(props) => props.theme.textColor};
    white-space: nowrap;
  }
`;
// 실제 스위치 영역 (막대)
const ToggleSwitch = styled.div<{ $isDark: boolean }>`
  width: 44px; /* 스위치 막대 너비 */
  height: 24px; /* 스위치 막대 높이 */
  background-color: ${(props) =>
    props.$isDark ? props.theme.focusColor : props.theme.authHoverBgColor};
  border-radius: 12px;
  position: relative;
  transition: background-color 0.3s;
`;
// 스위치 핸들 (동그란 부분)
const ToggleHandle = styled.div<{ $isDark: boolean }>`
  width: 18px;
  height: 18px;
  background-color: ${(props) => props.theme.bgColor}; /* 항상 밝은 색 */
  border-radius: 50%;
  position: absolute;
  top: 3px;
  /* Dark 모드일 때 오른쪽으로 이동 */
  left: ${(props) => (props.$isDark ? "23px" : "3px")};
  transition: left 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;
// **********************************************

export const TOPBAR_HEIGHT = HEADER_H;

export default function Topbar({ isLoggedIn = false }: TopbarProps) {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore(); // 테마 토글 상태 가져오기

  // 💡 [로그아웃 처리 함수]
  const handleLogout = async () => {
    // 1. Local Storage에서 Refresh Token 가져오기
    const refreshToken = localStorage.getItem("refreshToken");

    // 2. Refresh Token 무효화 API 호출 (서버 세션 종료)
    if (refreshToken) {
      try {
        // 백엔드에서 요구한 JSON 형식으로 전송
        await axios.post("/api/auth/logout", {
          refreshToken: refreshToken,
        });
      } catch (error) {
        // API 호출 실패해도 클라이언트 측 로그아웃은 진행 (세션 불일치 방지)
        console.error(
          "Logout API call failed, proceeding with client-side logout:",
          error
        );
      }
    }

    // 3. 클라이언트 측 상태 초기화 (LocalStorage와 전역 상태)
    localStorage.removeItem("refreshToken"); // Local Storage에서 토큰 삭제
    authStore.logout(); // 전역 인증 상태 초기화

    // 4. 메인으로 복귀
    navigate("/");
  };

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
            <MenuLink to="/problem-list">문제</MenuLink>
          </li>
          <li>
            <MenuLink to="/board">게시판</MenuLink>
          </li>
          <li>
            <MenuLink to="/studygroup">스터디 그룹</MenuLink>
          </li>
        </Menu>

        <RightSection>
          <ThemeToggleContainer onClick={toggleTheme}>
            <ToggleSwitch $isDark={isDark}>
              <ToggleHandle $isDark={isDark} />
            </ToggleSwitch>
          </ThemeToggleContainer>
          <Auth>
            {isLoggedIn ? (
              <AuthLink to="/mypage/:userName">마이페이지</AuthLink>
            ) : (
              <>
                <AuthLink to="/login">로그인</AuthLink>
                <AuthLink to="/register">회원가입</AuthLink>
                {/*마이페이지 및 로그아웃 버튼 위치 추후 수정 예정*/}
                <AuthLink to="/mypage/InHereUserNamePlz">마이페이지</AuthLink>
                <AuthLink to="/">로그아웃</AuthLink>
              </>
            )}
          </Auth>
        </RightSection>
      </TopbarContent>
    </TopbarContainer>
  );
}
