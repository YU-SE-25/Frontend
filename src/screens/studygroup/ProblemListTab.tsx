import React, { useEffect, useState } from "react";
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
import {
  fetchAssignedProblemLists,
  fetchAssignedProblemListDetail,
} from "../../api/studygroup_api";
import CreateProblemList from "./CreateProblemList";

interface Props {
  role: GroupRole | undefined;
  groupId: number;
}

export default function ProblemListTab({ role, groupId }: Props) {
  const [lists, setLists] = useState<AssignedProblemList[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 전체 문제 리스트 불러오기
  useEffect(() => {
    const load = async () => {
      const data = await fetchAssignedProblemLists(groupId);
      setLists(data);
    };
    load();
  }, [groupId]);

  // 펼칠 때 문제 상세 데이터 가져오기
  const toggleExpand = async (problemListId: number) => {
    if (expanded === problemListId) {
      setExpanded(null);
      return;
    }

    // 상세 데이터를 불러와야 한다
    const detail = await fetchAssignedProblemListDetail(groupId, problemListId);

    if (!detail) return;

    // 상세 데이터로 lists 갱신
    setLists((prev) =>
      prev.map((list) => (list.problemListId === problemListId ? detail : list))
    );

    setExpanded(problemListId);
  };

  const handleAddProblemList = () => {
    if (role !== "LEADER") {
      alert("그룹장만 문제를 지정할 수 있습니다.");
      return;
    }
    setShowCreateModal(true);
  };

  return (
    <>
      <TabContentHeader>
        <h3>지정된 문제 목록</h3>

        {role === "LEADER" && (
          <ProblemListAddButton onClick={handleAddProblemList}>
            + 문제 리스트 추가
          </ProblemListAddButton>
        )}
      </TabContentHeader>

      <ProblemAccordionContainer>
        {lists.map((list) => {
          const isOpen = expanded === list.problemListId;

          return (
            <ProblemAccordionItem key={list.problemListId} $isExpanded={isOpen}>
              <AccordionHeader onClick={() => toggleExpand(list.problemListId)}>
                <ProblemSummary>{list.listTitle}</ProblemSummary>

                <ProblemListInfo>
                  <ProblemSummarySmall>
                    {list.submittedCount}/{list.problems.length}
                  </ProblemSummarySmall>
                  <ProblemSummarySmall>
                    마감: {list.dueDate}
                  </ProblemSummarySmall>
                </ProblemListInfo>
              </AccordionHeader>

              {isOpen && (
                <ProblemDetailList>
                  {list.problems.map((p) => (
                    <ProblemDetailItem key={p.problemId}>
                      <ProblemListInfoContainer>
                        <ProblemTitleLink>{p.problemTitle}</ProblemTitleLink>

                        <SubmissionDateText>
                          {new Date(p.createTime).toLocaleDateString()}
                        </SubmissionDateText>
                      </ProblemListInfoContainer>

                      <StatusBadge
                        $status={p.userStatus === "SUBMITTED" ? "ok" : "none"}
                      >
                        {p.userStatus === "SUBMITTED" ? "제출완료" : "미제출"}
                      </StatusBadge>
                    </ProblemDetailItem>
                  ))}
                </ProblemDetailList>
              )}
            </ProblemAccordionItem>
          );
        })}
      </ProblemAccordionContainer>

      {lists.length === 0 && (
        <p style={{ opacity: 0.7 }}>지정된 문제가 없습니다.</p>
      )}

      {showCreateModal && (
        <CreateProblemList
          onClose={() => setShowCreateModal(false)}
          groupId={groupId}
        />
      )}
    </>
  );
}
