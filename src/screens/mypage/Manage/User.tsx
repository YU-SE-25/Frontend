import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  addToBlacklist,
  fetchUserList,
  updateUserRole,
  fetchInstructorApplications,
  fetchInstructorApplicationDetail,
  downloadPortfolioFile,
} from "../../../api/manage_api";

type Role = "LEARNER" | "INSTRUCTOR" | "MANAGER";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 30px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.textColor};
`;

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

export default function UserManagementScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [instructors, setInstructors] = useState<any[]>([]);
  const [instructorSearch, setInstructorSearch] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);
  const [selectedApplicationDetail, setSelectedApplicationDetail] = useState<
    any | null
  >(null);

  const ROLE_LABEL: Record<string, string> = {
    LEARNER: "회원",
    INSTRUCTOR: "강사",
    MANAGER: "관리자",
  };

  const STATUS_LABEL: Record<string, string> = {
    PENDING: "대기",
    APPROVED: "승인됨",
    REJECTED: "반려됨",
  };

  const selectedUser = useMemo(
    () => users.find((u) => u.userId === selectedId) ?? null,
    [users, selectedId]
  );

  const selectedApplication = useMemo(
    () =>
      instructors.find((a) => a.applicationId === selectedApplicationId) ??
      null,
    [instructors, selectedApplicationId]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();

    return users.filter(
      (u) =>
        String(u.userId).toLowerCase().includes(q) ||
        u.nickname.toLowerCase().includes(q)
    );
  }, [search, users]);

  const filteredInstructors = useMemo(() => {
    if (!instructorSearch.trim()) return instructors;
    const q = instructorSearch.toLowerCase();

    return instructors.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        String(a.applicationId).toLowerCase().includes(q)
    );
  }, [instructorSearch, instructors]);

  const isDisabledUser = !selectedUser;
  const isDisabledInstructor = !selectedApplication;

  useEffect(() => {
    async function load() {
      const result = await fetchUserList();
      setUsers(result.users ?? []);

      const instructorResult = await fetchInstructorApplications({
        page: 0,
        size: 50,
        sort: "submittedAt,desc",
      });
      setInstructors(instructorResult.applications ?? []);
    }
    load();
  }, []);

  const handleChange = (value: string) => {
    setSearch(value);
    setSelectedId(null);
  };

  const handleInstructorSearch = (value: string) => {
    setInstructorSearch(value);
    setSelectedApplicationId(null);
    setSelectedApplicationDetail(null);
  };

  const handleSelect = (userId: number) => {
    setSelectedId((prev) => (prev === userId ? null : userId));
  };

  const handleSelectApplication = (applicationId: number) => {
    setSelectedApplicationId((prev) =>
      prev === applicationId ? null : applicationId
    );
    setSelectedApplicationDetail(null);
  };

  const copyInfo = async () => {
    if (!selectedUser) return;
    await navigator.clipboard.writeText(JSON.stringify(selectedUser, null, 2));
    alert("유저 정보가 클립보드에 복사되었습니다!");
  };

  const copyInstructorInfo = async () => {
    if (!selectedApplication) return;

    try {
      const detail = await fetchInstructorApplicationDetail(
        selectedApplication.applicationId
      );

      setSelectedApplicationDetail(detail);

      await navigator.clipboard.writeText(JSON.stringify(detail, null, 2));
      console.log("Instructor application detail:", detail);

      alert("강사 신청 상세 정보가 클립보드에 복사되었습니다!");
    } catch (err) {
      console.error(err);
      alert("강사 신청 상세 정보를 가져오는 중 오류가 발생했습니다.");
    }
  };

  const downloadPortfolio = async () => {
    if (!selectedApplication) return;

    try {
      let detail = selectedApplicationDetail;

      // 아직 상세정보를 안 불러왔으면 한번 가져오기
      if (
        !detail ||
        detail.applicationId !== selectedApplication.applicationId
      ) {
        detail = await fetchInstructorApplicationDetail(
          selectedApplication.applicationId
        );
        setSelectedApplicationDetail(detail);
      }

      const fileToken: string | undefined = detail?.portfolioFileUrl;
      if (!fileToken) {
        alert("포트폴리오 파일 정보가 없습니다.");
        return;
      }

      // 🔥 토큰 붙는 axios 인스턴스로 blob 받아오기
      const blob = await downloadPortfolioFile(fileToken);

      // 🔥 브라우저에서 다운로드 트리거
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // 백엔드에서 원래 파일명도 줬다면 그걸 쓰고, 없으면 토큰 그대로 사용
      const downloadName =
        detail.portfolioOriginalName || detail.originalFileName || fileToken;
      a.download = downloadName;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("포트폴리오 파일을 다운로드하는 중 오류가 발생했습니다.");
    }
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
      const res = await updateUserRole(selectedUser.userId, next);

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
      <SectionTitle>유저 목록</SectionTitle>
      <TopBar>
        <SearchInput
          value={search}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="아이디 / 닉네임 검색"
        />

        <ButtonGroup>
          <ActionButton onClick={copyInfo} disabled={isDisabledUser}>
            유저 정보보기
          </ActionButton>
          <ActionButton onClick={blacklistUser} disabled={isDisabledUser}>
            블랙리스트
          </ActionButton>
          <ActionButton
            onClick={removeUser}
            disabled={true}
            title="추후 구현 예정..."
          >
            유저 제거
          </ActionButton>
          <ActionButton onClick={changeRole} disabled={isDisabledUser}>
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

      <SectionTitle>강사 신청 목록</SectionTitle>
      <TopBar>
        <SearchInput
          value={instructorSearch}
          onChange={(e) => handleInstructorSearch(e.target.value)}
          placeholder="신청 ID / 이름 / 이메일 검색"
        />
        <ButtonGroup>
          <ActionButton
            onClick={copyInstructorInfo}
            disabled={isDisabledInstructor}
          >
            강사 정보보기
          </ActionButton>
          <ActionButton
            onClick={downloadPortfolio}
            disabled={isDisabledInstructor}
          >
            포트폴리오 다운로드
          </ActionButton>
        </ButtonGroup>
      </TopBar>

      <TableWrap>
        <Table>
          <Thead>
            <tr>
              <Th>신청 ID</Th>
              <Th>이름</Th>
              <Th>이메일</Th>
              <Th>신청 일자</Th>
              <Th>상태</Th>
            </tr>
          </Thead>
          <tbody>
            {filteredInstructors.length === 0 && (
              <tr>
                <Td colSpan={5} style={{ textAlign: "center", opacity: 0.5 }}>
                  강사 신청 내역 없음
                </Td>
              </tr>
            )}

            {filteredInstructors.map((a) => (
              <Tr
                key={a.applicationId}
                selected={selectedApplicationId === a.applicationId}
                onClick={() => handleSelectApplication(a.applicationId)}
              >
                <Td>{a.applicationId}</Td>
                <Td>{a.name}</Td>
                <Td>{a.email}</Td>
                <Td>{a.submittedAt}</Td>
                <Td>{STATUS_LABEL[a.status] ?? a.status}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Wrap>
  );
}
