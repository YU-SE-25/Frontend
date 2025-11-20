import React, { useState } from "react";
import {
  ModalOverlay,
  ModalContent,
  CloseButton,
  FormRow,
  Label,
  InputField,
  TextAreaField,
  ButtonContainer,
  AddButton,
  CancelButton,
} from "../../theme/StudyGroupMain.Style";

import type { GroupCreatePayload } from "../../api/studygroup_api";
import { DUMMY_GROUPS } from "../../api/dummy/studygroup_dummy";

interface Props {
  onClose: () => void;
}

export default function CreateStudyGroup({ onClose }: Props) {
  const [groupName, setGroupName] = useState("");
  const [groupGoal, setGroupGoal] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(10);
  const [error, setError] = useState("");

  //그룹명 중복 여부 체크 (더미 기준)
  const isDuplicateName = (name: string) => {
    return DUMMY_GROUPS.some((g) => g.group_name.trim() === name.trim());
  };

  //생성 처리
  const handleSubmit = () => {
    setError("");

    // 필수 검사
    if (!groupName.trim() || !groupGoal.trim()) {
      setError("필수 입력 값을 작성해주세요.");
      return;
    }

    // 중복 검사
    if (isDuplicateName(groupName)) {
      setError("이미 존재하는 그룹명입니다.");
      return;
    }

    const payload: GroupCreatePayload = {
      group_name: groupName.trim(),
      group_goal: groupGoal.trim(),
      group_description: groupDescription.trim(),
      max_members: maxMembers,
    };

    console.log("생성 요청 payload:", payload);

    //실제 API 연동 전까지 FE 더미 시뮬레이션
    setTimeout(() => {
      alert("스터디 그룹이 성공적으로 생성되었습니다!");
      onClose();
    }, 500);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>

        <h2>스터디 그룹 생성</h2>

        <FormRow>
          <Label>그룹명 *</Label>
          <InputField
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="예: 알고리즘 뽀개기"
          />
        </FormRow>

        <FormRow>
          <Label>그룹 목표 *</Label>
          <InputField
            value={groupGoal}
            onChange={(e) => setGroupGoal(e.target.value)}
            placeholder="예: 백준 골드 달성"
          />
        </FormRow>

        <FormRow>
          <Label>그룹 설명</Label>
          <TextAreaField
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            placeholder="그룹에 대한 소개를 입력하세요."
          />
        </FormRow>

        <FormRow>
          <Label>최대 인원 *</Label>
          <InputField
            type="number"
            min={1}
            max={50}
            value={maxMembers}
            onChange={(e) => setMaxMembers(Number(e.target.value))}
          />
        </FormRow>

        {error && (
          <p style={{ color: "red", marginTop: -10, marginBottom: 10 }}>
            {error}
          </p>
        )}

        <ButtonContainer>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <AddButton onClick={handleSubmit}>생성하기</AddButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}
