import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { loginActionAtom } from "../atoms";
import type { LoginResponse } from "../atoms";
import { AuthAPI } from "../api/auth_api";

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
    const email = params.get("email");

    if (!accessToken || !refreshToken) {
      setError("토큰 정보를 가져오지 못했습니다.");
      return;
    }

    if (!email) {
      setError("이메일 정보를 가져오지 못했습니다.");
      return;
    }

    // OAuth 리다이렉트에서 제공된 user 기본 정보
    const nickname = params.get("nickname");
    const userId = Number(params.get("userId"));
    const role = params.get("role") as "MANAGER" | "INSTRUCTOR" | "LEARNER";

    if (!nickname || !userId || !role) {
      setError("유저 정보를 가져오지 못했습니다.");
      return;
    }

    //최초 로그인인지 확인
    (async () => {
      try {
        //이메일 중복 체크로 신규/기존 판별
        const res = await AuthAPI.checkEmail(email);

        if (!res.data.available) {
          //이미 존재하는 이메일 → 기존 유저
          const loginData: LoginResponse = {
            accessToken,
            refreshToken,
            expiresIn: 3600,
            user: { userId, nickname, role: role as any },
          };

          runLoginAction(loginData);
          nav("/", { replace: true });
          return;
        }

        // 신규 소셜 로그인 → 닉네임 설정 페이지
        nav("/nickname-setup", {
          state: { userId, nickname, role, accessToken, refreshToken },
        });
      } catch (err) {
        console.error(err);
        setError("이메일 중복 검사 중 오류가 발생했습니다.");
      }
    })();
  }, [nav, runLoginAction]);

  if (error) return <div>{error}</div>;
  return <div>로그인 처리 중...</div>;
}
