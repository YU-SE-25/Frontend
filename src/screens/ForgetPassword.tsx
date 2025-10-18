import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResetPageWrapper,
  LoginBox,
  ResetTitle,
  InputGroup,
  Label,
  StyledInput,
  ActionButton,
  ErrorMessage,
  BackButton,
} from "../theme/ForgetPassword.Style";
// import axios from 'axios';

//const API_BASE = ' ';

export default function ResetRequestPage() {
  const navigate = useNavigate();

  //인증 체크
  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoBack = () => navigate(-1);

  //1. 이메일 제출 및 코드 발송 요청
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email.includes("@")) {
      setErrorMessage("유효한 이메일 형식이 아닙니다.");
      return;
    }

    try {
      // 1. API 호출: /api/auth/password/send-reset-code
      console.log("API 1: 재설정 코드 발송 요청");
      // await axios.post(`${API_BASE}/send-reset-code`, { email });

      alert("인증번호 6자리가 이메일로 발송되었습니다. (10분 유효)");
      setStep("verify"); // 단계 전환
    } catch (error) {
      setErrorMessage("이메일 발송에 실패했거나, 등록되지 않은 이메일입니다.");
    }
  };

  //2. 인증번호 확인 및 임시 토큰 획득
  const handleVerifyCode = async () => {
    setErrorMessage("");
    if (code.length !== 6) {
      setErrorMessage("인증번호 6자리를 정확히 입력해 주세요.");
      return;
    }

    try {
      // 2. API 호출: /api/auth/password/verify-reset-code
      console.log("API 2: 인증번호 확인 요청");
      // 서버 응답에서 재설정 토큰을 받아와야 함
      //const response = await axios.post(`${API_BASE}/verify-reset-code`, { email, code });

      const responseData = {
        isVerified: true,
        resetToken: "ACTUAL_TOKEN_FROM_SERVER",
        message: "인증에 성공했습니다. 비밀번호를 재설정해주세요.",
      };

      if (responseData.isVerified) {
        alert(responseData.message);

        //resetToken과 email을 state에 담아 다음 페이지로 전달
        navigate("/reset-password", {
          state: {
            resetToken: responseData.resetToken,
            email: email,
          },
        });
      } else {
        setErrorMessage("인증에 실패했습니다. 코드를 다시 확인해 주세요.");
      }
    } catch (error) {
      setErrorMessage("인증번호가 일치하지 않거나 만료되었습니다.");
    }
  };

  return (
    <ResetPageWrapper>
      <BackButton onClick={handleGoBack}>&larr;</BackButton>
      <LoginBox>
        <ResetTitle>
          {step === "request" ? "비밀번호 재발급 요청" : "인증 코드 확인"}
        </ResetTitle>

        {/* 폼 */}
        <form
          onSubmit={
            step === "request" ? handleSendCode : (e) => e.preventDefault()
          }
        >
          <InputGroup>
            <Label htmlFor="email">이메일 :</Label>
            <StyledInput
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={step !== "request"}
            />
            {step === "request" && (
              <ActionButton type="submit">제출하기</ActionButton>
            )}
          </InputGroup>

          {step === "verify" && (
            <>
              <InputGroup>
                <Label htmlFor="code">인증번호 :</Label>
                <StyledInput
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.slice(0, 6).replace(/[^0-9]/g, ""))
                  }
                  maxLength={6}
                  placeholder="6자리 숫자 입력"
                />
                <ActionButton
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={code.length !== 6}
                >
                  확인하기
                </ActionButton>
              </InputGroup>
            </>
          )}

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </form>
        {step === "verify" && (
          <p style={{ marginTop: "20px", fontSize: "12px", color: "gray" }}>
            * 인증번호는 10분간 유효하며, 이메일은 수정할 수 없습니다.
          </p>
        )}
      </LoginBox>
    </ResetPageWrapper>
  );
}
