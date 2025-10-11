import { Outlet } from "react-router-dom";
import Topbar, { TOPBAR_HEIGHT } from "./components/Topbar";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme/theme";
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: ${(props) => props.theme.bgColor};
  margin-top: ${TOPBAR_HEIGHT}px;
`;

export default function App() {
  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <Topbar />
        <Container>
          <Outlet />
        </Container>
      </ThemeProvider>
    </>
  );
}
