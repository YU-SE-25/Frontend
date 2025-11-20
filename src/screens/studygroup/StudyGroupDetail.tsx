import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrapper,
  PageLayout,
  SidebarContainer,
  MainContentContainer,
  TabNav,
  TabButton,
  TabContent,
} from "../../theme/StudyGroupDetail.Style";

import StudyGroupSidebar from "./StudyGroupSidebar";
import ProblemListTab from "./ProblemListTab";
import BoardList from "../board/BoardList";
import ActivityTab from "./ActivityTab";
import CommonModal from "./CommomModal";
import StudyGroupManage from "./StudyGroupManage";

import type { StudyGroup, GroupRole } from "../../api/studygroup_api";
import { DUMMY_GROUP_DETAIL } from "../../api/dummy/studygroupdetail_dummy";

export default function StudyGroupDetailPage() {
  const navigate = useNavigate();
  const [showManageModal, setShowManageModal] = useState(false);

  // 실제 API 연동 시 groupId를 URL에서 받아야 함
  const group: StudyGroup = DUMMY_GROUP_DETAIL;
  // 더미데이터 사용한 역할
  const [role, setRole] = useState<GroupRole | undefined>(group.myRole);

  // 탭 상태
  const [activeTab, setActiveTab] = useState<
    "problem" | "discussion" | "activity"
  >("problem");

  //그룹 탈퇴 팝업 on/off 상태
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // 실제 탈퇴 처리 (지금은 더미)
  const handleLeaveGroup = async () => {
    try {
      // TODO: 백엔드 연동 시 아래 주석 해제하고 실제 API 호출
      // await api.delete(`/studygroup/list/${group.group_id}`);

      alert("그룹에서 탈퇴되었습니다!");
      setShowLeaveModal(false);

      navigate("/studygroup");
    } catch (error) {
      console.error(error);
      alert("탈퇴에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <Wrapper>
      <PageLayout>
        <SidebarContainer>
          <StudyGroupSidebar
            group={group}
            role={role}
            setRole={setRole}
            setActiveTab={setActiveTab}
            onOpenManageModal={() => setShowManageModal(true)}
            onOpenLeaveModal={() => setShowLeaveModal(true)}
          />
        </SidebarContainer>

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
            {activeTab === "problem" && <ProblemListTab role={role} />}
            {activeTab === "discussion" && (
              <BoardList mode="study" groupId={group.group_id} />
            )}
            {activeTab === "activity" && <ActivityTab />}
          </TabContent>
        </MainContentContainer>
      </PageLayout>

      {/* ⭐ 역할에 따라 다른 모달 보여주기 */}
      {role === "LEADER" && showManageModal && (
        <StudyGroupManage
          group={group}
          onClose={() => setShowManageModal(false)}
        />
      )}

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
