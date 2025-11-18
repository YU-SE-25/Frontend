import {
  ModalOverlay,
  ModalBox,
  ModalTitle,
  ModalButtons,
  ModalButton,
  ResultText,
} from "../../theme/ProblemSolve.Style";

interface CodeResultProps {
  result: {
    status: string;
    time: string;
    memory: string;
    testCasesPassed: string;
  } | null;
  onClose: () => void;
  onRetry: () => void;
  onMySubmissions: () => void;
}

export default function CodeResult({
  result,
  onClose,
  onRetry,
  onMySubmissions,
}: CodeResultProps) {
  if (!result) return null;
  const isAC = result?.status === "AC";

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox $success={isAC} onClick={(e) => e.stopPropagation()}>
        <ModalTitle $success={isAC}>
          {isAC ? "정답입니다!" : "오답입니다!"}
        </ModalTitle>

        <ResultText>상태: {result.status}</ResultText>
        <ResultText>시간: {result.time}</ResultText>
        <ResultText>메모리: {result.memory}</ResultText>
        <ResultText>통과 테스트: {result.testCasesPassed}</ResultText>

        <ModalButtons>
          {!isAC && <ModalButton onClick={onRetry}>다시 풀기</ModalButton>}
          <ModalButton onClick={onMySubmissions} $main>
            내 제출 목록
          </ModalButton>
        </ModalButtons>
      </ModalBox>
    </ModalOverlay>
  );
}
