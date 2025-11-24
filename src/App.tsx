import { Outlet } from "react-router-dom";
import { DevTools } from "jotai-devtools";
import Topbar, { TOPBAR_HEIGHT } from "./components/Topbar";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme/theme";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { isDarkAtom, refreshTokenAtom, refreshActionAtom } from "./atoms";
import { userProfileAtom, type RefreshResponse } from "./atoms";
import api from "./axiosInstance";

const Container = styled.div`
  margin-top: ${TOPBAR_HEIGHT}px;
  min-height: calc(100vh - ${TOPBAR_HEIGHT}px);
  width: 100%;
  background-color: ${(props) => props.theme.bgColor} !important;
`;

export default function App() {
  const isDark = useAtomValue(isDarkAtom);
  const storedRefreshToken = useAtomValue(refreshTokenAtom);
  const runRefreshAction = useSetAtom(refreshActionAtom);

  const setUserProfile = useSetAtom(userProfileAtom);

  // 앱 시작 시 refreshToken 있으면 accessToken + userProfile 복구
  useEffect(() => {
    if (!storedRefreshToken) return;

    const restoreSession = async () => {
      try {
        //accessToken 재발급
        const refreshRes = await api.post<RefreshResponse>("/auth/refresh", {
          refreshToken: storedRefreshToken,
        });
        runRefreshAction(refreshRes.data);

        //userProfile 재조회
        const meRes = await api.get("/auth/me");
        // 백엔드의 현재 유저 조회 API 경로에 맞춰 수정해야 함
        setUserProfile(meRes.data);
      } catch (err) {
        console.error("세션 복구 실패:", err);
      }
    };

    restoreSession();
  }, [storedRefreshToken]);

  return (
    <>
      {/* 디버그 코드!!!!*/}
      {/* <DevTools /> */}

      {/* 테마설정 */}
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <Topbar />
        <Container>
          <Outlet />
        </Container>
      </ThemeProvider>
    </>
  );
}
