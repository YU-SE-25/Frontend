import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  addToBlacklist,
  fetchUserList,
  updateUserRole,
} from "../../../api/manage_api";
/* -----------------------------------------------------
   styled-components
----------------------------------------------------- */
type Role = "LEARNER" | "INSTRUCTOR" | "MANAGER";
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
`;

// const Header = styled.h3`
//   margin: 0;
//   font-size: 22px;
//   font-weight: 700;
//   color: ${({ theme }) => theme.textColor};
// `;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 15px;

  background: ${({ theme }) => theme.bgColor};
  border: 1px solid ${({ theme }) => theme.muteColor};

  color: ${({ theme }) => theme.textColor};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  background: ${({ theme, disabled }) =>
    disabled ? theme.muteColor : theme.focusColor};
  color: ${({ theme }) => theme.bgColor};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  transition: 0.2s ease;

  &:hover {
    opacity: ${({ disabled }) => (disabled ? 0.4 : 0.8)};
  }
`;

const TableWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.bgCardColor};
  border-radius: 12px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.bgCardColor};
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.bgCardColor};
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const Tr = styled.tr<{ selected?: boolean }>`
  cursor: pointer;
  background: ${({ selected, theme }) =>
    selected ? theme.focusColor + "33" : theme.bgColor};

  &:hover {
    background: ${({ selected, theme }) =>
      selected ? theme.focusColor + "33" : theme.bgCardColor};
  }
`;

const Td = styled.td`
  padding: 12px;
  border-top: 1px solid ${({ theme }) => theme.bgCardColor};
  color: ${({ theme }) => theme.textColor};
`;

/* -----------------------------------------------------
   Component Logic
----------------------------------------------------- */

export default function UserManagementScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const ROLE_LABEL: Record<string, string> = {
    LEARNER: "회원",
    INSTRUCTOR: "강사",
    MANAGER: "관리자",
  };

  const selectedUser = useMemo(
    () => users.find((u) => u.userId === selectedId) ?? null,
    [users, selectedId]
  );

  // 🔥 검색 필터
  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();

    return users.filter(
      (u) =>
        String(u.userId).toLowerCase().includes(q) ||
        u.nickname.toLowerCase().includes(q)
    );
  }, [search, users]);

  const isDisabled = !selectedUser;

  // 🔥 진짜 데이터 불러오기
  useEffect(() => {
    async function load() {
      const result = await fetchUserList();
      console.log("fetchUserList result:", result);

      // result = { currentPage, totalElements, totalPages, users: [...] }
      setUsers(result.users ?? []);
    }
    load();
  }, []);

  const handleChange = (value: string) => {
    setSearch(value);
    setSelectedId(null);
  };

  const handleSelect = (userId: number) => {
    setSelectedId((prev) => (prev === userId ? null : userId));
  };

  const copyInfo = async () => {
    if (!selectedUser) return;
    await navigator.clipboard.writeText(JSON.stringify(selectedUser, null, 2));
    alert("유저 정보가 클립보드에 복사되었습니다!");
  };

  const blacklistUser = async () => {
    if (!selectedUser) return;

    if (
      !window.confirm(
        `${selectedUser.nickname} (${selectedUser.userId}) 을 블랙리스트에 추가하고 제거할까요?`
      )
    )
      return;

    const reason = window.prompt(
      "블랙리스트 사유를 입력하세요.",
      "운영정책 위반"
    );
    if (!reason) return;

    try {
      await addToBlacklist({
        email: selectedUser.email,
        phone: selectedUser.phone,
        name: selectedUser.name ?? selectedUser.nickname,
        reason,
      });

      setUsers((prev) => prev.filter((u) => u.userId !== selectedUser.userId));
      setSelectedId(null);

      alert("블랙리스트에 추가되었습니다.");
    } catch (err) {
      console.error(err);
      alert("블랙리스트 추가 중 오류가 발생했습니다.");
    }
  };

  const removeUser = () => {
    if (!selectedUser) return;
    if (!window.confirm("정말 제거하시겠습니까?")) return;

    setUsers((prev) => prev.filter((u) => u.userId !== selectedUser.userId));
    setSelectedId(null);
  };

  const changeRole = async () => {
    if (!selectedUser) return;

    const input = window.prompt(
      "역할을 입력하세요: 회원 / 강사 / 관리자",
      ROLE_LABEL[selectedUser.role]
    );

    if (!input) return;

    let next: Role | null = null;
    if (input === "회원") next = "LEARNER";
    if (input === "강사") next = "INSTRUCTOR";
    if (input === "관리자") next = "MANAGER";

    if (!next) return alert("잘못된 역할입니다.");

    try {
      // 🔥 1) 서버에 역할 변경 요청
      const res = await updateUserRole(selectedUser.userId, next);

      // 🔥 2) 성공하면 로컬 상태 업데이트
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === selectedUser.userId ? { ...u, role: next } : u
        )
      );

      alert(
        `역할이 '${ROLE_LABEL[res.oldRole]}' → '${
          ROLE_LABEL[res.newRole]
        }'로 변경되었습니다.`
      );
    } catch (err) {
      console.error(err);
      alert("역할 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <Wrap>
      <TopBar>
        <SearchInput
          value={search}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="아이디 / 닉네임 검색"
        />

        <ButtonGroup>
          <ActionButton onClick={copyInfo} disabled={isDisabled}>
            유저 정보보기
          </ActionButton>
          <ActionButton onClick={blacklistUser} disabled={isDisabled}>
            블랙리스트
          </ActionButton>
          <ActionButton
            onClick={removeUser}
            disabled={true}
            title="추후 구현 예정..."
          >
            유저 제거
          </ActionButton>
          <ActionButton onClick={changeRole} disabled={isDisabled}>
            역할 변경
          </ActionButton>
        </ButtonGroup>
      </TopBar>

      <TableWrap>
        <Table>
          <Thead>
            <tr>
              <Th>유저 아이디</Th>
              <Th>유저 닉네임</Th>
              <Th>유저 역할</Th>
              <Th>가입 일자</Th>
            </tr>
          </Thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <Td colSpan={4} style={{ textAlign: "center", opacity: 0.5 }}>
                  검색 결과 없음
                </Td>
              </tr>
            )}

            {filtered.map((u) => (
              <Tr
                key={u.userId}
                selected={selectedId === u.userId}
                onClick={() => handleSelect(u.userId)}
              >
                <Td>{u.userId}</Td>
                <Td>{u.nickname}</Td>
                <Td>{ROLE_LABEL[u.role]}</Td>
                <Td>{u.createdAt}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Wrap>
  );
}
