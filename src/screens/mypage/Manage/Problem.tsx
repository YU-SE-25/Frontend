import { useMemo, useState } from "react";
import styled from "styled-components";

/* -----------------------------------------------------
   타입 & 더미 데이터
----------------------------------------------------- */

type Difficulty = "EASY" | "MEDIUM" | "HARD";

interface ProblemItem {
  id: number;
  title: string;
  difficulty: Difficulty;
  author: string;
  createdAt: string;
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  EASY: "쉬움",
  MEDIUM: "보통",
  HARD: "어려움",
};

const DUMMY_PROBLEMS: ProblemItem[] = [
  {
    id: 1,
    title: "두 수의 합",
    difficulty: "EASY",
    author: "gamppe",
    createdAt: "2025-11-20",
  },
  {
    id: 2,
    title: "최단 경로",
    difficulty: "HARD",
    author: "알고장인",
    createdAt: "2025-11-18",
  },
  {
    id: 3,
    title: "괄호 검사",
    difficulty: "MEDIUM",
    author: "자료구조매니아",
    createdAt: "2025-11-10",
  },
];

/* -----------------------------------------------------
   styled-components (유저 관리랑 톤 맞춤)
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
  const [problems, setProblems] = useState<ProblemItem[]>(DUMMY_PROBLEMS);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedProblem = useMemo(
    () => problems.find((p) => p.id === selectedId) ?? null,
    [problems, selectedId]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return problems;
    const q = search.toLowerCase();
    return problems.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        DIFFICULTY_LABEL[p.difficulty].toLowerCase().includes(q)
    );
  }, [problems, search]);

  const isDisabled = !selectedProblem;

  const handleChange = (value: string) => {
    setSearch(value);
    setSelectedId(null);
  };

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleViewDetail = async () => {
    if (!selectedProblem) return;

    const text = JSON.stringify(selectedProblem, null, 2);

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
    // TODO: 실제 다운로드 API 연동 예정
    alert(
      `테스트 케이스 다운로드(추후 구현 예정)\n문제: ${selectedProblem.title}`
    );
  };

  const handleRegisterProblem = () => {
    if (!selectedProblem) return;
    if (
      !window.confirm(
        `"${selectedProblem.title}" 문제를 등록(승인)하고 목록에서 제거할까요?`
      )
    )
      return;

    setProblems((prev) => prev.filter((p) => p.id !== selectedProblem.id));
    setSelectedId(null);
  };

  const handleDeleteProblem = () => {
    if (!selectedProblem) return;
    if (
      !window.confirm(
        `"${selectedProblem.title}" 문제를 정말 삭제하시겠습니까?`
      )
    )
      return;

    setProblems((prev) => prev.filter((p) => p.id !== selectedProblem.id));
    setSelectedId(null);
  };

  return (
    <Wrap>
      {}
      <>
        <TopBar>
          <SearchInput
            value={search}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="문제 제목 / 난이도 / 작성자 검색"
          />

          <ButtonGroup>
            <ActionButton onClick={handleViewDetail} disabled={isDisabled}>
              문제 상세 보기
            </ActionButton>
            <ActionButton
              onClick={handleDownloadTestcase}
              disabled={isDisabled}
            >
              테스트 케이스 다운로드
            </ActionButton>
            <ActionButton onClick={handleRegisterProblem} disabled={isDisabled}>
              문제 등록
            </ActionButton>
            <ActionButton onClick={handleDeleteProblem} disabled={isDisabled}>
              문제 삭제
            </ActionButton>
          </ButtonGroup>
        </TopBar>

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
                  <Td colSpan={4} style={{ textAlign: "center", opacity: 0.5 }}>
                    문제 목록이 없습니다.
                  </Td>
                </tr>
              )}

              {filtered.map((p) => (
                <Tr
                  key={p.id}
                  selected={selectedId === p.id}
                  onClick={() => handleSelect(p.id)}
                >
                  <Td>{p.title}</Td>
                  <Td>{DIFFICULTY_LABEL[p.difficulty]}</Td>
                  <Td>{p.author}</Td>
                  <Td>{p.createdAt}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </>
      <></>
    </Wrap>
  );
}
