import React, { useState, useMemo } from "react";
import styled from "styled-components";
import type { SimpleProblem } from "../../api/studygroup_api";
import { DUMMY_PROBLEMS } from "../../api/dummy/studygroup_dummy";

interface Props {
  onClose: () => void;
  onSelectProblem: (problem: SimpleProblem) => void;
}

export default function ProblemSearchModal({
  onClose,
  onSelectProblem,
}: Props) {
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    const lower = keyword.toLowerCase();
    return DUMMY_PROBLEMS.filter((p) =>
      p.problemTitle.toLowerCase().includes(lower)
    );
  }, [keyword]);

  return (
    <Overlay>
      <Modal>
        <Header>
          <h2>문제 찾기</h2>
          <Close onClick={onClose}>×</Close>
        </Header>

        <SearchInput
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="문제 제목 검색"
        />

        <List>
          {filtered.map((p) => (
            <Item key={p.problemId} onClick={() => onSelectProblem(p)}>
              {p.problemId}. {p.problemTitle}
            </Item>
          ))}
        </List>
      </Modal>
    </Overlay>
  );
}

/* 스타일 */
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  padding: 25px;
  border-radius: 14px;
  width: 90%;
  max-width: 450px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Close = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 15px 0;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.authHoverBgColor};
`;

const List = styled.div`
  max-height: 350px;
  overflow-y: auto;
  color: ${({ theme }) => theme.textColor};
`;

const Item = styled.div`
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.authHoverBgColor};
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};

  &:hover {
    background: ${({ theme }) => theme.authHoverBgColor};
  }
`;
