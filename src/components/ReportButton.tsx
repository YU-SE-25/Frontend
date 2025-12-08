import { useState } from "react";
import styled from "styled-components";
import ReportModal from "../screens/ReportModal";
import { useAtomValue } from "jotai";
import { userProfileAtom } from "../atoms";
import type { ReportTargetType } from "../api/report_api";

interface Props {
  targetContentId: number;
  targetContentType: ReportTargetType;
  onManagerDelete?: () => void; // 매니저용 삭제 콜백
  managerConfirmMessage?: string; // 매니저용 confirm 문구
}

export default function ReportButton({
  targetContentId,
  targetContentType,
  onManagerDelete,
  managerConfirmMessage = "정말로 삭제하시겠습니까?",
}: Props) {
  const [open, setOpen] = useState(false);
  const userRole = useAtomValue(userProfileAtom)?.role;

  if (userRole === "MANAGER" && onManagerDelete) {
    const handleDelete = () => {
      const yes = window.confirm(managerConfirmMessage);
      if (!yes) return;
      onManagerDelete();
    };

    return (
      <>
        <Btn type="button" onClick={handleDelete}>
          🚨삭제
        </Btn>
      </>
    );
  }

  return (
    <>
      <Btn type="button" onClick={() => setOpen(true)}>
        🚨신고
      </Btn>

      {open && (
        <ReportModal
          targetContentId={targetContentId}
          targetContentType={targetContentType}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

const Btn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.focusColor};
  cursor: pointer;
  font-size: 13px;
  padding: 0 4px;

  &:hover {
    opacity: 0.8;
  }
`;
