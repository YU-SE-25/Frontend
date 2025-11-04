import React from "react";
import { useParams } from "react-router-dom";

export default function StudyGroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>스터디 그룹 상세 페이지</h2>
    </div>
  );
}
