import { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../api/axios";
import { fetchMySubmissions } from "../../api/mySubmissions_api";

const Card = styled.div`
  border: 1px solid ${({ theme }) => `${theme.textColor}20`};
  border-radius: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.headerBgColor};
  max-width: 800px;
  margin: 0 auto;
`;

interface CodingHabitsResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export default function CodingStylePage() {
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [data, setData] = useState<CodingHabitsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const canAnalyze = totalAttempts >= 3;

  // 1) 전체 제출 기록 불러오기 (조건 판단용)
  useEffect(() => {
    fetchMySubmissions()
      .then((res) => {
        setTotalAttempts(res.totalElements);
      })
      .catch((err) => {
        console.error("제출 기록 불러오기 오류:", err);
        setTotalAttempts(0);
      });
  }, []);

  // 2) 조건 만족 시에만 AI 분석 호출
  useEffect(() => {
    if (!canAnalyze) {
      setLoading(false);
      return;
    }

    api
      .get("/analysis/habits")
      .then((res) => setData(res.data))
      .catch((err) => console.error("성향 분석 호출 오류:", err))
      .finally(() => setLoading(false));
  }, [canAnalyze]);

  if (loading && totalAttempts === 0) {
    return <Card>제출 기록 불러오는 중...</Card>;
  }

  if (!canAnalyze) {
    return (
      <Card>
        <h2>코딩 성향 분석</h2>
        <p>아직 분석을 진행하기엔 제출 수가 부족해요 😢</p>
        <p>
          최소 <strong>3회 이상</strong> 제출해야 분석할 수 있어요!
        </p>
        <p style={{ marginTop: "8px", opacity: 0.7 }}>
          (현재 제출 수: {totalAttempts}회)
        </p>
      </Card>
    );
  }

  if (loading) {
    return <Card>분석 중입니다... 🤖💭</Card>;
  }

  if (!data) {
    return <Card>분석 결과를 불러오지 못했습니다.</Card>;
  }

  // 실제 분석 결과 UI
  return (
    <Card>
      <h2>코딩 성향 분석</h2>
      <p>{data.summary}</p>

      <h3>강점</h3>
      <ul>
        {data.strengths.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <h3>약점</h3>
      <ul>
        {data.weaknesses.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>

      <h3>개선 제안</h3>
      <ul>
        {data.suggestions.map((sg) => (
          <li key={sg}>{sg}</li>
        ))}
      </ul>
    </Card>
  );
}
