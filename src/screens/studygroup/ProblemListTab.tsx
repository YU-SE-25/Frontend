import React, { useState } from "react";
import {
  TabContentHeader,
  ProblemListAddButton,
  ProblemAccordionContainer,
  ProblemAccordionItem,
  AccordionHeader,
  ProblemSummary,
  ProblemSummarySmall,
  ProblemListInfo,
  ProblemDetailList,
  ProblemDetailItem,
  ProblemTitleLink,
  StatusBadge,
  SubmissionDateText,
  ProblemListInfoContainer,
} from "../../theme/StudyGroupDetail.Style";

import type { AssignedProblemList, GroupRole } from "../../api/studygroup_api";
import { DUMMY_ASSIGNED_LISTS } from "../../api/dummy/studygroupdetail_dummy";

interface Props {
  role: GroupRole | undefined;
}

export default function ProblemListTab({ role }: Props) {
  // 더미 데이터
  const [assignedLists, setAssignedLists] =
    useState<AssignedProblemList[]>(DUMMY_ASSIGNED_LISTS);

  // 아코디언 펼침 여부
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  // 그룹장만 새로운 문제 리스트 추가 가능
  const handleAddProblemList = () => {
    if (role !== "LEADER") {
      alert("그룹장만 문제를 지정할 수 있습니다.");
      return;
    }

    // 실제 기능은 나중에 구현 (검색 모달)
    alert("문제 리스트 추가 기능은 추후 구현 예정입니다!");
  };

  return (
    <>
      <TabContentHeader>
        <h3>지정된 문제 목록</h3>

        {/* 그룹장일 때만 보임 */}
        {role === "LEADER" && (
          <ProblemListAddButton onClick={handleAddProblemList}>
            + 문제 리스트 추가
          </ProblemListAddButton>
        )}
      </TabContentHeader>

      <ProblemAccordionContainer>
        {assignedLists.map((list) => {
          const isOpen = expanded === list.assignedId;

          return (
            <ProblemAccordionItem key={list.assignedId} $isExpanded={isOpen}>
              <AccordionHeader onClick={() => toggleExpand(list.assignedId)}>
                <ProblemSummary>{list.listTitle}</ProblemSummary>

                <ProblemListInfo>
                  <ProblemSummarySmall>
                    {list.submittedCount}/{list.totalProblems}
                  </ProblemSummarySmall>
                  <ProblemSummarySmall>
                    마감: {list.dueDate}
                  </ProblemSummarySmall>
                </ProblemListInfo>
              </AccordionHeader>

              {/* 상세 문제 목록 */}
              {isOpen && (
                <ProblemDetailList>
                  {list.problems.map((problem) => (
                    <ProblemDetailItem key={problem.problem_id}>
                      <ProblemListInfoContainer>
                        <ProblemTitleLink>
                          {problem.problem_title}
                        </ProblemTitleLink>

                        <SubmissionDateText>
                          {new Date(problem.create_time).toLocaleDateString()}
                        </SubmissionDateText>
                      </ProblemListInfoContainer>

                      <StatusBadge
                        $status={
                          problem.user_status === "제출완료" ? "ok" : "none"
                        }
                      >
                        {problem.user_status}
                      </StatusBadge>
                    </ProblemDetailItem>
                  ))}
                </ProblemDetailList>
              )}
            </ProblemAccordionItem>
          );
        })}
      </ProblemAccordionContainer>

      {assignedLists.length === 0 && (
        <p style={{ opacity: 0.7 }}>지정된 문제가 없습니다.</p>
      )}
    </>
  );
}
