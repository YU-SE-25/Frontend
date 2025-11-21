import React from "react";
import {
  SidebarWrapper,
  GroupHeader,
  GroupName,
  GroupDescription,
  GoalContainer,
  MemberListContainer,
  MemberItem,
  SmallButton,
} from "../../theme/StudyGroupDetail.Style";
import type { StudyGroup, GroupRole } from "../../api/studygroup_api";

interface Props {
  group: StudyGroup;
  role: GroupRole | undefined;
  setRole: React.Dispatch<React.SetStateAction<GroupRole | undefined>>;
  setActiveTab: React.Dispatch<
    React.SetStateAction<"problem" | "discussion" | "activity">
  >;
  onOpenManageModal: () => void;
  onOpenLeaveModal: () => void;
}

//임시 멤버 이름 생성 함수(추후 백엔드 api 대체)
const getMemberInfo = (id: number, leaderId: number, leaderName: string) => {
  let name: string;
  const isLeader = id === leaderId;
  const isSelf = id === 12345; // 임시 본인 ID

  if (isLeader) {
    name = leaderName || `그룹장: ID ${id}`;
  } else if (isSelf) {
    name = "본인";
  } else {
    const dummyNames = ["멤버1", "멤버2", "멤버3", "멤버4", "멤버5"];
    name = dummyNames[id % dummyNames.length] + ` (ID ${id})`;
  }

  return { name, isLeader, isSelf };
};

export default function StudyGroupSidebar({
  group,
  role,
  setRole,
  setActiveTab,
  onOpenManageModal,
  onOpenLeaveModal,
}: Props) {
  const currentMemberCount = group.groupmember_id.length;
  const maxMembers = group.max_members;

  // 멤버 정렬: 그룹장 → 본인 → 그 외
  const sortedMemberIds = [...group.groupmember_id].sort((a, b) => {
    const aIsLeader = a === group.group_leader;
    const bIsLeader = b === group.group_leader;
    const aIsSelf = a === 12345;
    const bIsSelf = b === 12345;

    if (aIsLeader && !bIsLeader) return -1;
    if (!aIsLeader && bIsLeader) return 1;
    if (aIsSelf && !bIsSelf) return -1;
    if (!aIsSelf && bIsSelf) return 1;
    return 0;
  });

  return (
    <SidebarWrapper>
      <GroupHeader>
        <GroupName>{group.group_name}</GroupName>
      </GroupHeader>

      <GroupDescription>{group.group_description}</GroupDescription>

      <GoalContainer>
        <h3>현재 목표</h3>
        {group.group_goal}
      </GoalContainer>

      <MemberListContainer>
        <h3>
          멤버 ({currentMemberCount}/{maxMembers})
        </h3>

        {sortedMemberIds.map((id) => {
          const { name, isLeader, isSelf } = getMemberInfo(
            id,
            group.group_leader,
            group.leader_name || ""
          );

          return (
            <MemberItem key={id} isLeader={isLeader} isSelf={isSelf}>
              {isLeader ? `그룹장: ${name}` : name}
            </MemberItem>
          );
        })}
      </MemberListContainer>

      {role === "LEADER" && (
        <SmallButton onClick={onOpenManageModal}>그룹 관리</SmallButton>
      )}

      {/* 멤버 전용 버튼 */}
      {role === "MEMBER" && (
        <SmallButton $isDanger onClick={onOpenLeaveModal}>
          그룹 탈퇴
        </SmallButton>
      )}
    </SidebarWrapper>
  );
}
