import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { postLogin } from "../api/login_api";
import { loginActionAtom } from "../atoms";
import {
  LoginPageWrapper,
  LoginBox,
  LoginTitle,
  InputGroup,
  Label,
  StyledInput,
  MainButton,
  SubLinks,
  SubLink,
  SocialLoginGroup,
  SocialButton,
  ErrorMessage,
  OptionsGroup,
  CheckboxLabel,
} from "../theme/Login.Style";
import axios from "axios";
import styled from "styled-components";

const SuperForceLoginButton = styled.button``;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const runLoginAction = useSetAtom(loginActionAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    try {
      //현재는 mock API 사용
      const response = await postLogin({ email, password, keepLogin });

      // Jotai 전역 상태 저장
      runLoginAction(response);

      navigate(-1); // 로그인 성공 후 이전 페이지로
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(
          error.response.data?.message || "로그인에 실패했습니다."
        );
      } else if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("서버와 연결할 수 없습니다. (네트워크 오류)");
      }
    }
  };

  const handleSocialLogin = (platform: "google" | "github") => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${platform}`;
  };

  return (
    <LoginPageWrapper>
      <LoginBox>
        <LoginTitle>로그인</LoginTitle>
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">이메일</Label>
            <StyledInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">비밀번호</Label>
            <StyledInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

          <OptionsGroup>
            <CheckboxLabel htmlFor="keepLogin">
              <input
                type="checkbox"
                id="keepLogin"
                checked={keepLogin}
                onChange={(e) => setKeepLogin(e.target.checked)}
              />
              로그인 상태 유지
            </CheckboxLabel>
          </OptionsGroup>

          <MainButton type="submit">로그인</MainButton>
        </form>

        <SubLinks>
          <SubLink to="/forget-password">비밀번호 재설정</SubLink>
          <SubLink to="/register">계정이 없으신가요?</SubLink>
        </SubLinks>

        <SocialLoginGroup>
          소셜 로그인
          <SocialButton
            platform="google"
            onClick={() => handleSocialLogin("google")}
          >
            구글
          </SocialButton>
          <SocialButton
            platform="github"
            onClick={() => handleSocialLogin("github")}
          >
            깃허브
          </SocialButton>
        </SocialLoginGroup>
      </LoginBox>
      <SuperForceLoginButton
        type="button"
        onClick={async () => {
          try {
            const response = await postLogin({
              email: "test@test.com",
              password: "1234",
              keepLogin: true,
            });

            runLoginAction(response);
            navigate(-1);
          } catch (error) {
            console.error("슈퍼 로그인 실패:", error);
            setErrorMessage(
              "슈퍼 로그인에도 실패했습니다… 서버 상태를 확인해주세요."
            );
          }
        }}
      >
        ⚡ 슈퍼 초강력 로그인 버튼(테스트 계정) ⚡
      </SuperForceLoginButton>
    </LoginPageWrapper>
  );
}
