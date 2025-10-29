import { Outlet } from "react-router-dom";
import Topbar, { TOPBAR_HEIGHT } from "./components/Topbar";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme/theme";
import { useAtomValue } from "jotai";
import { isDarkAtom } from "./atoms";
const Container = styled.div`
  margin-top: ${TOPBAR_HEIGHT}px;
  min-height: calc(100vh - ${TOPBAR_HEIGHT}px);
  width: 100%;
  background-color: ${(props) => props.theme.bgColor} !important;
`;

export default function App() {
  const isDark = useAtomValue(isDarkAtom);
  return (
    <>
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
