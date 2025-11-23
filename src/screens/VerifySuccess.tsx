import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const SuccessWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 24px;
`;

const SuccessCard = styled.div`
  width: min(90%, 800px);
  padding: 50px 30px;
  margin-top: 50px;
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
`;

const SuccessText = styled.p`
  font-size: 20px;
  color: ${(props) => props.theme.textColor};
  line-height: 1.5;
  h2 {
    color: ${(props) => props.theme.textColor};
  }
`;

const LoginLink = styled(Link)`
  display: inline-block;
  padding: 10px 30px;
  margin-top: 40px;

  background-color: ${(props) => props.theme.logoColor};
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
`;

export default function VerifySuccessPage() {
  return (
    <SuccessWrapper>
      <SuccessCard>
        <h2>🎉 인증 완료!</h2>

        <SuccessText>이메일 인증이 성공적으로 완료되었습니다.</SuccessText>
        <SuccessText>
          강사 신청의 경우, 현재 일반 회원으로 가입되었으며, 강사 신청은 관리자
          검토 후 승인됩니다.
        </SuccessText>
        <SuccessText>환영합니다 학습자님!</SuccessText>

        <LoginLink to="/login">로그인 하러가기</LoginLink>
      </SuccessCard>
    </SuccessWrapper>
  );
}
