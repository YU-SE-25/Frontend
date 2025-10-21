import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ResetStyle from "./ResetStyle.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./Router.tsx";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "./theme/theme.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={lightTheme}>
      <ResetStyle />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
