import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import axios from 'axios'; // API 통신용 라이브러리

import {
  ResetPageWrapper,
  LoginBox,
  ResetTitle,
  InputGroup,
  Label,
  StyledInput,
  MainButton,
  ErrorMessage,
} from "../theme/ResetPassword.Style";

// API 베이스 주소 정의
// const API_BASE = " ";

//비밀번호 규칙
const validatePassword = (password: string) => {
  //최소 8자, 대문자(A-Z), 소문자(a-z), 숫자(0-9) 각각 1개 이상 포함
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const isValid = regex.test(password);

  let message = "";
  if (password.length > 0 && password.length < 8) {
    message = "최소 8자 이상이어야 합니다.";
  } else if (!/(?=.*[a-z])/.test(password) && password.length >= 8) {
    message = "소문자를 포함해야 합니다.";
  } else if (!/(?=.*[A-Z])/.test(password) && password.length >= 8) {
    message = "대문자를 포함해야 합니다.";
  } else if (!/(?=.*\d)/.test(password) && password.length >= 8) {
    message = "숫자를 포함해야 합니다.";
  }

  return { isValid, message };
};

export default function NewPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 전달받은 토큰과 이메일
  const resetToken = location.state?.resetToken || "";
  const userEmail = location.state?.email || "사용자 이메일 정보 없음"; // 이메일은 안내용

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //1. 비밀번호 보안 규칙 검사 결과
  const passwordValidationResult = validatePassword(newPassword);

  //2. 최종 유효성: 보안 규칙 만족 && 비밀번호 일치
  const isNewPasswordValid =
    passwordValidationResult.isValid && newPassword === newPasswordConfirm;

  const handleGoBack = () => navigate(-1);

  // 토큰 유효성 검사 및 오류 처리 (첫 렌더링 시)
  // 재설정 확인용으로 일단 주석처리함. 실제로는 사용하는 코드
  /* if (!resetToken) {
    return (
      <ResetPageWrapper>
        <LoginBox>
          <ResetTitle>오류</ResetTitle>
          <p style={{ marginTop: "20px" }}>
            잘못된 접근이거나 인증 시간이 만료되었습니다.
          </p>
          <Link to="/forget-password">재발급 요청 페이지로</Link>
        </LoginBox>
      </ResetPageWrapper>
    );
  } 
  */

  // 비밀번호 최종 설정 및 API 호출
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    //최종 유효성 검사
    if (!isNewPasswordValid) {
      setErrorMessage("비밀번호가 일치하지 않거나 규칙을 위반했습니다.");
      return;
    }

    try {
      // 3. API 호출: /api/auth/password/reset
      console.log("API 3: 새 비밀번호 최종 설정 요청 전송");
      const resetData = {
        resetToken: resetToken,
        newPassword: newPassword,
        newPasswordConfirm: newPasswordConfirm,
      };
      // await axios.post(`${API_BASE}/reset`, resetData);

      alert("비밀번호가 성공적으로 변경되었습니다! 로그인해 주세요.");
      navigate("/login");
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        "비밀번호 저장 중 알 수 없는 오류가 발생했습니다.";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <ResetPageWrapper>
      <LoginBox>
        <ResetTitle>새 비밀번호 설정</ResetTitle>
        <p style={{ marginBottom: "20px", color: "green" }}>
          인증 완료: {userEmail}
        </p>

        <form onSubmit={handlePasswordReset}>
          <InputGroup>
            <Label htmlFor="new-pw">새 비밀번호 :</Label>
            <StyledInput
              type="password"
              id="new-pw"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="최소 8자, 대/소문자 숫자 포함"
            />
          </InputGroup>
          {newPassword.length > 0 && !passwordValidationResult.isValid && (
            <ErrorMessage>{passwordValidationResult.message}</ErrorMessage>
          )}
          <InputGroup>
            <Label htmlFor="confirm-pw">비밀번호 확인 :</Label>
            <StyledInput
              type="password"
              id="confirm-pw"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
            />
          </InputGroup>
          {newPasswordConfirm.length > 0 &&
            newPassword !== newPasswordConfirm && (
              <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
            )}

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

          <MainButton type="submit" disabled={!isNewPasswordValid}>
            변경하기
          </MainButton>
        </form>
      </LoginBox>
    </ResetPageWrapper>
  );
}
