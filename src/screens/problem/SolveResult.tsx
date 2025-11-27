import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getSubmissionStatus } from "../../api/codeeditor_api";
import {
  fetchSubmissionById,
  type Submission,
} from "../../api/mySubmissions_api";

interface GradingResponse {
  status: string;
  currentTestCase?: number;
  totalTestCases?: number;
  passedTestCases?: number;
  failedTestCase?: number;
  runtime?: number;
  memory?: number;
}

const ResultCard = styled.div`
  width: 100%;
  max-width: 960px;
  border-radius: 24px;
  padding: 28px 32px 22px;
  background: ${({ theme }) => theme.bgCardColor};
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.22);
  color: ${({ theme }) => theme.textColor};
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ServiceTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.12);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  width: fit-content;
  color: ${({ theme }) => theme.textColor};
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.focusColor};
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.textColor};
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: ${({ theme }) => `${theme.textColor}60`};
`;

const MetaBlock = styled.div`
  text-align: right;
  font-size: 13px;
  color: ${({ theme }) => `${theme.textColor}60`};
  display: flex;
  flex-direction: column;
  gap: 2px;

  * {
    color: ${({ theme }) => `${theme.textColor}`};
  }
`;

const Strong = styled.span`
  color: ${({ theme }) => theme.textColor};
  font-weight: 500;
`;

const StatusSection = styled.div`
  position: relative;
  border-radius: 18px;
  padding: 18px 22px;
  background: ${({ theme }) =>
    theme.mode === "light"
      ? "linear-gradient(135deg, #eaf1fd, #f0faf7)"
      : "transparent"};

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      &::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 18px;
        padding: 4px; /* 테두리 두께 */
        background: linear-gradient(135deg, #eaf1fd, #f0faf7);
        -webkit-mask: linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
      }
    `}
`;

const StatusTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatusLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusLabel = styled.span<{ tone: "neutral" | "success" | "error" }>`
  font-size: 11px;
  padding: 3px 11px;
  border-radius: 999px;
  border: 1px solid
    ${({ tone }) =>
      tone === "success"
        ? "rgba(16, 185, 129, 0.7)"
        : tone === "error"
        ? "rgba(248, 113, 113, 0.7)"
        : "rgba(148, 163, 184, 0.8)"};
  color: ${({ tone }) =>
    tone === "success" ? "#10b981" : tone === "error" ? "#f97373" : "#4b5563"};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background-color: ${({ theme }) => `${theme.muteColor}30`};
`;

const StatusMain = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const StatusSub = styled.div`
  font-size: 13px;
  color: ${({ theme }) => `${theme.muteColor}`};
`;

const GlowNumber = styled.span`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.focusColor};
`;

const pulse = keyframes`
  0% { opacity: 0.6; transform: scaleX(0.99); }
  50% { opacity: 1; transform: scaleX(1); }
  100% { opacity: 0.6; transform: scaleX(0.99); }
`;

const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProgressBar = styled.div`
  position: relative;
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.25);
  overflow: hidden;
`;

const ProgressInner = styled.div<{ percent: number }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 999px;
  width: ${({ percent }) => Math.min(percent, 100)}%;
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 1),
    rgba(16, 185, 129, 1)
  );
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

const ProgressLabel = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => `${theme.textColor}60`};
  & > span:first-child {
    color: ${({ theme }) => theme.textColor};
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 4px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StatCard = styled.div`
  border-radius: 14px;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.bgCardColor};
  border: 1px solid ${({ theme }) => theme.muteColor};
  display: flex;
  flex-direction: column;
  gap: 2px;
  backdrop-filter: blur(8px);
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.muteColor};
`;

const StatValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
  span {
    color: inherit;
  }
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HintText = styled.div`
  font-size: 11px;
  color: ${({ theme }) => `${theme.textColor}60`};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button<{ variant?: "primary" | "ghost" }>`
  min-width: 120px;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid
    ${({ theme, variant }) =>
      variant === "primary" ? theme.focusColor : "rgba(148, 163, 184, 0.9)"};
  background: ${({ theme, variant }) =>
    variant === "primary" ? theme.focusColor : "transparent"};
  color: ${({ theme, variant }) =>
    variant === "primary" ? theme.bgColor : theme.textColor};
  cursor: pointer;
  transition: filter 0.15s ease, background 0.15s ease, transform 0.1s ease;

  &:hover {
    filter: brightness(1.03);
    transform: translateY(-0.5px);
  }

  &:active {
    transform: translateY(0);
    filter: brightness(0.98);
  }
`;

