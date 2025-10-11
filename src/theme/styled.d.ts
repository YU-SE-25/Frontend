import "styled-components";
declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    textColor: string;
    focusColor: string;
    logoColor: string;
    headerBgColor: string;
    authFocusBgColor: string;
    authFocusTextColor: string;
  }
}
