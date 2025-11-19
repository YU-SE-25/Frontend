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
  TagChip,
  TagWrapper,
  CardText,
  CardStrong,
} from "../../theme/StudyGroupMain.Style";
//import type { StudyGroup } from "../../api/studygroup_api";
import {
  DUMMY_GROUPS,
  MY_GROUPS,
  DUMMY_TAGS,
} from "../../api/dummy/studygroup_dummy";

export default function StudyGroupListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  //검색 + 태그 필터링
  const filteredGroups = useMemo(() => {
    let list = DUMMY_GROUPS.filter((group) =>
      group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedTags.length > 0) {
      list = list.filter((group) =>
        selectedTags.every(
          (tag) =>
            group.group_description.includes(tag) ||
            group.group_goal.includes(tag) ||
            group.group_name.includes(tag)
        )
      );
    }

    return list;
  }, [searchTerm, selectedTags]);

  const handleGroupClick = (id: number) => navigate(`/studygroup/${id}`);

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
          {MY_GROUPS.length > 0 ? (
            MY_GROUPS.map((group) => (
              <MyGroupCard key={group.group_id}>
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
                <JoinButton onClick={() => handleGroupClick(group.group_id)}>
                  입장하기
                </JoinButton>
              </MyGroupCard>
            ))
          ) : (
            <EmptyMessage>현재 소속된 스터디 그룹이 없습니다.</EmptyMessage>
          )}
        </GroupGrid>
      </MyGroupSection>

      <SectionContainer>
        <h2>스터디 그룹 살펴보기</h2>

        <ControlBar>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="스터디 그룹명 검색"
          />
          <AddButton>검색</AddButton>
        </ControlBar>

        <TagWrapper>
          {DUMMY_TAGS.map((tag) => (
            <TagChip
              key={tag}
              active={selectedTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </TagChip>
          ))}
        </TagWrapper>

        <GroupGrid>
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <GroupCard key={group.group_id}>
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
                <JoinButton onClick={() => handleGroupClick(group.group_id)}>
                  입장하기
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
    </Wrapper>
  );
}
