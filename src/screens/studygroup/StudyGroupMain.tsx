import React, { useMemo, useState, useEffect } from "react";
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

import {
  fetchStudyGroups,
  joinStudyGroup,
  type StudyGroup,
} from "../../api/studygroup_api";

export default function StudyGroupListPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  //초기 데이터 로딩
  const reloadGroups = async () => {
    const all = await fetchStudyGroups();

    setGroups(all);

    const mine = all.filter(
      (g) => g.myRole === "LEADER" || g.myRole === "MEMBER"
    );
    setMyGroups(mine);
  };

  useEffect(() => {
    reloadGroups();
  }, []);

  // 검색 필터
  const filteredGroups = useMemo(() => {
    const lowered = searchTerm.toLowerCase();
    return lowered
      ? groups.filter((g) => g.groupName.toLowerCase().includes(lowered))
      : groups;
  }, [searchTerm, groups]);

  // 내가 가입한 그룹 id set
  const myGroupIds = useMemo(
    () => new Set(myGroups.map((g) => g.groupId)),
    [myGroups]
  );

  // 그룹 카드 클릭 시
  const handleGroupClick = (groupId: number) => {
    if (myGroupIds.has(groupId)) {
      navigate(`/studygroup/${groupId}`);
      return;
    }

    const target = groups.find((g) => g.groupId === groupId);
    if (!target) return;

    setSelectedGroup(target);
    setShowJoinModal(true);
  };

  // "예, 가입하기"
  const handleConfirmJoin = async () => {
    if (!selectedGroup) return;
    await joinStudyGroup(selectedGroup.groupId);
    setMyGroups((prev) => [...prev, selectedGroup]);

    setShowJoinModal(false);
    navigate(`/studygroup/${selectedGroup.groupId}`);
  };

  //스터디 그룹 생성 완료 콜백
  const handleCreated = async () => {
    await reloadGroups(); // 데이터 다시 불러오기
    setShowCreateModal(false); // 모달 닫기
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
                key={group.groupId}
                onClick={() => handleGroupClick(group.groupId)}
              >
                <CardHeader>
                  <h3>{group.groupName}</h3>
                </CardHeader>

                <GroupLeader>그룹장: {group.leaderName}</GroupLeader>
                <p>{group.groupDescription}</p>

                <CardText>
                  <CardStrong>정원:</CardStrong> {group.currentMembers}/
                  {group.maxMembers}
                </CardText>

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
                key={group.groupId}
                onClick={() => handleGroupClick(group.groupId)}
              >
                <CardHeader>
                  <h3>{group.groupName}</h3>
                </CardHeader>

                <GroupLeader>그룹장: {group.leaderName ?? "미정"}</GroupLeader>

                <p>{group.groupDescription}</p>

                <p>
                  <strong>정원:</strong> {group.currentMembers}/
                  {group.maxMembers}
                </p>

                <JoinButton>
                  {myGroupIds.has(group.groupId) ? "입장하기" : "가입하기"}
                </JoinButton>
              </GroupCard>
            ))
          ) : (
            <EmptyMessage>조건에 맞는 스터디 그룹이 없습니다.</EmptyMessage>
          )}
        </GroupGrid>
      </SectionContainer>

      {/* 생성 모달 */}
      {showCreateModal && (
        <CreateStudyGroup
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      )}

      {/* 가입 모달 */}
      {showJoinModal && selectedGroup && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setShowJoinModal(false)}>×</CloseButton>
            <h2>스터디 그룹 가입</h2>

            <p>
              <strong>{selectedGroup.groupName}</strong> 그룹에
              가입하시겠습니까?
            </p>

            <p>
              현재 인원: {selectedGroup.currentMembers}/
              {selectedGroup.maxMembers}
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
