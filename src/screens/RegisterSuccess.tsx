import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const CheckWrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 24px;
`;
const CheckCard = styled.div`
  width: min(90%, 700px);
  padding: 50px 30px;
  background-color: ${(props) => props.theme.headerBgColor};
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 15px;
  h2 {
    color: ${(props) => props.theme.textColor};
  }
  p {
    color: ${(props) => props.theme.textColor};
  }
`;

const MainLink = styled(Link)`
  display: inline-block;
  padding: 10px 30px;
  margin-top: 40px;

  background-color: ${(props) => props.theme.logoColor};
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.theme.textColor};
`;

//화면 글자 조정 필요
export default function RegisterSuccess() {
  return (
    <CheckWrapper>
      <CheckCard>
        <h2>회원가입 작성이 완료되었습니다.</h2>
        <p>회원가입을 완료하려면 이메일로 발송된 인증 링크를 클릭해 주세요.</p>
        <p style={{ fontSize: "16px" }}>
          이메일이 안보이시나요? 스팸함을 확인해 보시거나, 10분 뒤에 다시
          회원가입을 시도해 주세요.
        </p>
        <MainLink to="/login">로그인 하러가기</MainLink>
      </CheckCard>
    </CheckWrapper>
  );
}
