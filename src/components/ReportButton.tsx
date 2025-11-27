import { useState } from "react";
import styled from "styled-components";
import ReportModal from "../screens/ReportModal";
import { useAtomValue } from "jotai";
import { userProfileAtom } from "../atoms";
import { useNavigate } from "react-router-dom";

interface Props {
  targetContentId: number;
  targetContentType:
    | "post"
    | "comment"
    | "discussion"
    | "qna"
    | "review"
    | "submission"
    | "reviewComment";
}

export default function ReportButton({
  targetContentId,
  targetContentType,
}: Props) {
  const [open, setOpen] = useState(false);
  const userRole = useAtomValue(userProfileAtom)?.role;
  const navigate = useNavigate();
  if (userRole === "MANAGER") {
    return (
      <>
        <Btn
          onClick={() => {
            const yes = window.confirm("정말로 삭제하시겠습니까?");
            if (yes) {
              alert(
                "삭제되었습니다. (실제 삭제 기능은 구현되어 있지 않습니다.)"
              );
              navigate(-1);
            }
          }}
        >
          🚨삭제
        </Btn>
      </>
    );
  }

  return (
    <>
      <Btn onClick={() => setOpen(true)}>🚨신고</Btn>

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