export default function SolveResult() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const idFromParam = sp.get("id");
  const storedId = localStorage.getItem("lastSubmissionId");
  const submissionId = idFromParam
    ? Number(idFromParam)
    : storedId
    ? Number(storedId)
    : null;

  const [gradingData, setGradingData] = useState<GradingResponse | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionId) return;

    let active = true;

    fetchSubmissionById(submissionId)
      .then((res) => {
        if (!active) return;

        if (!res) {
          setSubmission(null);
          setSubmissionError("해당 제출 기록을 찾을 수 없습니다.");
          return;
        }

        setSubmission(res);
        setSubmissionError(null);
      })
      .catch(() => {
        if (active) {
          setSubmission(null);
          setSubmissionError("제출 정보를 불러오지 못했습니다.");
        }
      });

    return () => {
      active = false;
    };
  }, [submissionId]);

  useEffect(() => {
    if (!submissionId) return;

    // 이미 최종 상태(정답/오답/에러 등)이면 폴링 안 돌림
    const isFinalStatus =
      submission?.status &&
      submission.status !== "PENDING" &&
      submission.status !== "GRADING";

    if (isFinalStatus) return;

    let alive = true;

    const interval = setInterval(async () => {
      if (!alive) return;

      const status = await getSubmissionStatus(submissionId);
      setGradingData(status);

      if (status.status !== "GRADING" && status.status !== "PENDING") {
        clearInterval(interval);
      }
    }, 700);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [submissionId, submission?.status]);

  const status = gradingData?.status ?? submission?.status ?? "PENDING";

  const totalCases = gradingData?.totalTestCases ?? 0;
  const currentCases =
    status === "GRADING"
      ? gradingData?.currentTestCase ?? 0
      : gradingData?.passedTestCases ?? 0;

  const progressPercent =
    totalCases > 0 ? Math.round((currentCases / totalCases) * 100) : 0;

  let tone: "neutral" | "success" | "error" = "neutral";
  if (status === "CA") tone = "success";
  if (status !== "PENDING" && status !== "GRADING" && status !== "CA")
    tone = "error";

  const statusMainText =
    status === "PENDING"
      ? "채점 대기중입니다"
      : status === "GRADING"
      ? "채점중 ..."
      : status === "CA"
      ? "정답입니다!"
      : "오답입니다.";

  const statusLabelText =
    status === "PENDING"
      ? "Waiting"
      : status === "GRADING"
      ? "Running"
      : status === "CA"
      ? "Accepted"
      : "Wrong Answer";

  const statusSubText =
    status === "PENDING"
      ? "채점 서버와 연결을 준비하는 중입니다."
      : status === "GRADING"
      ? `진행 상황: ${currentCases} / ${totalCases} 테스트`
      : status === "CA"
      ? "해낼 줄 알았다구요!"
      : `실패한 테스트케이스: ${gradingData?.failedTestCase ?? "-"} 번`;

  const problemId = submission?.problemId;
  const problemTitle = submission?.problemTitle ?? "";
  const language = submission?.language ?? "-";
  const submittedAt = submission?.submittedAt ?? "알 수 없음";

  return (
    <ResultCard>
      <HeaderRow>
        <TitleBlock>
          <ServiceTag>
            <Dot />
            채점 결과
          </ServiceTag>
          <Title>
            {problemId ? `문제 [${problemId}] ${problemTitle}` : "채점 리포트"}
          </Title>
          <Subtitle>선택한 제출에 대한 온라인 채점 결과입니다.</Subtitle>
        </TitleBlock>
        <MetaBlock>
          <div>
            언어: <Strong>{language}</Strong>
          </div>
          <div>
            제출 ID: <Strong>{submissionId ?? "-"}</Strong>
          </div>
          <div>
            제출 시간: <Strong>{submittedAt}</Strong>
          </div>
        </MetaBlock>
      </HeaderRow>

      <StatusSection>
        <StatusTextBlock>
          <StatusLabelRow>
            <StatusLabel tone={tone}>{statusLabelText}</StatusLabel>
          </StatusLabelRow>
          <StatusMain>{statusMainText}</StatusMain>
          <StatusSub>{statusSubText}</StatusSub>
        </StatusTextBlock>

        <ProgressWrapper>
          <ProgressBar>
            <ProgressInner
              percent={status === "PENDING" ? 15 : progressPercent || 8}
            />
          </ProgressBar>
          <ProgressLabel>
            <span>
              {status === "PENDING"
                ? "채점을 준비하고 있어요…"
                : status === "GRADING"
                ? `현재 ${currentCases} / ${totalCases} 테스트 진행중`
                : status === "CA"
                ? "모든 테스트를 통과했습니다"
                : `통과한 테스트: ${gradingData?.passedTestCases ?? 0} / ${
                    gradingData?.totalTestCases ?? 0
                  }`}
            </span>
            <span>
              <GlowNumber>
                {status === "PENDING"
                  ? "--"
                  : status === "GRADING"
                  ? `${progressPercent}%`
                  : status === "CA"
                  ? "100%"
                  : `${progressPercent || 0}%`}
              </GlowNumber>
            </span>
          </ProgressLabel>
        </ProgressWrapper>
      </StatusSection>

      <StatsRow>
        <StatCard>
          <StatLabel>통과한 테스트</StatLabel>
          <StatValue>
            {gradingData?.passedTestCases ?? 0}
            {gradingData?.totalTestCases
              ? ` / ${gradingData.totalTestCases}`
              : status === "PENDING" || status === "GRADING"
              ? " (집계 중)"
              : ""}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>실패한 테스트</StatLabel>
          <StatValue>
            {status === "CA"
              ? "0"
              : gradingData?.failedTestCase
              ? `#${gradingData.failedTestCase}번`
              : status === "PENDING" || status === "GRADING"
              ? "집계 중"
              : "-"}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>실행 시간</StatLabel>
          <StatValue>
            {gradingData?.runtime != null
              ? `${gradingData.runtime} ms`
              : status === "PENDING" || status === "GRADING"
              ? "측정 중"
              : submission?.runtime != null
              ? `${submission.runtime} ms`
              : "-"}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>메모리 사용량</StatLabel>
          <StatValue>
            {gradingData?.memory != null
              ? `${gradingData.memory} KB`
              : status === "PENDING" || status === "GRADING"
              ? "측정 중"
              : submission?.memory != null
              ? `${submission.memory} KB`
              : "-"}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>채점 ID</StatLabel>
          <StatValue>{submissionId ?? <span>정보 없음</span>}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>최종 결과</StatLabel>
          <StatValue>
            {status === "PENDING"
              ? "대기중"
              : status === "GRADING"
              ? "채점중"
              : status === "CA"
              ? "맞았습니다!"
              : "틀렸습니다"}
          </StatValue>
        </StatCard>
      </StatsRow>

      <FooterRow>
        <HintText>
          {status === "PENDING" &&
            "채점 서버와 연결 중입니다. 잠시만 기다려 주세요."}
          {status === "GRADING" &&
            "테스트케이스 수가 많을수록 시간이 조금 더 걸릴 수 있어요."}
          {status === "CA" &&
            "이제 다른 난이도의 문제를 풀어보거나, 다른 언어로 다시 도전해 볼 수 있어요."}
          {status !== "PENDING" &&
            status !== "GRADING" &&
            status !== "CA" &&
            "실패한 테스트케이스의 입출력을 확인하고 코드를 수정해 보세요."}
          {submissionError && ` (${submissionError})`}
        </HintText>
        <ButtonGroup>
          <ActionButton
            variant="ghost"
            onClick={() =>
              problemId
                ? navigate(`/problem-list?ids=${problemId}`)
                : navigate("/problem-list")
            }
          >
            내 코드 보기
          </ActionButton>
          <ActionButton
            variant="ghost"
            onClick={() =>
              problemId
                ? navigate(`/problem-list?ids=${problemId}`)
                : navigate("/problem-list")
            }
          >
            코드 분석
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={() =>
              problemId
                ? navigate(`/problems/${problemId}/solve`)
                : navigate("/problem-list")
            }
          >
            에디터로 돌아가기
          </ActionButton>
        </ButtonGroup>
      </FooterRow>
    </ResultCard>
  );
}
