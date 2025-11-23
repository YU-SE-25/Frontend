import { useState } from "react";
import {
  ModalOverlay,
  ModalContent,
  Label,
  InputField,
  TextAreaField,
  ButtonContainer,
  SecondaryButton,
  PrimaryButton,
  DangerButton,
  ModalTitle,
  ModalSubTitle,
  MemberRow,
} from "../../theme/StudyGroupMain.Style";

import CommonModal from "./CommomModal";
import type { StudyGroupDetail } from "../../api/studygroup_api";
import {
  kickMember,
  deleteStudyGroup,
  updateStudyGroup,
} from "../../api/studygroup_api";

interface Props {
  group: StudyGroupDetail;
  onClose: () => void;
}

export default function StudyGroupManageModal({ group, onClose }: Props) {
  const [name, setName] = useState(group.groupName);
  const [desc, setDesc] = useState(group.groupDescription);
  const [maxMembers, setMaxMembers] = useState(group.maxMembers);
  const [kickTarget, setKickTarget] = useState<number | null>(null);
  const [showKickModal, setShowKickModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleKick = async () => {
    if (kickTarget === null) return;

    await kickMember(group.groupId, kickTarget);
    alert("멤버가 강퇴되었습니다!");

    setShowKickModal(false);
  };

  const handleDeleteGroup = async () => {
    await deleteStudyGroup(group.groupId);
    alert("그룹이 삭제되었습니다!");
    setShowDeleteModal(false);
    onClose();
  };

  const handleSave = async () => {
    await updateStudyGroup(group.groupId, {
      groupName: name,
      groupDescription: desc,
      maxMembers: maxMembers,
    });

    alert("그룹 정보가 수정되었습니다!");
    onClose();
  };

  const isOnlyLeader =
    group.members.length === 1 && group.members[0].role === "LEADER";

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>그룹 관리</ModalTitle>

        <Label>그룹명</Label>
        <InputField value={name} onChange={(e) => setName(e.target.value)} />

        <Label>설명</Label>
        <TextAreaField value={desc} onChange={(e) => setDesc(e.target.value)} />

        <Label>정원</Label>
        <InputField
          type="number"
          value={maxMembers}
          onChange={(e) => setMaxMembers(Number(e.target.value))}
        />

        <ModalSubTitle>멤버 관리</ModalSubTitle>

        {group.members.map((m) => (
          <MemberRow key={m.groupMemberId}>
            <span>
              {m.userName} {m.role === "LEADER" && "(그룹장)"}
            </span>

            {m.role !== "LEADER" && (
              <DangerButton
                onClick={() => {
                  setKickTarget(m.groupMemberId);
                  setShowKickModal(true);
                }}
              >
                강퇴하기
              </DangerButton>
            )}
          </MemberRow>
        ))}

        {isOnlyLeader && (
          <DangerButton
            style={{ width: "100%", marginTop: 20 }}
            onClick={() => setShowDeleteModal(true)}
          >
            그룹 삭제하기
          </DangerButton>
        )}

        <ButtonContainer>
          <SecondaryButton onClick={onClose}>닫기</SecondaryButton>
          <PrimaryButton onClick={handleSave}>저장</PrimaryButton>
        </ButtonContainer>

        {showKickModal && (
          <CommonModal
            title="멤버 강퇴"
            message="정말 이 멤버를 강퇴하시겠습니까?"
            dangerText="강퇴하기"
            onConfirm={handleKick}
            onCancel={() => setShowKickModal(false)}
          />
        )}

        {showDeleteModal && (
          <CommonModal
            title="그룹 삭제"
            message="정말 그룹을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
            dangerText="삭제하기"
            onConfirm={handleDeleteGroup}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </ModalContent>
    </ModalOverlay>
  );
}
