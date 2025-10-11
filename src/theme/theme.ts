import type { DefaultTheme } from "styled-components";

//전역 색상 테마 정의

export const darkTheme: DefaultTheme = {
  bgColor: "#191919",
  textColor: "#fefefe",
  focusColor: "#ffcb6b",
  logoColor: "#4ade80",
  headerBgColor: "#000000",
  authHoverBgColor: "#333333",
  authHoverTextColor: "#fefefe",
  authActiveBgColor: "#555555",
};

export const lightTheme: DefaultTheme = {
  textColor: "#191919",
  bgColor: "#fefefe",
  focusColor: "#ffcb6b",
  logoColor: "#4ade80",
  headerBgColor: "#ffffff",
  authHoverBgColor: "#c4c4c4",
  authHoverTextColor: "#fefefe",
  authActiveBgColor: "#555555",
};
