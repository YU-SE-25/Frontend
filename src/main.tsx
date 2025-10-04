/*************************
 *메인 파일
 *************************/
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import App from "./App.tsx";
import ResetStyle from "./ResetStyle.tsx";
import Topbar from "./components/Topbar.tsx";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #505050;
`;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ResetStyle />

    <Container>
      <Topbar />
      <App />
    </Container>
  </StrictMode>
);
