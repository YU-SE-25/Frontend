import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { loginActionAtom } from "../atoms";
import type { LoginResponse } from "../atoms";

export default function OAuthCallback() {
  const nav = useNavigate();
  const runLoginAction = useSetAtom(loginActionAtom);
  const didRun = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const nickname = params.get("nickname") ?? "";
    const role =
      (params.get("role") as "MANAGER" | "INSTRUCTOR" | "LEARNER") ?? "LEARNER";
    const userId = Number(params.get("userId")) || 0;

    if (!accessToken || !refreshToken || !userId) {
      setError("로그인 정보를 확인할 수 없습니다.");
      return;
    }

    const loginData: LoginResponse = {
      accessToken,
      refreshToken,
      expiresIn: 3600,
      user: { userId, nickname, role },
    };

    runLoginAction(loginData);

    localStorage.setItem("lastUserId", String(userId));

    nav("/", { replace: true });
  }, [nav, runLoginAction]);

  if (error) return <div>{error}</div>;
  return <div>로그인 처리 중...</div>;
}
