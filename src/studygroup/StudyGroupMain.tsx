import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  TagDisplayContainer,
  TagChip,
} from "../theme/StudyGroupMain.Style";

interface Group {
  id: number;
  name: string;
  leader: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  createdAt: string;
  goal: string;
  tags: string[];
}

const MY_GROUPS: Group[] = [
  {
    id: 1,
    name: "알고리즘 뽀개기",
    leader: "유진",
    description: "DP와 그래프 알고리즘 스터디입니다.",
    memberCount: 8,
    maxMembers: 10,
    createdAt: "2025-01-01",
    goal: "프로그래머스 4단계 완료",
    tags: ["DP", "BFS", "심화"],
  },
];

const DUMMY_GROUPS: Group[] = [
  MY_GROUPS[0],
  {
    id: 2,
    name: "C++ 문법 마스터",
    leader: "민수",
    description: "C++ 기초부터 심화까지 다룹니다.",
    memberCount: 5,
    maxMembers: 10,
    createdAt: "2025-03-15",
    goal: "문법 완벽 이해",
    tags: ["C++", "기초"],
  },
  {
    id: 3,
    name: "코테 입문 준비반",
    leader: "지훈",
    description: "취업을 위한 코딩 테스트 입문반입니다.",
    memberCount: 7,
    maxMembers: 8,
    createdAt: "2025-05-20",
    goal: "백준 150문제 해결",
    tags: ["구현", "기초"],
  },
];

const availableTags = ["C++", "DP", "BFS", "심화", "기초", "구현"];

export default function StudyGroupListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredGroups = useMemo(() => {
    let list = DUMMY_GROUPS.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedTags.length > 0) {
      list = list.filter((group) =>
        selectedTags.every((tag) => group.tags.includes(tag))
      );
    }
    return list;
  }, [searchTerm, selectedTags]);

  const handleGroupClick = (groupId: number) =>
    navigate(`/studygroup/${groupId}`);

  return (
    <Wrapper>
      <HeaderContainer>
        <div>
          <h1>스터디 그룹</h1>
          <p>함께 공부하고 성장할 스터디 그룹을 찾아보세요.</p>
        </div>
        <AddButton onClick={() => setShowModal(true)}>
          스터디 그룹 생성
        </AddButton>
      </HeaderContainer>

      <MyGroupSection>
        <h2>나의 소속 스터디 그룹</h2>
        <GroupGrid>
          {MY_GROUPS.length > 0 ? (
            MY_GROUPS.map((group) => (
              <MyGroupCard key={group.id}>
                <CardHeader>
                  <h3>{group.name}</h3>
                  <p>{group.createdAt}</p>
                </CardHeader>
                <GroupLeader>그룹장: {group.leader}</GroupLeader>
                <p>{group.description}</p>
                <p>
                  <strong>목표:</strong> {group.goal}
                </p>
                <p>
                  <strong>정원:</strong> {group.memberCount}/{group.maxMembers}
                </p>
                <CardTags>
                  {group.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </CardTags>
                <JoinButton onClick={() => handleGroupClick(group.id)}>
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
          {/*검색 기능 추후 추가*/}
          <AddButton>검색</AddButton>
          <TagDisplayContainer>
            {availableTags.map((tag) => (
              <TagChip
                key={tag}
                active={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </TagChip>
            ))}
          </TagDisplayContainer>
        </ControlBar>

        <GroupGrid>
          {filteredGroups.map((group) => (
            <GroupCard key={group.id}>
              <CardHeader>
                <h3>{group.name}</h3>
                <p>{group.createdAt}</p>
              </CardHeader>
              <GroupLeader>그룹장: {group.leader}</GroupLeader>
              <p>{group.description}</p>
              <p>
                <strong>목표:</strong> {group.goal}
              </p>
              <p>
                <strong>정원:</strong> {group.memberCount}/{group.maxMembers}
              </p>
              <CardTags>
                {group.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </CardTags>
              <JoinButton onClick={() => handleGroupClick(group.id)}>
                가입하기
              </JoinButton>
            </GroupCard>
          ))}
        </GroupGrid>
        {filteredGroups.length === 0 && (
          <EmptyMessage>검색 결과가 없습니다.</EmptyMessage>
        )}
      </SectionContainer>

      {showModal && <div>{/* StudyGroupCreateModal Placeholder */}</div>}
    </Wrapper>
  );
}
