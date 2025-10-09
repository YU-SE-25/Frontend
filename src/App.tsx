import { Outlet } from "react-router-dom";
import Topbar, { TOPBAR_HEIGHT } from "./components/Topbar";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #191919;
  margin-top: ${TOPBAR_HEIGHT}px;
`;

export default function App() {
  return (
    <>
      <Topbar />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
