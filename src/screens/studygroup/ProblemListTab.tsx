import React, { useEffect, useState, useCallback } from "react";
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
  const loadLists = useCallback(async () => {
    const data = await fetchAssignedProblemLists(groupId);
    setLists(data);
  }, [groupId]);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  // 펼칠 때 문제 상세 데이터 가져오기
  const toggleExpand = async (problemListId: number) => {
    if (expanded === problemListId) {
      setExpanded(null);
      return;
    }

    const detail = await fetchAssignedProblemListDetail(groupId, problemListId);

    if (!detail) return;

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

          //제출된 문제 수 계산 (SUBMITTED 기준)
          const submittedCount = list.problems.filter(
            (p) => p.userStatus === "SUBMITTED"
          ).length;

          return (
            <ProblemAccordionItem key={list.problemListId} $isExpanded={isOpen}>
              <AccordionHeader onClick={() => toggleExpand(list.problemListId)}>
                <ProblemSummary>{list.listTitle}</ProblemSummary>

                <ProblemListInfo>
                  <ProblemSummarySmall>
                    {submittedCount}/{list.problems.length}
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
          onCreated={loadLists}
        />
      )}
    </>
  );
}
