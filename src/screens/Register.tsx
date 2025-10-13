import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  RegisterPageWrapper,
  RegisterBox,
  Title,
  InputGroup,
  Label,
  StyledInput,
  FullWidthButton,
  ErrorMessage,
  TermsGroup,
  CheckboxLabel,
} from "../theme/Register.Style.ts";

//type UserType = "student";

export default function Register() {
  const navigate = useNavigate();

  //const [userType, setUserType] = useState<UserType>("student");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

  const isValidEmailFormat = email.includes("@") && email.includes(".");
  const passwordsMatch = password === passwordConfirm;
  const isValidPhone = phoneNumber.replace(/[^0-9]/g, "").length >= 10;

  //가입 버튼 활성화
  const isFormValid = useMemo(() => {
    return (
      isTermsChecked &&
      isPrivacyChecked &&
      passwordsMatch &&
      password.length >= 8 &&
      isValidEmailFormat &&
      isValidPhone
    );
  }, [
    isTermsChecked,
    isPrivacyChecked,
    passwordsMatch,
    password.length,
    isValidEmailFormat,
    isValidPhone,
  ]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 💡 입력 시 하이픈 제거하고 숫자만 저장 (DB 관리를 위해)
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setPhoneNumber(numericValue);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    //백엔드쪽에서 이메일 중복체크, 닉네임 중복체크, 동일인물(이름 + 전화번호) 중복체크
    //가입하기 누르면 링크 전송 창 띄우기
    //가입 신청 완료 페이지 만들어서 넘어갈 것

    //API 호출 및 중복 체크 시작
    const API_BASE = "/api/v1"; // 임시 API 베이스 주소 설정

    //1.이메일 중복(/auth/check/email)
    try {
      console.log("1. 이메일 중복 체크 시작...");
      // await axios.post(`${API_BASE}/auth/check/email`, { email });
    } catch (error) {
      // alert("이미 사용 중인 이메일입니다.");
      // return;
    }

    //2.닉네임 중복(/auth/check/nickname)
    try {
      console.log("2. 닉네임 중복 체크 시작...");
      // await axios.post(`${API_BASE}/auth/check/nickname`, { nickname });
    } catch (error) {
      // alert("이미 사용 중인 닉네임입니다.");
      // return;
    }

    //3.동일 인물(/auth/check/duplicate-account)
    try {
      console.log("3. 동일 인물 계정 확인 시작...");
      // await axios.post(`${API_BASE}/auth/check/duplicate-account`, { name, phoneNumber });
    } catch (error) {
      // alert("이미 계정이 존재합니다. 1인 1계정만 생성할 수 있습니다.");
      // return;
    }

    //최종 회원가입

    const registerData = {
      email: email,
      password: password,
      name: name,
      nickname: nickname,
      role: "LEARNER",
      agreedToTerms: isTermsChecked && isPrivacyChecked,
      emailVerified: false,
    };

    try {
      //회원가입 요청 (/auth/register)
      console.log("4. 최종 회원가입 요청 전송...");
      // await axios.post(`${API_BASE}/auth/register`, registrationData);

      //이메일 인증 링크 발송 (/auth/email/send-link)
      console.log("5. 이메일 인증 링크 발송 요청...");
      // await axios.post(`${API_BASE}/auth/email/send-link`, { email });

      navigate("/register-check");
    } catch (error) {
      alert("서버 오류");
    }
  };

  return (
    <RegisterPageWrapper>
      <RegisterBox>
        <Title>회원가입</Title>

        <form onSubmit={handleRegister}>
          <InputGroup>
            <Label>이메일 :</Label>
            <StyledInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </InputGroup>

          <InputGroup>
            <Label>비밀번호 :</Label>
            <StyledInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="최소 8자, 대/소문자 숫자 포함"
            />
          </InputGroup>
          <InputGroup>
            <Label>비밀번호 확인 :</Label>
            <StyledInput
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </InputGroup>
          {!passwordsMatch && (
            <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
          )}
          <InputGroup>
            <Label>전화번호 :</Label>
            <StyledInput
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="하이픈 없이 숫자만 입력"
            />
          </InputGroup>

          <InputGroup>
            <Label>이름 :</Label>
            <StyledInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <Label>닉네임 :</Label>
            <StyledInput
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </InputGroup>

          <TermsGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={isTermsChecked}
                onChange={(e) => setIsTermsChecked(e.target.checked)}
              />
              사용자의 약관 동의 및 개인정보 처리방침 동의 (필수)
            </CheckboxLabel>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={isPrivacyChecked}
                onChange={(e) => setIsPrivacyChecked(e.target.checked)}
              />
              개인정보 수집 및 이용 동의 (필수)
            </CheckboxLabel>
          </TermsGroup>

          <FullWidthButton type="submit" $main disabled={!isFormValid}>
            가입하기
          </FullWidthButton>
        </form>
      </RegisterBox>
    </RegisterPageWrapper>
  );
}
