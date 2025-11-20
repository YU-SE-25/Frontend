import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateStudyGroup from "./StudyGroupCreate";
import {
  Wrapper,
  HeaderContainer,
  SectionContainer,
  MyGroupSection,
  GroupGrid,
  MyGroupCard,
  GroupCard,
  ControlBar,
  SearchInput,
  AddButton,
  CardHeader,
  GroupLeader,
  CardTags,
  JoinButton,
  EmptyMessage,
  CardText,
  CardStrong,
  ModalOverlay,
  ModalContent,
  ButtonContainer,
  CancelButton,
  CloseButton,
} from "../../theme/StudyGroupMain.Style";
//import type { StudyGroup } from "../../api/studygroup_api";
import { DUMMY_GROUPS, MY_GROUPS } from "../../api/dummy/studygroup_dummy";

export default function StudyGroupListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  // 내 소속 스터디 그룹을 상태로 관리 (가입 후 UI 갱신용)
  const [myGroups, setMyGroups] = useState<typeof MY_GROUPS>(MY_GROUPS);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<
    (typeof DUMMY_GROUPS)[number] | null
  >(null);

  //검색 필터링
  const filteredGroups = useMemo(() => {
    const lowered = searchTerm.toLowerCase();
    if (!lowered) return DUMMY_GROUPS;

    return DUMMY_GROUPS.filter((group) =>
      group.group_name.toLowerCase().includes(lowered)
    );
  }, [searchTerm]);

  //내가 가입한 그룹 ID 집합 (상세 화면 접근 가능 여부 판단용)
  const myGroupIds = useMemo(
    () => new Set(myGroups.map((g) => g.group_id)),
    [myGroups]
  );

  //그룹 카드 클릭
  const handleGroupClick = (groupId: number) => {
    if (myGroupIds.has(groupId)) {
      // 이미 가입된 그룹 → 바로 상세 페이지로 이동
      navigate(`/studygroup/${groupId}`);
      return;
    }

    // 아직 가입 안 한 그룹 → 가입 확인 팝업
    const target = DUMMY_GROUPS.find((g) => g.group_id === groupId);
    if (!target) return;

    setSelectedGroup(target);
    setShowJoinModal(true);
  };

  //가입 팝업에서 "예" 눌렀을 때 동작 (FE 더미 기준)
  const handleConfirmJoin = () => {
    if (!selectedGroup) return;

    // 이미 myGroups에 있는지 확인 후 없으면 추가
    setMyGroups((prev) => {
      if (prev.some((g) => g.group_id === selectedGroup.group_id)) {
        return prev;
      }
      return [...prev, selectedGroup];
    });

    setShowJoinModal(false);
    navigate(`/studygroup/${selectedGroup.group_id}`);
  };

  return (
    <Wrapper>
      <HeaderContainer>
        <div>
          <h1>스터디 그룹</h1>
          <p>함께 공부하고 성장할 스터디 그룹을 찾아보세요.</p>
        </div>
        <AddButton onClick={() => setShowCreateModal(true)}>
          + 스터디 그룹 생성
        </AddButton>
      </HeaderContainer>

      <MyGroupSection>
        <h2>나의 소속 스터디 그룹</h2>
        <GroupGrid>
          {myGroups.length > 0 ? (
            myGroups.map((group) => (
              <MyGroupCard
                key={group.group_id}
                onClick={() => handleGroupClick(group.group_id)} // ⭐ 클릭 시 접근 제어
              >
                <CardHeader>
                  <h3>{group.group_name}</h3>
                  <p>{new Date(group.created_at).toLocaleDateString()}</p>
                </CardHeader>
                <GroupLeader>그룹장: {group.leader_name}</GroupLeader>
                <p>{group.group_description}</p>

                <>
                  <CardText>
                    <CardStrong>목표:</CardStrong> {group.group_goal}
                  </CardText>

                  <CardText>
                    <CardStrong>정원:</CardStrong> {group.groupmember_id.length}
                    /{group.max_members}
                  </CardText>
                </>

                <CardTags>
                  <span>{group.myRole === "LEADER" ? "리더" : "멤버"}</span>
                </CardTags>
                <JoinButton>입장하기</JoinButton>
              </MyGroupCard>
            ))
          ) : (
            <EmptyMessage>소속된 스터디 그룹이 없습니다.</EmptyMessage>
          )}
        </GroupGrid>
      </MyGroupSection>

      <SectionContainer>
        <h2>전체 스터디 그룹 목록</h2>

        <ControlBar>
          <SearchInput
            placeholder="그룹명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </ControlBar>

        <GroupGrid>
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <GroupCard
                key={group.group_id}
                onClick={() => handleGroupClick(group.group_id)} // ⭐ 클릭 시 접근 제어
              >
                <CardHeader>
                  <h3>{group.group_name}</h3>
                  <p>{new Date(group.created_at).toLocaleDateString()}</p>
                </CardHeader>
                <GroupLeader>그룹장: {group.leader_name}</GroupLeader>
                <p>{group.group_description}</p>
                <p>
                  <strong>목표:</strong> {group.group_goal}
                </p>
                <p>
                  <strong>정원:</strong> {group.groupmember_id.length}/
                  {group.max_members}
                </p>
                <JoinButton>
                  {myGroupIds.has(group.group_id) ? "입장하기" : "가입하기"}
                </JoinButton>
              </GroupCard>
            ))
          ) : (
            <EmptyMessage>조건에 맞는 스터디 그룹이 없습니다.</EmptyMessage>
          )}
        </GroupGrid>
      </SectionContainer>

      {showCreateModal && (
        <CreateStudyGroup onClose={() => setShowCreateModal(false)} />
      )}

      {showJoinModal && selectedGroup && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setShowJoinModal(false)}>×</CloseButton>
            <h2>스터디 그룹 가입</h2>
            <p>
              <strong>{selectedGroup.group_name}</strong> 그룹에
              가입하시겠습니까?
            </p>
            <p>
              현재 인원: {selectedGroup.groupmember_id.length} /{" "}
              {selectedGroup.max_members}
            </p>

            <ButtonContainer>
              <CancelButton onClick={() => setShowJoinModal(false)}>
                아니오
              </CancelButton>
              <AddButton onClick={handleConfirmJoin}>예, 가입하기</AddButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  );
}
