import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  fetchAdminReports,
  fetchBlacklist,
  resolveReport,
} from "../../../api/manage_api";

/* 타입 정의 */
type Category = "REPORT" | "BLACKLIST";
type Role = "LEARNER" | "INSTRUCTOR" | "MANAGER";
const ROLE_LABEL = { LEARNER: "회원", INSTRUCTOR: "강사", MANAGER: "관리자" };

interface ReportItem {
  id: number;
  target: string; // 신고 대상
  title: string; // 신고 제목
  reporterId: string;
  reporterNickname: string;
  createdAt: string;
  content: string; // 상세 내용
}

interface BlacklistUser {
  id: number;
  userId: string;
  nickname: string;
  role: Role;
  joinedAt: string;
  blacklistedAt: string;
}

/* 더미 데이터 */
const DUMMY_REPORTS: ReportItem[] = [
  {
    id: 1,
    target: "두 수의 합 (문제 ID: P-1001)",
    title: "문제 설명과 입출력이 다릅니다.",
    reporterId: "user01",
    reporterNickname: "버그헌터",
    createdAt: "2025-11-20",
    content:
      "문제 설명에서 예제 입출력과 실제 테스트케이스가 다르게 동작합니다. 설명을 수정하거나 테스트케이스를 맞춰야 할 것 같습니다.",
  },
  {
    id: 2,
    target: "자유게시판 글 (게시글 ID: B-45)",
    title: "욕설 및 비방 신고",
    reporterId: "user02",
    reporterNickname: "불편한진실",
    createdAt: "2025-11-19",
    content:
      "특정 유저를 지칭하며 욕설과 비방이 포함되어 있습니다. 운영 정책 위반으로 보입니다.",
  },
];

/* -----------------------------------------------------
   styled-components (유저 관리 화면과 톤 맞춤)
----------------------------------------------------- */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
`;

const CategoryBar = styled.div`
  display: flex;
  gap: 8px;
`;

const CategoryButton = styled.button<{ $active?: boolean }>`
  padding: 6px 14px;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  cursor: pointer;

  background: ${({ theme, $active }) =>
    $active ? theme.focusColor : theme.bgCardColor};
  color: ${({ theme, $active }) => ($active ? theme.bgColor : theme.textColor)};

  opacity: ${({ $active }) => ($active ? 1 : 0.9)};
  transition: 0.2s ease;

  &:hover {
    opacity: 1;
  }
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

const DetailPanel = styled.div`
  padding: 14px 16px;
  border-radius: 10px;
  background: ${({ theme }) => theme.bgCardColor};
  border: 1px solid ${({ theme }) => theme.bgCardColor};
`;

const DetailTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.textColor};
`;

const DetailMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textColor}99;
  margin-bottom: 8px;
`;

