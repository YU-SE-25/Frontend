import styled from "styled-components";

export const RegisterPageWrapper = styled.div`
  padding-top: 50px;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: ${(props) => props.theme.bgColor};
`;
export const RegisterBox = styled.div`
  width: 700px;
  margin-top: 50px;
  margin-bottom: 50px;
  padding: 40px;
  background-color: ${(props) => props.theme.headerBgColor};
  border-radius: 5px;
  color: ${(props) => props.theme.textColor};
  border: 2px solid ${(props) => props.theme.focusColor};
`;
export const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  color: ${(props) => props.theme.textColor};
`;

//입력 및 버튼 스타일
export const InputGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  font-size: 16px;
`;
export const Label = styled.label`
  width: 150px;
  flex-shrink: 0;
  font-weight: 600;
  margin-right: 15px;
`;
export const StyledInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
`;
export const ActionButton = styled.button<{ $main?: boolean }>`
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;

  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.authHoverTextColor};
`;
export const FullWidthButton = styled(ActionButton)`
  width: 100%;
  margin: 20px 0 0 0;
  &:disabled {
    /*조건 미만족 시 회색 계열(authHoverBgColor)로 변경*/
    background-color: ${(props) => props.theme.authHoverBgColor};
    color: ${(props) => props.theme.textColor};
  }
`;
export const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin: -10px 0 10px 165px;
  text-align: left;
`;

export const TermsGroup = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid ${(props) => props.theme.authHoverBgColor};
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
`;
export const CheckboxLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  cursor: pointer;
`;
