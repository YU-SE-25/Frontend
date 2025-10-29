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
  BackButton,
  ErrorMessage,
  OptionsGroup,
  CheckboxLabel,
} from "../theme/Login.Style";

//코드
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 state

  const navigate = useNavigate();
  //Jotai Action Setter 함수 연결
  const runLoginAction = useSetAtom(loginActionAtom);

  // 로그인 검사 및 API 호출 로직
  // 이쪽 로직 추후 재수정~!!
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    const loginData = { email, password, keepLogin };

    try {
      // API 호출 대신 성공 데이터 시뮬레이션
      console.log(
        `[SIMULATION] 로그인 시도: ${email}, KeepLogin: ${keepLogin}`
      );

      //Mock Response Data (서버가 줄 데이터 형태)
      const mockLoginResponse: LoginResponse = {
        accessToken: "MOCK_SUCCESS_TOKEN",
        refreshToken: keepLogin ? "MOCK_LONG_LIVED_REFRESH" : "", // keepLogin에 따라 토큰 제공
        expiresIn: 3600,
        user: { userId: 101, nickname: "gamppe_dev", role: "LEARNER" },
      };

      //Jotai Action 실행: 전역 상태 저장
      runLoginAction(mockLoginResponse);

      // alert("로그인 성공!"); // 최종 코드에는 alert 제거
      navigate("/problem-list"); // 문제 목록으로 이동 (안전한 경로)
    } catch (error) {
      // 💡 [Axios 에러 처리] - TypeScript 안정성 확보를 위해 이 로직은 유지
      if (axios.isAxiosError(error) && error.response) {
        const serverResponse = error.response;
        const errorMsg =
          serverResponse.data?.message || "로그인에 실패했습니다.";

        setErrorMessage(errorMsg);

        // 잠금 처리 로직 (백엔드 메시지에 의존)
        if (errorMsg.includes("잠금되었습니다")) {
          navigate("/login-blocked");
        }
      } else {
        setErrorMessage("서버와 연결할 수 없습니다. (네트워크 오류)");
      }
    }
  };

  const handleSocialLogin = (platform: "google" | "github") => {
    console.log(`${platform} 소셜 로그인 시도`);
    //소셜 로그인 파트!
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
            <SubLink to="/forget-password">비밀번호 재설정</SubLink>
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
    </LoginPageWrapper>
  );
}
