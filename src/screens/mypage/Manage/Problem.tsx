import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { userProfileAtom } from "../../../atoms";
import { useAtomValue } from "jotai";
import {
  approveProblem,
  fetchMyProblems,
  fetchPendingProblemList,
} from "../../../api/manage_api";
import type { ProblemListItem as ProblemItem } from "../../../api/manage_api";
import { fetchProblemDetail, type IProblem } from "../../../api/problem_api";
import { useQuery } from "@tanstack/react-query";
/* -----------------------------------------------------
   타입
----------------------------------------------------- */

type Difficulty = "EASY" | "MEDIUM" | "HARD";

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  EASY: "쉬움",
  MEDIUM: "보통",
  HARD: "어려움",
};

/* -----------------------------------------------------
   styled-components
----------------------------------------------------- */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
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

const SectionTitle = styled.h3`
  margin: 10px 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
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

export default function ProblemManagementScreen() {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPendingId, setSelectedPendingId] = useState<number | null>(
    null
  );
  const [selectedMyId, setSelectedMyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const difficultyLabelMap: Record<Difficulty, string> = {
    EASY: "쉬움",
    MEDIUM: "보통",
    HARD: "어려움",
  };
  const userProfile = useAtomValue(userProfileAtom) ?? {
    nickname: "guest",
    role: "GUEST",
    userId: "0",
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPendingProblemList({ page: 0, size: 100 });
        setProblems(data.content);
      } catch (e) {
        console.error(e);
        alert("문제 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return problems;
    const q = search.toLowerCase();
    return problems.filter((p) => {
      const author = p.createdByNickname ?? "";
      return (
        p.title.toLowerCase().includes(q) ||
        author.toLowerCase().includes(q) ||
        DIFFICULTY_LABEL[p.difficulty].toLowerCase().includes(q)
      );
    });
  }, [problems, search]);

  const { data: myProblemsPage } = useQuery({
    queryKey: ["myProblems"],
    queryFn: () => fetchMyProblems(0, 100), // page, size는 네가 쓰는 값으로
  });

  const filteredMine: IProblem[] = myProblemsPage?.content ?? [];

  const selectedPending = useMemo(
    () => problems.find((p) => p.problemId === selectedPendingId) ?? null,
    [problems, selectedPendingId]
  );

  const selectedMine = useMemo(
    () => problems.find((p) => p.problemId === selectedMyId) ?? null,
    [problems, selectedMyId]
  );

  const selectedProblem = selectedPending ?? selectedMine;

  const { data: selectedProblemDetail } = useQuery({
    queryKey: ["problemDetail", selectedProblem?.problemId],
    queryFn: () => fetchProblemDetail(selectedProblem!.problemId),
    enabled: !!selectedProblem?.problemId,
  });
  const hasSelection = !!selectedProblem;
  const canManageSelected = !!selectedPending && userProfile.role === "MANAGER";

  const handleChange = (value: string) => {
    setSearch(value);
    setSelectedPendingId(null);
    setSelectedMyId(null);
  };

  const handleSelectPending = (problemId: number) => {
    setSelectedPendingId((prev) => (prev === problemId ? null : problemId));
    setSelectedMyId(null);
  };

  const handleSelectMine = (problemId: number) => {
    setSelectedMyId((prev) => (prev === problemId ? null : problemId));
    setSelectedPendingId(null);
  };

  const handleViewDetail = async () => {
    if (!selectedProblem) return;

    const text = JSON.stringify(selectedProblemDetail, null, 2);

    try {
      await navigator.clipboard.writeText(text);
      alert("문제 상세 정보가 클립보드에 복사되었습니다!");
    } catch (e) {
      console.error(e);
      alert("클립보드 복사에 실패했습니다.");
    }
  };

  const handleDownloadTestcase = () => {
    if (!selectedProblem) return;
    alert(
      `테스트 케이스 다운로드(추후 구현 예정)\n문제: ${selectedProblem.title}`
    );
  };

  const handleRegisterProblem = async () => {
    if (!selectedProblem) return;

    if (!window.confirm("이 문제를 승인하시겠습니까?")) return;

    try {
      const res = await approveProblem(selectedProblem.problemId);

      alert(res.message); // "문제가 승인되었습니다."

      // UI에서 제거 (승인 목록에서 빠지도록)
      setProblems((prev) =>
        prev.filter((p) => p.problemId !== selectedProblem.problemId)
      );
      setSelectedPendingId(null);
    } catch (e) {
      console.error("문제 승인 실패:", e);
      alert("문제 승인 중 오류가 발생했습니다.");
    }
  };
  const handleDeleteProblem = () => {
    if (!selectedPending || userProfile.role !== "MANAGER") return;
    if (
      !window.confirm(
        `"${selectedPending.title}" 문제를 정말 삭제하시겠습니까?`
      )
    )
      return;

    setProblems((prev) =>
      prev.filter((p) => p.problemId !== selectedPending.problemId)
    );
    setSelectedPendingId(null);
  };

  if (loading) {
    return (
      <Wrap>
        <div style={{ padding: 16 }}>문제 목록을 불러오는 중입니다...</div>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <TopBar>
        <SearchInput
          value={search}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="문제 제목 / 난이도 / 작성자 검색"
        />

        <ButtonGroup>
          <ActionButton onClick={handleViewDetail} disabled={!hasSelection}>
            문제 상세 보기
          </ActionButton>
          <ActionButton
            onClick={handleDownloadTestcase}
            // disabled={!hasSelection}
            disabled={true}
            title="다운 오류"
          >
            테스트 케이스 다운로드
          </ActionButton>
          <ActionButton
            onClick={handleRegisterProblem}
            disabled={!canManageSelected}
            title={
              !canManageSelected
                ? "문제 등록은 관리자 권한이 필요합니다."
                : undefined
            }
          >
            문제 등록
          </ActionButton>
          <ActionButton
            onClick={handleDeleteProblem}
            disabled={!canManageSelected}
            title={
              !canManageSelected
                ? "문제 삭제는 관리자 권한이 필요합니다."
                : undefined
            }
          >
            문제 삭제
          </ActionButton>
        </ButtonGroup>
      </TopBar>

      {userProfile.role === "MANAGER" && (
        <>
          <SectionTitle>문제 추가 요청</SectionTitle>
          <TableWrap>
            <Table>
              <Thead>
                <tr>
                  <Th>문제 제목</Th>
                  <Th>난이도</Th>
                  <Th>작성자</Th>
                  <Th>작성일</Th>
                </tr>
              </Thead>

              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <Td
                      colSpan={4}
                      style={{ textAlign: "center", opacity: 0.5 }}
                    >
                      문제 목록이 없습니다.
                    </Td>
                  </tr>
                )}

                {filtered.map((p) => (
                  <Tr
                    key={p.problemId}
                    selected={selectedPendingId === p.problemId}
                    onClick={() => handleSelectPending(p.problemId)}
                  >
                    <Td>{p.title}</Td>
                    <Td>{DIFFICULTY_LABEL[p.difficulty]}</Td>
                    <Td>{p.createdByNickname ?? "-"}</Td>
                    <Td>{p.createdAt.split("T")[0]}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        </>
      )}

      <SectionTitle>내가 제출한 문제</SectionTitle>
      <TableWrap>
        <Table>
          <Thead>
            <tr>
              <Th>문제 제목</Th>
              <Th>난이도</Th>
              <Th>작성일</Th>
            </tr>
          </Thead>

          <tbody>
            {filteredMine.length === 0 && (
              <tr>
                <Td colSpan={4} style={{ textAlign: "center", opacity: 0.5 }}>
                  내가 제출한 문제가 없습니다.
                </Td>
              </tr>
            )}

            {filteredMine.map((p) => (
              <Tr
                key={p.problemId}
                selected={selectedMyId === p.problemId}
                onClick={() => handleSelectMine(p.problemId)}
              >
                <Td>{p.title}</Td>
                <Td>{difficultyLabelMap[p.difficulty as Difficulty]}</Td>
                <Td>{p.createdAt.split("T")[0]}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Wrap>
  );
}
