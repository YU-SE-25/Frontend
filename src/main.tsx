import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ResetStyle from "./ResetStyle.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./Router.tsx";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "./theme/theme.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <ResetStyle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
