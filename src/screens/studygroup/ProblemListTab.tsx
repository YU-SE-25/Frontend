import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TabContentHeader,
  ProblemListAddButton,
  ProblemAccordionContainer,
  ProblemAccordionItem,
  AccordionHeader,
  ProblemSummary,
  ProblemSummarySmall,
  ProblemDetailList,
  ProblemDetailItem,
  ProblemTitleLink,
  ProblemListInfo,
  StatusBadge,
  ProblemListInfoContainer,
  SubmissionDateText,
} from "../../theme/StudyGroupDetail.Style";
import { DUMMY_ASSIGNED_LISTS } from "../../api/dummy/studygroupdetail_dummy";

export default function ProblemListTab() {
  const navigate = useNavigate();

  //expandedId는 할당된 문제 목록 그룹(assignedId)을 저장합니다.
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleAccordionToggle = (assignedId: number) => {
    setExpandedId((currentId) =>
      currentId === assignedId ? null : assignedId
    );
  };

  //문제 제목 클릭 시 상세 페이지로 이동
  const handleProblemClick = (problemId: number) => {
    navigate(`/problem-detail/${problemId}`);
  };

  return (
    <>
      <TabContentHeader>
        <h3>할당된 문제목록</h3>
        <ProblemListAddButton>목록 생성</ProblemListAddButton>
      </TabContentHeader>

      <ProblemAccordionContainer>
        {DUMMY_ASSIGNED_LISTS.map((listGroup) => {
          const submittedCount = listGroup.submittedCount;
          const totalProblems = listGroup.totalProblems;
          const isExpanded = expandedId === listGroup.assignedId;

          return (
            <ProblemAccordionItem
              key={listGroup.assignedId}
              $isExpanded={isExpanded}
            >
              <AccordionHeader
                onClick={() => handleAccordionToggle(listGroup.assignedId)}
              >
                <ProblemSummary>{listGroup.listTitle}</ProblemSummary>

                <ProblemListInfoContainer>
                  <ProblemSummarySmall>
                    {submittedCount}/{totalProblems}
                  </ProblemSummarySmall>
                  <span>기한: {listGroup.dueDate}</span>
                </ProblemListInfoContainer>
              </AccordionHeader>

              {isExpanded && (
                <ProblemDetailList>
                  {listGroup.problems.map((problem) => (
                    <ProblemDetailItem key={problem.problem_id}>
                      <ProblemTitleLink
                        onClick={() => handleProblemClick(problem.problem_id)}
                      >
                        {problem.problem_id}. {problem.problem_title}
                      </ProblemTitleLink>

                      <ProblemListInfo>
                        <StatusBadge
                          $status={
                            problem.user_status === "제출완료"
                              ? "ok"
                              : "pending"
                          }
                        >
                          {problem.user_status}
                        </StatusBadge>
                        <SubmissionDateText>
                          {problem.user_status === "제출완료"
                            ? `제출일: ${problem.create_time.substring(0, 10)}`
                            : "제출일: -"}
                        </SubmissionDateText>
                      </ProblemListInfo>
                    </ProblemDetailItem>
                  ))}
                </ProblemDetailList>
              )}
            </ProblemAccordionItem>
          );
        })}
      </ProblemAccordionContainer>
    </>
  );
}
