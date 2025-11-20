//경고창
import styled from "styled-components";

// 전체 오버레이
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
`;

// 팝업 박스
const ModalBox = styled.div`
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  padding: 30px;
  border-radius: 14px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);

  h2 {
    margin: 0 0 12px 0;
    font-size: 22px;
    font-weight: 700;
  }

  p {
    opacity: 0.85;
    font-size: 16px;
    margin-bottom: 25px;
    line-height: 1.5;
  }
`;

// 버튼 묶음
const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

// 취소 버튼
const CancelButton = styled.button`
  padding: 10px 16px;
  background: ${({ theme }) => theme.authHoverBgColor};
  border: none;
  border-radius: 8px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  font-size: 15px;

  &:hover {
    opacity: 0.8;
  }
`;

// 위험 버튼
const DangerButton = styled.button`
  padding: 10px 16px;
  background: #e45757;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

interface Props {
  title: string;
  message: React.ReactNode;
  dangerText?: string; // 기본값: "확인"
  cancelText?: string; // 기본값: "취소"
  onConfirm: () => void; // 위험 버튼 클릭
  onCancel: () => void; // 닫기 버튼 클릭
}

export default function CommonModal({
  title,
  message,
  dangerText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <ModalOverlay>
      <ModalBox>
        <h2>{title}</h2>
        <div>{message}</div>

        <ButtonRow>
          <CancelButton onClick={onCancel}>{cancelText}</CancelButton>
          <DangerButton onClick={onConfirm}>{dangerText}</DangerButton>
        </ButtonRow>
      </ModalBox>
    </ModalOverlay>
  );
}
