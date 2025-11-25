export type Role = "LEARNER" | "INSTRUCTOR" | "MANAGER";

export interface AdminUser {
  id: number;
  userId: string;
  nickname: string;
  role: Role;
  createdAt: string;
}

export const ROLE_LABEL: Record<Role, string> = {
  LEARNER: "회원",
  INSTRUCTOR: "강사",
  MANAGER: "관리자",
};

export const DUMMY_USERS: AdminUser[] = [
  {
    id: 1,
    userId: "gamppe",
    nickname: "겜페",
    role: "LEARNER",
    createdAt: "2025-11-01",
  },
  {
    id: 2,
    userId: "teacher01",
    nickname: "알고강사",
    role: "INSTRUCTOR",
    createdAt: "2025-10-20",
  },
  {
    id: 3,
    userId: "admin01",
    nickname: "운영자1",
    role: "MANAGER",
    createdAt: "2025-09-10",
  },
];