const DetailContent = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  color: ${({ theme }) => theme.textColor};
`;

/* -----------------------------------------------------
   Component Logic
----------------------------------------------------- */

export default function ReportManagementScreen() {
  const [category, setCategory] = useState<Category>("REPORT");
  const [reportList, setReportList] = useState<ReportItem[]>([]);
  const [blacklist, setBlacklist] = useState<BlacklistUser[]>([]);
  const [search, setSearch] = useState("");
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [selectedBlacklistId, setSelectedBlacklistId] = useState<number | null>(
    null
  );

  const isReportCategory = category === "REPORT";
  const isBlacklistCategory = category === "BLACKLIST";

  const selectedReport = useMemo(
    () => reportList.find((r) => r.id === selectedReportId) ?? null,
    [reportList, selectedReportId]
  );

  const selectedBlacklistUser = useMemo(
    () => blacklist.find((u) => u.id === selectedBlacklistId) ?? null,
    [blacklist, selectedBlacklistId]
  );

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetchAdminReports();
        const mapped: ReportItem[] = res.map((item) => ({
          id: item.id,
          title: item.reason,
          target: item.targetName,
          reporterNickname: item.reporterName,
          reporterId: "-", // 백엔드에 따로 아이디가 없으니 일단 표시용
          createdAt: item.reportedAt,
          content: item.reason,
        }));
        setReportList(mapped);
      } catch (e) {
        console.error("신고 목록 조회 실패:", e);
      }
    }

    async function loadBlacklist() {
      try {
        const res = await fetchBlacklist({ page: 0, size: 50 });
        const mapped: BlacklistUser[] = res.blacklist.map((item) => ({
          id: item.blacklistId,
          userId: item.email ?? item.phone ?? String(item.blacklistId),
          nickname: item.name,
          role: "LEARNER",
          joinedAt: "-",
          blacklistedAt: item.bannedAt,
        }));
        setBlacklist(mapped);
      } catch (e) {
        console.error("블랙리스트 조회 실패:", e);
      }
    }

    loadReports();
    loadBlacklist();
  }, []);

  const filteredReports = useMemo(() => {
    if (!search.trim()) return reportList;
    const q = search.toLowerCase();
    return reportList.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.target.toLowerCase().includes(q) ||
        r.reporterNickname.toLowerCase().includes(q) ||
        r.reporterId.toLowerCase().includes(q)
    );
  }, [reportList, search]);

  const filteredBlacklist = useMemo(() => {
    if (!search.trim()) return blacklist;
    const q = search.toLowerCase();
    return blacklist.filter(
      (u) =>
        u.userId.toLowerCase().includes(q) ||
        u.nickname.toLowerCase().includes(q)
    );
  }, [blacklist, search]);

  const handleCategoryChange = (next: Category) => {
    setCategory(next);
    setSearch("");
    setSelectedReportId(null);
    setSelectedBlacklistId(null);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setSelectedReportId(null);
    setSelectedBlacklistId(null);
  };

  const handleSelectRow = (id: number) => {
    if (isReportCategory) {
      setSelectedReportId((prev) => (prev === id ? null : id));
      setSelectedBlacklistId(null);
    } else {
      setSelectedBlacklistId((prev) => (prev === id ? null : id));
      setSelectedReportId(null);
    }
  };

  const handleResolveReport = async () => {
    if (!selectedReport) return;

    if (!window.confirm("해당 신고를 접수(처리 완료)하시겠습니까?")) return;

    const adminReason =
      window.prompt("처리 사유를 입력하세요.", "신고 내용 확인 후 접수 처리") ??
      "";
    if (!adminReason.trim()) return;

    try {
      await resolveReport(selectedReport.id, {
        status: "APPROVED",
        adminAction: "RECEIVE",
        adminReason,
      });

      setReportList((prev) => prev.filter((r) => r.id !== selectedReport.id));
      setSelectedReportId(null);
      alert("신고가 접수되었습니다.");
    } catch (e) {
      console.error("신고 접수 실패:", e);
      alert("신고 접수 중 오류가 발생했습니다.");
    }
  };

  const handleCopyUserInfo = async () => {
    if (!selectedBlacklistUser) return;
    const text = JSON.stringify(selectedBlacklistUser, null, 2);
    await navigator.clipboard.writeText(text);
    alert("유저 정보가 클립보드에 복사되었습니다!");
  };

  const handleUnblacklist = () => {
    if (!selectedBlacklistUser) return;
    if (
      !window.confirm(
        `${selectedBlacklistUser.nickname} (${selectedBlacklistUser.userId}) 의 블랙리스트를 해제할까요?`
      )
    )
      return;
    setBlacklist((prev) =>
      prev.filter((u) => u.id !== selectedBlacklistUser.id)
    );
    setSelectedBlacklistId(null);
  };

  const isReportResolveDisabled = !selectedReport;
  const isInfoDisabled = !selectedBlacklistUser;
  const isUnblacklistDisabled = !selectedBlacklistUser;

  return (
    <Wrap>
      <CategoryBar>
        <CategoryButton
          $active={isReportCategory}
          onClick={() => handleCategoryChange("REPORT")}
        >
          신고 내역
        </CategoryButton>
        <CategoryButton
          $active={isBlacklistCategory}
          onClick={() => handleCategoryChange("BLACKLIST")}
        >
          블랙리스트 내역
        </CategoryButton>
      </CategoryBar>

      <TopBar>
        <SearchInput
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={
            isReportCategory
              ? "신고 대상 / 신고 제목 / 신고자 검색"
              : "유저 아이디 / 닉네임 검색"
          }
        />

        <ButtonGroup>
          {isReportCategory && (
            <ActionButton
              onClick={handleResolveReport}
              disabled={isReportResolveDisabled}
            >
              신고 접수
            </ActionButton>
          )}

          {isBlacklistCategory && (
            <>
              <ActionButton
                onClick={handleCopyUserInfo}
                disabled={isInfoDisabled}
              >
                유저 정보보기
              </ActionButton>
              <ActionButton
                onClick={handleUnblacklist}
                disabled={isUnblacklistDisabled}
              >
                블랙리스트 해제
              </ActionButton>
            </>
          )}
        </ButtonGroup>
      </TopBar>

      <TableWrap>
        <Table>
          <Thead>
            {isReportCategory ? (
              <tr>
                <Th>신고 번호</Th>
                <Th>신고 대상</Th>
                <Th>신고 제목</Th>
                <Th>신고자</Th>
                <Th>신고일</Th>
              </tr>
            ) : (
              <tr>
                <Th>유저 아이디</Th>
                <Th>유저 닉네임</Th>
                <Th>유저 역할</Th>
                <Th>가입 일자</Th>
                <Th>블랙된 일자</Th>
              </tr>
            )}
          </Thead>

          <tbody>
            {isReportCategory &&
              (filteredReports.length === 0 ? (
                <tr>
                  <Td colSpan={5} style={{ textAlign: "center", opacity: 0.5 }}>
                    신고 내역이 없습니다.
                  </Td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <Tr
                    key={r.id}
                    selected={selectedReportId === r.id}
                    onClick={() => handleSelectRow(r.id)}
                  >
                    <Td>{r.id}</Td>
                    <Td>{r.target}</Td>
                    <Td>{r.title}</Td>
                    <Td>
                      {r.reporterNickname} ({r.reporterId})
                    </Td>
                    <Td>{r.createdAt}</Td>
                  </Tr>
                ))
              ))}

            {isBlacklistCategory &&
              (filteredBlacklist.length === 0 ? (
                <tr>
                  <Td colSpan={5} style={{ textAlign: "center", opacity: 0.5 }}>
                    블랙리스트 내역이 없습니다.
                  </Td>
                </tr>
              ) : (
                filteredBlacklist.map((u) => (
                  <Tr
                    key={u.id}
                    selected={selectedBlacklistId === u.id}
                    onClick={() => handleSelectRow(u.id)}
                  >
                    <Td>{u.userId}</Td>
                    <Td>{u.nickname}</Td>
                    <Td>{ROLE_LABEL[u.role]}</Td>
                    <Td>{u.joinedAt}</Td>
                    <Td>{u.blacklistedAt}</Td>
                  </Tr>
                ))
              ))}
          </tbody>
        </Table>
      </TableWrap>

      {isReportCategory && selectedReport && (
        <DetailPanel>
          <DetailTitle>{selectedReport.title}</DetailTitle>
          <DetailMeta>
            신고 대상: {selectedReport.target} · 신고자:{" "}
            {selectedReport.reporterNickname} ({selectedReport.reporterId}) ·
            신고일: {selectedReport.createdAt}
          </DetailMeta>
          <DetailContent>{selectedReport.content}</DetailContent>
        </DetailPanel>
      )}
    </Wrap>
  );
}
