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
import type { SimpleProblem } from "../../api/problem_api";

import { useState } from "react";
import { createProblemList } from "../../api/studygroup_api";

interface Props {
  onClose: () => void;
  groupId: number; // 그룹ID 꼭 받아야 함
  onCreated: () => void;
}

export default function ProblemListCreateModal({
  onClose,
  groupId,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [problems, setProblems] = useState<SimpleProblem[]>([]);

  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleSelectProblem = (p: SimpleProblem) => {
    setProblems((prev) => [...prev, p]);
    setShowSearchModal(false);
  };

  const handleSearchModalOpen = () => {
    setShowSearchModal(true);
  };

  //문제 리스트 생성 API 연결
  const handleCreate = async () => {
    if (!title.trim()) {
      alert("목록명을 입력해주세요!");
      return;
    }
    if (!dueDate.trim()) {
      alert("마감일을 선택해주세요!");
      return;
    }
    if (problems.length === 0) {
      alert("문제를 하나 이상 선택해주세요!");
      return;
    }

    try {
      await createProblemList(groupId, {
        listTitle: title,
        dueDate,
        problems: problems.map((p) => p.problemId),
      });

      alert("문제 리스트가 생성되었습니다!");
      onCreated();
      onClose();
    } catch (err) {
      console.error("문제 리스트 생성 실패:", err);
      alert("문제 리스트 생성에 실패했습니다.");
    }
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
