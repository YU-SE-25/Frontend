import React, { useState } from "react";
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
import { DUMMY_GROUP_DETAIL } from "../../api/dummy/studygroupdetail_dummy";
import type { StudyGroup } from "../../api/studygroup_api";
import BoardList from "../board/BoardList";

export default function StudyGroupDetailPage() {
  const group: StudyGroup = DUMMY_GROUP_DETAIL;
  const [activeTab, setActiveTab] = useState<
    "problem" | "discussion" | "activity"
  >("problem");

  return (
    <Wrapper>
      <PageLayout>
        <SidebarContainer>
          <StudyGroupSidebar group={group} />
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
            {activeTab === "problem" && <ProblemListTab />}
            {activeTab === "discussion" && (
              <BoardList mode="study" groupId={group.group_id} />
            )}
            {activeTab === "activity" && <div>📊 활동 기록 준비 중...</div>}
          </TabContent>
        </MainContentContainer>
      </PageLayout>
    </Wrapper>
  );
}
