import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useSetAtom } from "jotai";
import { loginActionAtom } from "../atoms";
import { AuthAPI } from "../api/auth_api";

export default function SocialNicknameSetup() {
  const navigate = useNavigate();
  const runLoginAction = useSetAtom(loginActionAtom);

  // OAuthCallback에서 state로 전달받은 값
  const { state } = useLocation() as any;
  const {
    userId,
    nickname: defaultName,
    role,
    accessToken,
    refreshToken,
  } = state;

  const [nickname, setNickname] = useState(defaultName);
  const [isChecking, setIsChecking] = useState(false);
  const [valid, setValid] = useState<boolean | null>(null);

  async function checkDuplicate() {
    setIsChecking(true);
    try {
      const res = await AuthAPI.checkNickname(nickname);
      if (res.data.available) {
        setValid(true); // 사용 가능
      } else {
        setValid(false); // 중복
      }
    } catch (err) {
      console.error(err);
      setValid(false);
    }
    setIsChecking(false);
  }

  async function submitNickname() {
    if (!valid) {
      alert("닉네임 중복을 확인해주세요!");
      return;
    }

    try {
      await api.patch("/mypage/me", { nickname });

      // 로그인 상태 저장
      runLoginAction({
        accessToken,
        refreshToken,
        expiresIn: 3600,
        user: {
          userId,
          nickname,
          role,
        },
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("닉네임 설정 실패!");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>닉네임 설정</h2>

      <input
        value={nickname}
        onChange={(e) => {
          setNickname(e.target.value);
          setValid(null); // 이름 바꾸면 다시 미검사 상태
        }}
        style={{ padding: 10, width: "300px", marginBottom: 20 }}
      />

      <div>
        <button onClick={checkDuplicate} disabled={isChecking}>
          중복 확인
        </button>
      </div>

      {valid === true && (
        <p style={{ color: "green" }}>사용 가능한 닉네임입니다!</p>
      )}
      {valid === false && (
        <p style={{ color: "red" }}>이미 존재하는 닉네임입니다.</p>
      )}

      <button
        onClick={submitNickname}
        style={{ marginTop: 30, padding: "10px 20px" }}
        disabled={valid !== true}
      >
        닉네임 확정하기
      </button>
    </div>
  );
}

import styled from "styled-components";

// 전체 페이지 wrapper
export const NicknamePageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgColor};
  padding: 20px;
  position: relative;
`;

// 박스
export const NicknameBox = styled.div`
  width: min(90%, 500px);
  background-color: ${(props) => props.theme.headerBgColor};
  padding: 40px 30px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
`;

// 제목
export const NicknameTitle = styled.h2`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 25px;
  color: ${(props) => props.theme.textColor};
`;

// 인풋 그룹
export const InputGroup = styled.div`
  margin-bottom: 20px;
`;

// 라벨
export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

// 인풋
export const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  font-size: 18px;
`;

// 버튼
export const ActionButton = styled.button`
  width: 100%;
  padding: 12px 0;
  margin-top: 18px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => props.theme.logoColor};
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #aaaaaa;
    cursor: not-allowed;
  }
`;

// 오류 메시지
export const ErrorMessage = styled.p`
  margin-top: 10px;
  color: #ff5a5a;
  font-size: 18px;
  text-align: center;
`;

// 뒤로가기 버튼
export const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  border: none;
  background: transparent;
  font-size: 28px;
  cursor: pointer;
  color: ${(props) => props.theme.textColor};

  &:hover {
    opacity: 0.7;
  }
`;
