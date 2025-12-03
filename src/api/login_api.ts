import { api } from "./axios";
import type { LoginResponse } from "../atoms";

interface LoginPayload {
  email: string;
  password: string;
  keepLogin: boolean;
}

export async function postLogin(data: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("auth/login", data);
  const loginData = response.data;

  localStorage.setItem("accessToken", loginData.accessToken);
  localStorage.setItem("refreshToken", loginData.refreshToken);

  return loginData;
}
