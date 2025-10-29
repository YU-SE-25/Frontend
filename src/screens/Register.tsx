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
  ModalContentBox,
  CloseButton,
  ModalBackdrop,
  BackButton,
} from "../theme/Register.Style.ts";

//type UserType = "student";

//비밀번호
const validatePassword = (password: string) => {
  //최소 8자, 대문자(A-Z), 소문자(a-z), 숫자(0-9) 각각 1개 이상 포함
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const isValid = regex.test(password);

  let message = "";
  if (password.length < 8) {
    message = "최소 8자 이상이어야 합니다.";
  } else if (!/(?=.*[a-z])/.test(password)) {
    message = "소문자를 포함해야 합니다.";
  } else if (!/(?=.*[A-Z])/.test(password)) {
    message = "대문자를 포함해야 합니다.";
  } else if (!/(?=.*\d)/.test(password)) {
    message = "숫자를 포함해야 합니다.";
  }

  return { isValid, message };
};

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
  const passwordValidationResult = validatePassword(password);
  const passwordsMatch = password === passwordConfirm;
  const isValidPhone = phoneNumber.replace(/[^0-9]/g, "").length === 11;
  const isValidNicknameLength = nickname.length >= 2 && nickname.length < 10;

  const [modalContent, setModalContent] = useState<"terms" | "privacy" | null>(
    null
  );

  //뒤로가기
  const handleGoBack = () => {
    navigate(-1);
  };

  //가입 버튼 활성화
  const isFormValid = useMemo(() => {
    return (
      isTermsChecked &&
      isPrivacyChecked &&
      passwordsMatch &&
      password.length >= 8 &&
      passwordValidationResult.isValid &&
      isValidEmailFormat &&
      isValidPhone &&
      isValidNicknameLength
    );
  }, [
    isTermsChecked,
    isPrivacyChecked,
    passwordsMatch,
    password.length,
    passwordValidationResult.isValid,
    isValidEmailFormat,
    isValidPhone,
    isValidNicknameLength,
  ]);

  //전화번호
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, "").slice(0, 11); // 숫자 11개까지만 허용

    let formattedNumber = cleaned;

    if (cleaned.length > 3 && cleaned.length <= 7) {
      formattedNumber = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length > 7) {
      formattedNumber = `${cleaned.slice(0, 3)}-${cleaned.slice(
        3,
        7
      )}-${cleaned.slice(7, 11)}`;
    }
    setPhoneNumber(formattedNumber);
  };

  //약관동의
  const handleOpenTerms = (type: "terms" | "privacy") => {
    setModalContent(type);
  };
  const handleCloseModal = () => {
    setModalContent(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    //백엔드쪽에서 이메일 중복체크, 닉네임 중복체크, 동일인물(이름 + 전화번호) 중복체크
    //가입하기 누르면 링크 전송 창 띄우기
    //가입 신청 완료 페이지 만들어서 넘어갈 것

    //API 호출 및 중복 체크 시작
    //const API_BASE = "/api/v1"; // 임시 API 베이스 주소 설정

    //0. 블랙리스트 : 해당 이메일 혹은 전화번호가 등록되어 있을 경우
    try {
      console.log("0. 블랙리스트 체크 시작...");
      //Api 적힌대로 함
      // const response = await axios.post(`${API_BASE}/auth/check/blacklist`, { name, email, phone: phoneNumber });
      if (response.data.isBlacklisted) {
        alert("회원가입이 제한된 사용자입니다.");
        return;
      }
    } catch (error) {
      alert("블랙리스트 확인 중 오류가 발생했습니다.");
      return;
    }

    //1.이메일 중복(/auth/check/email)
    try {
      console.log("1. 이메일 중복 체크 시작...");
      // await axios.post(`${API_BASE}/auth/check/email`, { email });
    } catch (error) {
      alert("이미 사용 중인 이메일입니다. 1인 1계정만 생성 가능합니다.");
      return;
    }

    //2.닉네임 중복(/auth/check/nickname)
    try {
      console.log("2. 닉네임 중복 체크 시작...");
      // await axios.post(`${API_BASE}/auth/check/nickname`, { nickname });
    } catch (error) {
      alert("이미 사용 중인 닉네임입니다.");
      return;
    }
    // 3. 전화번호 중복 체크 (/auth/check/phone)
    try {
      console.log("3. 전화번호 중복 체크 시작...");
      // await axios.post(`${API_BASE}/auth/check/phone`, { phone: phoneNumber });
    } catch (error) {
      alert("이미 등록된 전화번호입니다. 1인 1계정만 생성 가능합니다.");
      return;
    }

    //4.동일 인물(/auth/check/duplicate-account)
    try {
      console.log("4. 동일 인물 계정 확인 시작...");
      // await axios.post(`${API_BASE}/auth/check/duplicate-account`, { name, phoneNumber });
    } catch (error) {
      alert("이미 계정이 존재합니다. 1인 1계정만 생성 가능합니다.");
      return;
    }

    //최종 회원가입
    const registerData = {
      email: email,
      password: password,
      name: name,
      nickname: nickname,
      phone: phoneNumber,
      role: "LEARNER",
      agreedToTerms: isTermsChecked && isPrivacyChecked,
    };

    try {
      //회원가입 요청 (/auth/register)
      console.log("5. 최종 회원가입 요청 전송...");
      // await axios.post(`${API_BASE}/auth/register`, registrationData);

      //이메일 인증 링크 발송 (/auth/email/send-link)
      console.log("6. 이메일 인증 링크 발송 요청...");
      // await axios.post(`${API_BASE}/auth/email/send-link`, { email });

      navigate("/register-success");
    } catch (error) {
      alert("서버 오류");
    }
  };

  return (
    <RegisterPageWrapper>
      <BackButton onClick={handleGoBack}>&larr; {/* 왼쪽 화살표 */}</BackButton>
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
          {password.length > 0 && !passwordValidationResult.isValid && (
            <ErrorMessage>비밀번호 규정을 따라주세요.</ErrorMessage>
          )}
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
              placeholder="010-XXXX-XXXX 형식으로 자동 입력"
              maxLength={13}
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
              maxLength={9}
              placeholder="2글자 이상, 10글자 미만"
            />
          </InputGroup>

          <TermsGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={isTermsChecked}
                onChange={(e) => setIsTermsChecked(e.target.checked)}
              />
              <span
                onClick={() => handleOpenTerms("terms")}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                사용자의 약관 동의 및 개인정보 처리방침 동의
              </span>
              (필수)
            </CheckboxLabel>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={isPrivacyChecked}
                onChange={(e) => setIsPrivacyChecked(e.target.checked)}
              />
              <span
                onClick={() => handleOpenTerms("privacy")}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                개인정보 수집 및 이용 동의
              </span>
              (필수)
            </CheckboxLabel>
          </TermsGroup>

          <FullWidthButton type="submit" $main disabled={!isFormValid}>
            가입하기
          </FullWidthButton>
        </form>
      </RegisterBox>
      {modalContent && (
        <ModalBackdrop onClick={handleCloseModal}>
          <ModalContentBox onClick={(e) => e.stopPropagation()}>
            {/* 모달 박스 클릭 시 배경 닫힘 방지 */}
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            <h3>
              {modalContent === "terms" ? "이용 약관" : "개인정보 처리방침"}
            </h3>
            <p style={{ whiteSpace: "pre-wrap" }}>
              {modalContent === "terms"
                ? `\n 내용 추가 예정`
                : `\n 내용 추가 예정`}
            </p>
          </ModalContentBox>
        </ModalBackdrop>
      )}
    </RegisterPageWrapper>
  );
}
