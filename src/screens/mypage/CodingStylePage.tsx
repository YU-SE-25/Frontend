import { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../api/axios";
import { fetchMySubmissions } from "../../api/mySubmissions_api";

const Card = styled.div`
  border: 1px solid ${({ theme }) => `${theme.textColor}20`};
  border-radius: 16px;
  padding: 24px 28px;
  background: ${({ theme }) => theme.headerBgColor};

  width: 100%;
  max-width: 800px;
  min-width: 400px;
  margin: 40px auto;

  line-height: 1.6;

  & > * + * {
    margin-top: 8px;
  }
`;

interface CodingHabitsResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export default function CodingStylePage() {
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [data, setData] = useState<CodingHabitsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // 1) 정답 수 불러오기
  useEffect(() => {
    fetchMySubmissions({ size: 9999 })
      .then((res) => {
        const count = res.items.filter((sub) => sub.status === "CA").length;
        setCorrectCount(count);
      })
      .catch(() => setCorrectCount(0));
  }, []);

  // 2) 정답 수 상관없이 계속 분석 API 호출
  useEffect(() => {
    setLoading(true);
    api
      .get("/analysis/habits")
      .then((res) => setData(res.data))
      .catch((err) => console.error("성향 분석 오류:", err))
      .finally(() => setLoading(false));
  }, []);

  if (correctCount < 10) {
    const need = 10 - correctCount;
    return (
      <Card>
        <h2>코딩 성향 분석</h2>
        <p>
          분석을 위해 <strong>정답 10개</strong>가 필요해요.
        </p>
        <p>현재 정답 수: {correctCount}개</p>
        <p>남은 문제 수: {need}개</p>
      </Card>
    );
  }

  //정답 10개 이상 → 항상 결과 UI + 다음 남은 문제 표시
  const nextGoal = Math.ceil(correctCount / 10) * 10;
  const remaining = nextGoal - correctCount;

  if (loading && !data) {
    return <Card>분석 중입니다...</Card>;
  }

  if (!data) {
    return <Card>분석 결과를 불러오지 못했습니다.</Card>;
  }

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

      {/* 다음 분석까지 남은 문제 수 */}
      {remaining > 0 ? (
        <p style={{ marginTop: "20px", opacity: 0.8 }}>
          다음 분석까지 <strong>{remaining}개</strong> 남았습니다.
        </p>
      ) : (
        <p style={{ marginTop: "20px", opacity: 0.8 }}>
          🎉 새로운 분석이 가능합니다!
        </p>
      )}
    </Card>
  );
}
