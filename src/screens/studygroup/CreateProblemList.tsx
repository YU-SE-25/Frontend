import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  InputField,
  ButtonContainer,
  PrimaryButton,
  SecondaryButton,
  ProblemListAddButton,
} from "../../theme/StudyGroupMain.Style";

import {
  PLWrapper,
  PLRow,
  PLLabel,
  ProblemListBox,
  ProblemItem,
  RemoveButton,
} from "../../theme/StudyGroupDetail.Style";
import ProblemSearch from "./ProblemSearch";
import type { SimpleProblem } from "../../api/studygroup_api";

import { useState } from "react";

interface Props {
  onClose: () => void;
}

export default function ProblemListCreateModal({ onClose }: Props) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [problems, setProblems] = useState<SimpleProblem[]>([]);

  //문제 검색 모달 ON/OFF
  const [showSearchModal, setShowSearchModal] = useState(false);

  // 문제 선택 시 리스트 추가하는 함수
  const handleSelectProblem = (p: SimpleProblem) => {
    setProblems((prev) => [...prev, p]);
    setShowSearchModal(false);
  };

  const handleSearchModalOpen = () => {
    setShowSearchModal(true);
  };

  /*문제 리스트 생성 (임시) */
  const handleCreate = () => {
    alert("문제 리스트 생성!");
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>문제 리스트 생성</ModalTitle>

        <PLWrapper>
          <PLRow>
            <PLLabel>목록명</PLLabel>
            <InputField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 이번주 문제"
            />
          </PLRow>

          <PLRow>
            <PLLabel>문제 추가</PLLabel>
            <ProblemListAddButton onClick={handleSearchModalOpen}>
              문제 찾기
            </ProblemListAddButton>
          </PLRow>

          {problems.length > 0 && (
            <PLRow>
              <PLLabel>선택한 문제들</PLLabel>

              <ProblemListBox>
                {problems.map((p) => (
                  <ProblemItem key={p.problemId}>
                    {p.problemTitle}
                    <RemoveButton
                      onClick={() =>
                        setProblems((prev) =>
                          prev.filter((x) => x.problemId !== p.problemId)
                        )
                      }
                    >
                      X
                    </RemoveButton>
                  </ProblemItem>
                ))}
              </ProblemListBox>
            </PLRow>
          )}

          <PLRow>
            <PLLabel>마감일</PLLabel>
            <InputField
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </PLRow>

          <ButtonContainer>
            <SecondaryButton onClick={onClose}>닫기</SecondaryButton>
            <PrimaryButton onClick={handleCreate}>생성하기</PrimaryButton>
          </ButtonContainer>
        </PLWrapper>
        {showSearchModal && (
          <ProblemSearch
            onClose={() => setShowSearchModal(false)}
            onSelectProblem={handleSelectProblem}
          />
        )}
      </ModalContent>
    </ModalOverlay>
  );
}
