import { Outlet } from "react-router-dom";
import { DevTools } from "jotai-devtools";
import Topbar, { TOPBAR_HEIGHT } from "./components/Topbar";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme/theme";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { isDarkAtom, refreshTokenAtom, refreshActionAtom } from "./atoms";
import type { RefreshResponse } from "./atoms";
import axios from "axios";

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

  // 앱 시작 시 refreshToken이 있으면 accessToken 갱신
  useEffect(() => {
    if (!storedRefreshToken) return;
    const refreshTokenAsync = async () => {
      try {
        const res = await axios.post<RefreshResponse>(
          "http://localhost:8080/api/auth/refresh",
          {
            refreshToken: storedRefreshToken,
          }
        );
        runRefreshAction(res.data);
      } catch (err) {
        console.error("토큰 갱신 실패:", err);
      }
    };
    refreshTokenAsync();
  }, [storedRefreshToken, runRefreshAction]);

  return (
    <>
      {/* 디버그 코드!!!!*/}
      <DevTools />

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
