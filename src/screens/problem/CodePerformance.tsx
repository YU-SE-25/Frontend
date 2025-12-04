interface HabitAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

interface CodePerformanceProps {
  data: HabitAnalysis | null;
}

export default function CodePerformance({ data }: CodePerformanceProps) {
  if (!data) return <p>분석 중...</p>;

  return (
    <div>
      <h3>요약</h3>
      <p>{data.summary}</p>

      <h3>강점</h3>
      <ul>
        {data.strengths.map((s: string) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <h3>약점</h3>
      <ul>
        {data.weaknesses.map((w: string) => (
          <li key={w}>{w}</li>
        ))}
      </ul>

      <h3>개선 제안</h3>
      <ul>
        {data.suggestions.map((t: string) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
