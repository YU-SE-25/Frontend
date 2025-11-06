import React from "react";
import {
  SidebarWrapper,
  GroupHeader,
  GroupName,
  EditButton,
  TagContainer,
  TagChip,
  GroupDescription,
  GoalContainer,
  MemberListContainer,
  MemberItem,
  SmallButton,
} from "../../theme/StudyGroupDetail.Style";
import type { StudyGroup } from "../../api/studygroup_api";
import { DUMMY_TAGS } from "../../api/dummy/studygroupdetail_dummy";

interface Props {
  group: StudyGroup;
}

// 💡 임시 멤버 이름을 생성하는 함수 (실제로는 백엔드에서 받아야 함)
const getMemberInfo = (id: number, leaderId: number, leaderName: string) => {
  let name: string;
  let isLeader = id === leaderId;
  let isSelf = id === 12345; // 💡 임시 '본인' ID

  if (isLeader) {
    name = leaderName || `그룹장: ID ${id}`;
  } else if (isSelf) {
    name = "본인";
  } else {
    // 임시 닉네임 목록을 사용하여 다른 멤버들에게 닉네임을 할당
    const dummyNames = ["멤버1", "멤버2", "멤버3", "멤버4", "멤버5"];
    // id를 기반으로 고정된 더미 이름을 할당 (간단한 해싱)
    name = dummyNames[id % dummyNames.length] + ` (ID ${id})`;
  }

  return { name, isLeader, isSelf };
};

export default function GroupInfoSidebar({ group }: Props) {
  //현재 멤버 수와 최대 인원수 계산
  const currentMemberCount = group.groupmember_id.length;
  const maxMembers = group.max_members;

  // 멤버 리스트를 그룹장, 본인 순으로 정렬하는 로직 (FE 임시 구현)
  const sortedMemberIds = [...group.groupmember_id].sort((a, b) => {
    const aIsLeader = a === group.group_leader;
    const bIsLeader = b === group.group_leader;
    const aIsSelf = a === 12345;
    const bIsSelf = b === 12345;

    // 그룹장이 최상단
    if (aIsLeader && !bIsLeader) return -1;
    if (!aIsLeader && bIsLeader) return 1;

    // 그룹장 다음으로 본인
    if (aIsSelf && !bIsSelf) return -1;
    if (!aIsSelf && bIsSelf) return 1;

    return 0;
  });

  return (
    <SidebarWrapper>
      <GroupHeader>
        <GroupName>{group.group_name}</GroupName>
        <EditButton>수정</EditButton>
      </GroupHeader>

      <TagContainer>
        {DUMMY_TAGS.map((tag) => (
          <TagChip key={tag}>#{tag}</TagChip>
        ))}
      </TagContainer>

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

      <SmallButton>그룹 관리</SmallButton>
      <SmallButton $isDanger>그룹 탈퇴</SmallButton>
    </SidebarWrapper>
  );
}
