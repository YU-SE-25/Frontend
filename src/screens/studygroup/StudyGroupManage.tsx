import { useState } from "react";
import {
  ModalOverlay,
  ModalContent,
  Label,
  InputField,
  ButtonContainer,
  CancelButton,
  SaveButton,
} from "../../theme/StudyGroupMain.Style";

export default function StudyGroupManageModal({
  group,
  onClose,
}: {
  group: StudyGroup;
  onClose: () => void;
}) {
  const [name, setName] = useState(group.group_name);
  const [goal, setGoal] = useState(group.group_goal);
  const [desc, setDesc] = useState(group.group_description);
  const [maxMembers, setMaxMembers] = useState(group.max_members);

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>그룹 관리</h2>

        <Label>그룹명</Label>
        <InputField value={name} onChange={(e) => setName(e.target.value)} />

        <Label>목표</Label>
        <InputField value={goal} onChange={(e) => setGoal(e.target.value)} />

        <Label>설명</Label>
        <InputField value={desc} onChange={(e) => setDesc(e.target.value)} />

        <Label>정원</Label>
        <InputField
          type="number"
          value={maxMembers}
          onChange={(e) => setMaxMembers(Number(e.target.value))}
        />

        <ButtonContainer>
          <CancelButton onClick={onClose}>닫기</CancelButton>
          <SaveButton onClick={() => alert("저장은 나중에 API로 연결!")}>
            저장
          </SaveButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}
