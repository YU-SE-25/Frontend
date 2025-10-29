// src/pages/MyPage.tsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import {
  getSolvedIds,
  getBookmarkedIds,
  getRecentSubmissions,
} from "../api/dummy/mypage_dummy"; //더미 API 사용

type Submission = {
  id: number;
  problemId: number;
  verdict: "AC" | "WA" | "TLE" | "MLE" | "RE"; //정답,오답,시간초과,메모리초과,런타임에러
  runtimeMs?: number;
  lang?: string;
  submittedAt: string;
};

const Page = styled.div`
  max-width: 1040px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  gap: 20px;
`;

const Head = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
`;

const Badge = styled.span`
  font-size: 14px;
  opacity: 0.7;
`;

const Grid = styled.section`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 18px;
  background: var(--card-bg, #fff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: grid;
  gap: 12px;
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
`;

const Muted = styled.div`
  font-size: 13px;
  opacity: 0.7;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: "primary" | "soft" | "ghost" }>`
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: filter 0.15s ease, background 0.15s ease, border-color 0.15s ease;
  ${({ variant }) => {
    switch (variant) {
      case "primary":
        return `background:#111827;color:#fff;`;
      case "soft":
        return `background:#f3f4f6;color:#111827;border-color:rgba(0,0,0,0.08);`;
      default:
        return `background:transparent;color:#111827;border-color:rgba(0,0,0,0.12);`;
    }
  }}
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    filter: brightness(0.98);
  }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 13px;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 6px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

const List = styled.ul`
  display: grid;
  gap: 8px;
`;

const Item = styled.li`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
`;

const Pill = styled.span<{ tone?: "ok" | "bad" | "neutral" }>`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  ${({ tone }) =>
    tone === "ok"
      ? `background:#e6fbe6;border-color:#b7e2b7;`
      : tone === "bad"
      ? `background:#ffecec;border-color:#f3b5b5;`
      : `background:#f3f4f6;`}
`;

export default function MyPage() {
  const { username } = useParams();
  const nav = useNavigate();

  const solvedQ = useQuery({
    queryKey: ["mypage", "solvedIds", username],
    queryFn: () => getSolvedIds(username!),
    staleTime: 60_000,
  });

  const bookmarkedQ = useQuery({
    queryKey: ["mypage", "bookmarkedIds", username],
    queryFn: () => getBookmarkedIds(username!),
    staleTime: 60_000,
  });

  const recentQ = useQuery({
    queryKey: ["mypage", "recentSubmissions", username!],
    queryFn: () => getRecentSubmissions(username!),
    staleTime: 30_000,
  });

  const solvedIds = solvedQ.data ?? [];
  const bookmarkedIds = bookmarkedQ.data ?? [];
  const submissions: Submission[] = recentQ.data ?? [];

  const solvedPreview = useMemo(() => solvedIds.slice(0, 10), [solvedIds]);
  const bookmarkedPreview = useMemo(
    () => bookmarkedIds.slice(0, 10),
    [bookmarkedIds]
  );

  // 내가 푼 문제 페이지로 이동
  const goSolved = () =>
    solvedIds.length && nav(`/problem-list?ids=${solvedIds.join(",")}`);
  const goBookmarked = () =>
    bookmarkedIds.length && nav(`/problem-list?ids=${bookmarkedIds.join(",")}`);
  const goAll = () => nav("/problem-list");

  const acRate = useMemo(() => {
    if (!submissions.length) return 0;
    const ac = submissions.filter((s) => s.verdict === "AC").length;
    return Math.round((ac / submissions.length) * 100);
  }, [submissions]);

  return (
    <Page>
      <Head>
        <Title>마이페이지</Title>
        <Badge>User: {username}</Badge>
      </Head>

      <StatGrid>
        <Stat>
          <StatLabel>푼 문제 수</StatLabel>
          <StatValue>{solvedIds.length}</StatValue>
        </Stat>
        <Stat>
          <StatLabel>북마크</StatLabel>
          <StatValue>{bookmarkedIds.length}</StatValue>
        </Stat>
        <Stat>
          <StatLabel>최근 제출 정답률</StatLabel>
          <StatValue>{acRate}%</StatValue>
        </Stat>
      </StatGrid>

      <Grid>
        <Card>
          <CardTitleRow>
            <CardTitle>내가 푼 문제</CardTitle>
            <Muted>{solvedQ.isFetching ? "동기화 중…" : ""}</Muted>
          </CardTitleRow>
          <Row>
            <Button
              onClick={goSolved}
              disabled={solvedQ.isLoading || !solvedIds.length}
              variant="primary"
            >
              내가 푼 문제만 보기
            </Button>
            <Button onClick={goAll} variant="soft">
              전체 문제 보기
            </Button>
            <Button onClick={() => solvedQ.refetch()} variant="ghost">
              새로고침
            </Button>
          </Row>
          <Chips>
            {solvedPreview.map((id) => (
              <Chip key={id}>#{id}</Chip>
            ))}
            {solvedIds.length > solvedPreview.length && (
              <Muted>+ {solvedIds.length - solvedPreview.length} 더보기</Muted>
            )}
          </Chips>
        </Card>

        <Card>
          <CardTitleRow>
            <CardTitle>북마크한 문제</CardTitle>
            <Muted>{bookmarkedQ.isFetching ? "동기화 중…" : ""}</Muted>
          </CardTitleRow>
          <Row>
            <Button
              onClick={goBookmarked}
              disabled={bookmarkedQ.isLoading || !bookmarkedIds.length}
            >
              북마크 목록 보기
            </Button>
            <Button onClick={() => bookmarkedQ.refetch()} variant="ghost">
              새로고침
            </Button>
          </Row>
          <Chips>
            {bookmarkedPreview.map((id) => (
              <Chip key={id}>★ {id}</Chip>
            ))}
            {bookmarkedIds.length > bookmarkedPreview.length && (
              <Muted>
                + {bookmarkedIds.length - bookmarkedPreview.length} 더보기
              </Muted>
            )}
          </Chips>
        </Card>
      </Grid>

      <Card>
        <CardTitleRow>
          <CardTitle>최근 제출</CardTitle>
          <Muted>{recentQ.isFetching ? "동기화 중…" : ""}</Muted>
        </CardTitleRow>
        {!submissions.length ? (
          <Muted>기록 없음</Muted>
        ) : (
          <List>
            {submissions.slice(0, 5).map((s) => (
              <Item key={s.id}>
                <div>
                  <strong>#{s.problemId}</strong> · {s.lang ?? "—"} ·{" "}
                  {new Date(s.submittedAt).toLocaleString()}
                </div>
                <Pill
                  tone={
                    s.verdict === "AC"
                      ? "ok"
                      : s.verdict === "WA"
                      ? "bad"
                      : "neutral"
                  }
                >
                  {s.verdict}
                  {s.runtimeMs ? ` · ${s.runtimeMs}ms` : ""}
                </Pill>
              </Item>
            ))}
          </List>
        )}
      </Card>
    </Page>
  );
}
