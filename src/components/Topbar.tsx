import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const TopbarContainer = styled.div`
  width: 100%;
  height: 50px;
  background-color: teal;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;

  position: fixed;
  top: 0;
  z-index: 100; /* 다른 요소 위에 표시되도록 z-index 설정 */
`;
// 실제 메뉴 내용이 들어가는 영역 (좌, 중, 우 분리)
const TopbarContent = styled.div`
  width: 100%;
  margin: 0 auto; /* 콘텐츠를 중앙 정렬 */
  display: flex;
  justify-content: space-between; /* 좌, 우 끝으로 요소를 분리 */
  align-items: center;
  padding: 0 20px; /* 양쪽 패딩 */
`;

// 로고 영역 (왼쪽)
const LogoArea = styled.div`
  font-size: 24px;
  font-weight: bold;
  cursor: pointer; /* 클릭 가능한 요소임을 표시 */
`;

// 중앙 메뉴 영역
const MenuArea = styled.div`
  display: flex;
  gap: 30px; /* 메뉴 항목 간 간격 */
`;

// 로그인/마이페이지 영역 (오른쪽)
const AuthArea = styled.div`
  display: flex;
  gap: 15px;
`;

// 메뉴 및 버튼 공통 스타일
const MenuItem = styled.div`
  font-size: 16px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #ffd700; /* 호버 시 색상 변경 */
  }
`;

function Topbar() {
  //훅 호출
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  //로그인 유무는 일단 더미데이터로 설정
  const isLoggedin = false;

  // 로그인 유무에 따른 로그인.마이페이지 전환 표시
  const AuthButtons = () => {
    if (isLoggedin) {
      return (
        <AuthArea>
          <MenuItem onClick={() => handleNavigate("/mypage")}>
            마이페이지
          </MenuItem>
        </AuthArea>
      );
    } else {
      return (
        <AuthArea>
          <MenuItem onClick={() => handleNavigate("/login")}>로그인</MenuItem>
          <MenuItem onClick={() => handleNavigate("/register")}>
            회원가입
          </MenuItem>
        </AuthArea>
      );
    }
  };

  return (
    <TopbarContainer>
      <TopbarContent>
        {/*로고(로고 누르면 메인페이지로 전환되게끔 일단 해놨다) */}
        <LogoArea onClick={() => handleNavigate("/")}>[LOGO]</LogoArea>

        {/*중앙 메뉴*/}
        <MenuArea>
          <MenuItem onClick={() => handleNavigate("/problems")}>문제</MenuItem>
          <MenuItem onClick={() => handleNavigate("/board")}>게시판</MenuItem>
          <MenuItem onClick={() => handleNavigate("/studygroup")}>
            스터디 그룹
          </MenuItem>
        </MenuArea>

        {/*우측*/}
        <AuthButtons />
      </TopbarContent>
    </TopbarContainer>
  );
}

export default Topbar;
