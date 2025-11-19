import { useState } from "react";
import styled from "styled-components";
import { createReport } from "../api/report_api";

interface Props {
  targetContentId: number;
  targetContentType: string;
  onClose: () => void;
}

export default function ReportModal({
  targetContentId,
  targetContentType,
  onClose,
}: Props) {
  const [reportType, setReportType] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!reportType) {
      alert("신고 유형을 선택해주세요.");
      return;
    }
    if (!reason.trim()) {
      alert("상세 사유를 입력해주세요.");
      return;
    }

    try {
      const res = await createReport({
        reporter_name: "홍길동", // 이름 더미, 나중에 로그인 유저로 변경
        report_title: reportType,
        target_content_type: targetContentType,
        target_content_id: targetContentId,
        reason,
      });

      alert(res.message);
      onClose();
    } catch (error) {
      console.error(error);
      alert("전송 실패. 다시 시도해주세요.");
    }
  };

  return (
    <Overlay>
      <Modal>
        <Title>컨텐츠 신고</Title>

        <Label>신고 유형</Label>
        <StyledSelect
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="">선택해주세요</option>
          <option value="욕설/비방">욕설/비방</option>
          <option value="광고/도배">광고/도배</option>
          <option value="저작권 침해">저작권 침해</option>
          <option value="기타">기타</option>
        </StyledSelect>

        <Label>상세 사유</Label>
        <StyledTextarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="신고 사유를 입력해주세요."
        />

        <ButtonRow>
          <CancelBtn onClick={onClose}>취소</CancelBtn>
          <SubmitBtn onClick={handleSubmit}>신고하기</SubmitBtn>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
}

//css
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;

const Modal = styled.div`
  width: 380px;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  padding: 22px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.textColor}33;
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.35);

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  color: ${({ theme }) => theme.textColor};
`;

const Label = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.textColor};
`;

const StyledSelect = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.textColor}44;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
`;

const StyledTextarea = styled.textarea`
  padding: 10px;
  height: 120px;
  resize: none;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.textColor}44;

  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const CancelBtn = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.headerBgColor};
  color: ${({ theme }) => theme.textColor};
  border: 1px solid ${({ theme }) => theme.textColor}44;

  &:hover {
    opacity: 0.8;
  }
`;

const SubmitBtn = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.focusColor};
  color: #000;
  border: none;

  &:hover {
    filter: brightness(0.93);
  }
`;
