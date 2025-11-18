import { useState } from "react";
import {
  ModalOverlay,
  ModalContent,
  FormRow,
  Label,
  ButtonContainer,
  AddButton,
  TagDisplayContainer,
  TagChip,
  StyledInput,
  StyledTextArea,
  CloseButton,
} from "../../theme/StudyGroupMain.Style";
import { DUMMY_TAGS } from "../../api/dummy/studygroup_dummy";

interface StudyGroupCreateProps {
  onClose: () => void;
}

export default function CreateStudyGroup({ onClose }: StudyGroupCreateProps) {
  const [groupName, setGroupName] = useState("");
  const [groupGoal, setGroupGoal] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    const payload = {
      group_name: groupName,
      group_goal: groupGoal,
      group_description: groupDescription,
      max_members: maxMembers,
      tags: selectedTags,
    };
    console.log("생성 요청 payload:", payload);
    // 실제 API 호출 넣으면 됨
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>X</CloseButton>
        <h2>스터디 그룹 생성</h2>

        <FormRow>
          <Label>그룹 이름</Label>
          <StyledInput
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </FormRow>

        <FormRow style={{ flexDirection: "column", alignItems: "stretch" }}>
          <Label>그룹 목표</Label>
          <StyledInput
            value={groupGoal}
            onChange={(e) => setGroupGoal(e.target.value)}
          />
        </FormRow>

        <FormRow>
          <Label>그룹 설명</Label>
          <StyledTextArea
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
        </FormRow>

        <FormRow>
          <Label>최대 인원</Label>
          <StyledInput
            type="number"
            value={maxMembers}
            onChange={(e) => setMaxMembers(Number(e.target.value))}
            min={2}
            max={20}
          />
        </FormRow>

        <FormRow>
          <Label>태그 선택</Label>
          <TagDisplayContainer>
            {DUMMY_TAGS.map((tag) => (
              <TagChip
                key={tag}
                active={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </TagChip>
            ))}
          </TagDisplayContainer>
        </FormRow>

        <ButtonContainer>
          <AddButton onClick={handleSubmit}>생성</AddButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}
