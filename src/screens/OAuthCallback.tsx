import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { loginActionAtom } from "../atoms";
import type { LoginResponse } from "../atoms";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const runLoginAction = useSetAtom(loginActionAtom);
  const didRun = useRef(false); // 중복 실행 방지
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (!accessToken || !refreshToken) {
      setError("토큰 정보를 가져오지 못했습니다.");
      return;
    }

    // TODO: 실제 사용자 정보는 백엔드에서 받아와야 함
    const mockUserProfile = {
      userId: 1,
      nickname: "imyulm00",
      role: "LEARNER" as const,
    };

    const loginData: LoginResponse = {
      accessToken,
      refreshToken,
      expiresIn: 3600,
      user: mockUserProfile,
    };

    runLoginAction(loginData);

    navigate("/", { replace: true });
  }, [navigate, runLoginAction]);

  if (error) return <div>{error}</div>;
  return <div>로그인 처리 중...</div>;
}
