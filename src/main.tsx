/*************************
 *메인 파일
 *************************/
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import ResetStyle from "./ResetStyle.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./Router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ResetStyle />
    <RouterProvider router={router} />
  </StrictMode>
);
