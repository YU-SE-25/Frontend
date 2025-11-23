import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Wrapper,
  PageLayout,
  SidebarContainer,
  MainContentContainer,
  TabNav,
  TabButton,
  TabContent,
  SidebarWrapper,
  GroupHeader,
  GroupName,
  GroupDescription,
  MemberListContainer,
  MemberItem,
  SmallButton,
} from "../../theme/StudyGroupDetail.Style";

import ProblemListTab from "./ProblemListTab";
import BoardList from "../board/BoardList";
import ActivityTab from "./ActivityTab";
import CommonModal from "./CommomModal";
import StudyGroupManage from "./StudyGroupManage";

import type { StudyGroupDetail, GroupRole } from "../../api/studygroup_api";
import {
  fetchStudyGroupDetail,
  leaveStudyGroup,
} from "../../api/studygroup_api";

export default function StudyGroupDetailPage() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const numericId = Number(groupId);

  // 그룹 상세 데이터
  const [group, setGroup] = useState<StudyGroupDetail | null>(null);
  const [role, setRole] = useState<GroupRole>("NONE");

  // 탭 상태
  const [activeTab, setActiveTab] = useState<
    "problem" | "discussion" | "activity"
  >("problem");

  // 모달 상태
  const [showManageModal, setShowManageModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // 그룹 상세 정보 불러오기
  useEffect(() => {
    const load = async () => {
      const detail = await fetchStudyGroupDetail(numericId);
      setGroup(detail);
      setRole(detail.myRole);
    };
    load();
  }, [numericId]);

  // 탈퇴 처리
  const handleLeaveGroup = async () => {
    await leaveStudyGroup(numericId);
    alert("그룹에서 탈퇴했습니다.");
    navigate("/studygroup");
  };

  // 로딩 중
  if (!group) return <div>Loading...</div>;

  return (
    <Wrapper>
      <PageLayout>
        {/* 왼쪽 사이드바 */}
        <SidebarContainer>
          <SidebarWrapper>
            <GroupHeader>
              <GroupName>{group.groupName}</GroupName>
            </GroupHeader>

            <GroupDescription>{group.groupDescription}</GroupDescription>

            {/* 멤버들 */}
            <MemberListContainer>
              <h3>
                멤버 ({group.currentMembers}/{group.maxMembers})
              </h3>

              {group.members.map((m) => (
                <MemberItem
                  key={m.groupMemberId}
                  isLeader={m.role === "LEADER"}
                  isSelf={false} // 필요하면 여기서 본인 ID 비교 넣어도 됨
                >
                  {m.role === "LEADER" ? `그룹장: ${m.userName}` : m.userName}
                </MemberItem>
              ))}
            </MemberListContainer>

            {/* 리더 전용 */}
            {role === "LEADER" && (
              <SmallButton onClick={() => setShowManageModal(true)}>
                그룹 관리
              </SmallButton>
            )}

            {/* 멤버 전용 */}
            {role === "MEMBER" && (
              <SmallButton $isDanger onClick={() => setShowLeaveModal(true)}>
                그룹 탈퇴
              </SmallButton>
            )}
          </SidebarWrapper>
        </SidebarContainer>

        {/* 오른쪽 콘텐츠 영역 */}
        <MainContentContainer>
          <TabNav>
            <TabButton
              isActive={activeTab === "problem"}
              onClick={() => setActiveTab("problem")}
            >
              문제 목록
            </TabButton>

            <TabButton
              isActive={activeTab === "discussion"}
              onClick={() => setActiveTab("discussion")}
            >
              토론 게시판
            </TabButton>

            <TabButton
              isActive={activeTab === "activity"}
              onClick={() => setActiveTab("activity")}
            >
              활동 기록
            </TabButton>
          </TabNav>

          <TabContent>
            {activeTab === "problem" && (
              <ProblemListTab role={role} groupId={group.groupId} />
            )}
            {activeTab === "discussion" && (
              <BoardList mode="study" groupId={group.groupId} />
            )}
            {activeTab === "activity" && (
              <ActivityTab groupId={group.groupId} />
            )}
          </TabContent>
        </MainContentContainer>
      </PageLayout>

      {/* 그룹장 관리 모달 */}
      {role === "LEADER" && showManageModal && (
        <StudyGroupManage
          group={group}
          onClose={() => setShowManageModal(false)}
        />
      )}

      {/* 멤버 탈퇴 모달 */}
      {role === "MEMBER" && showLeaveModal && (
        <CommonModal
          title="정말 그룹에서 탈퇴하시겠습니까?"
          message="탈퇴하면 다시 가입해야 합니다."
          dangerText="탈퇴하기"
          cancelText="취소"
          onConfirm={handleLeaveGroup}
          onCancel={() => setShowLeaveModal(false)}
        />
      )}
    </Wrapper>
  );
}
