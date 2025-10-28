import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "../theme/Login.Style";

//코드
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);
  const [failCount, setFailCount] = useState(0);

  const navigate = useNavigate();

  //뒤로가기
  const handleGoBack = () => {
    navigate(-1);
  };

  //로그인 검사
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //이미 잠긴 계정인지 확인 : 백엔드 api 필요
    /*
    if (failCount >= 5) {
      alert("이미 잠긴 계정입니다.");
      return;
    }
      */

    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    //API 호출
    const loginData = {
      email: email,
      password: password,
      keepLogin: keepLogin, // 로그인 유지 상태 전달
    };

    try {
      console.log(`로그인 시도: ${email} (유지: ${keepLogin})`);

      // const response = await axios.post(`${API_BASE}/auth/login`, loginData);

      //API 성공시에
      // const token = response.data.token;
      // if (keepLogin) { localStorage.setItem('refreshToken', response.data.refreshToken); }

      // 로그인 성공 후 처리 (상태 관리 스토어 업데이트 필요)
      // useAuthStore.getState().login(response.data.user);

      alert("로그인 성공!"); //최종 코드엔 뺍니다, 로그인 잘 되는지 확인용
      navigate("/"); // 메인 페이지로 이동
    } catch (error) {
      //일단 임시로
      const newFailCount = failCount + 1;
      setFailCount(newFailCount);
      const serverError = "사용자 정보가 일치하지 않거나 존재하지 않습니다.";
      alert(`${serverError} (남은 시도 횟수: ${5 - newFailCount})`);

      if (newFailCount >= 5) {
        alert("시도 횟수 초과! 계정이 잠금 처리됩니다.");
        navigate("/login-blocked");
      }
    }
  };

  const handleSocialLogin = (platform: "google" | "github") => {
    console.log(`${platform} 소셜 로그인 시도`);
    //소셜 로그인 파트!
  };

  return (
    <LoginPageWrapper>
      <BackButton onClick={handleGoBack}>&larr; {/* 왼쪽 화살표 */}</BackButton>
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
