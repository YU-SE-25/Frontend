import { useEffect, useState } from "react";
import {
  fetchAssignedProblemLists,
  deleteProblemList,
} from "../../api/studygroup_api";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
} from "../../theme/StudyGroupMain.Style";
import ProblemListModal from "./CreateProblemList";

import type { AssignedProblemList } from "../../api/studygroup_api";

export default function ProblemListManageModal({
  groupId,
  onClose,
}: {
  groupId: number;
  onClose: () => void;
}) {
  const [lists, setLists] = useState<AssignedProblemList[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  const loadLists = async () => {
    const data = await fetchAssignedProblemLists(groupId);
    setLists(data);
  };

  useEffect(() => {
    loadLists();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제할까요?")) return;
    await deleteProblemList(groupId, id);
    alert("삭제되었습니다!");
    loadLists();
  };

  return (
    <ModalOverlay>
      <ModalContent style={{ maxWidth: 600 }}>
        <ModalTitle>문제 리스트 관리</ModalTitle>

        {lists.length === 0 && <p>등록된 문제 리스트가 없습니다.</p>}

        {lists.map((list: any) => (
          <div
            key={list.problemListId}
            style={{ padding: "12px 0", borderBottom: "1px solid #ccc" }}
          >
            <b>{list.listTitle}</b>
            <div>마감일: {list.dueDate}</div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => setSelectedListId(list.problemListId)}>
                수정
              </button>
              <button
                style={{ marginLeft: 8, color: "red" }}
                onClick={() => handleDelete(list.problemListId)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}

        <button style={{ marginTop: 20 }} onClick={onClose}>
          닫기
        </button>

        {selectedListId && (
          <ProblemListModal
            mode="edit"
            groupId={groupId}
            problemListId={selectedListId}
            onClose={() => setSelectedListId(null)}
            onFinished={loadLists}
          />
        )}
      </ModalContent>
    </ModalOverlay>
  );
}
