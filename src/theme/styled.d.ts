import "styled-components";
declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    textColor: string;
    focusColor: string;
    logoColor: string;
    headerBgColor: string;
    authHoverBgColor: string;
    authHoverTextColor: string;
    authActiveBgColor: string;
  }
}
