import styled from "styled-components";

export const RegisterPageWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgColor};
`;
export const RegisterBox = styled.div`
  width: 600px;
  margin-top: 50px;
  margin-bottom: 50px;
  padding: 30px;
  background-color: ${(props) => props.theme.headerBgColor};
  border-radius: 5px;
  color: ${(props) => props.theme.textColor};
  border: 2px solid ${(props) => props.theme.focusColor};
  position: relative;
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

//약관
export const ModalBackdrop = styled.div`
  /* 💡 필수: 화면 전체에 고정 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000; /* 💡 매우 높게 설정하여 모든 요소 위에 표시 */
`;
export const ModalContentBox = styled.div`
  background-color: white; /* 모달 내용 상자 */
  padding: 30px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  max-height: 80%;
  overflow-y: auto; /* 내용이 길면 스크롤 가능 */
`;
export const CloseButton = styled.button`
  float: right;
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
`;

//뒤로가기
export const BackButton = styled.button`
  position: absolute;
  top: 70px;
  left: 30px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;
`;
