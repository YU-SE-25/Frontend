import { useState } from "react";

import {
  HomeWrapper,
  MainContentArea,
  PageHeader,
  MainTitle,
  SubText,
  FeatureSectionContainer,
  TabHeader,
  TabButton,
  FeatureGrid,
  FeatureCard,
  FeatureIcon,
  FeatureCardTitle,
  FeatureCardDescription,
  RankingSection,
  RankingTitle,
  RankingTable,
  BridgeSection,
} from "../theme/Home.Style";

import {
  dummyProblemRanking,
  dummyReputationRanking,
  dummyReviewRanking,
} from "../api/dummy/home_dummy";

// 나중에 백엔드 연동용 (지금은 주석 유지)
/*
import {
  getProblemRanking,
  getReputationRanking,
  getReviewRanking,
  type IProblemRankingItem,
  type IReputationRankingItem,
  type IReviewRankingItem,
} from "../api/home_api";
*/

const MAIN_TABS = {
  CODE_ANALYSIS: "CODE_ANALYSIS",
  USER_DASHBOARD: "USER_DASHBOARD",
};

const RANKING_TABS = {
  PROBLEM_VIEWS: "문제 조회수",
  REPUTATION: "평판",
  CODE_REVIEW: "코드 리뷰",
};

type ProblemItem = {
  rank: number;
  title: string;
  view: number;
  weekly_views: number;
};

type ReputationItem = {
  id: number;
  user_id: string;
  rank: number;
  delta: number;
};

type ReviewItem = {
  id: number;
  user_id: string;
  rank: number;
  delta: number;
  vote: number;
  problem_title: string;
  review_title: string;
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(MAIN_TABS.CODE_ANALYSIS);
  const [activeRankingTab, setActiveRankingTab] = useState(
    RANKING_TABS.PROBLEM_VIEWS
  );
  const codeAnalysisFeatures = [
    {
      icon: "🧩",
      title: "코딩 패턴 분석",
      desc: "사용자의 코드를 분석하여 개선된 코드와 사유를 시각적으로 제공합니다.",
    },
    {
      icon: "🚀",
      title: "성능 분석 및 프로파일링",
      desc: "실행 시간 및 메모리 사용량, 라인별 호출 횟수를 분석하여 최적화 포인트를 제시합니다.",
    },
    {
      icon: "💡",
      title: "플로우차트 자동 생성",
      desc: "사용자가 작성한 코드를 분석하여 제어 흐름을 플로우차트로 자동 생성합니다.",
    },
    {
      icon: "🛡️",
      title: "취약점 개념 분석",
      desc: "코드 내 잠재적 취약점을 분석하고 관련 보안 개념을 학습 자료로 제공합니다.",
    },
  ];
  const userDashboardFeatures = [
    {
      icon: "🏆",
      title: "연속 학습일 기록",
      desc: "연속 학습일 기록 및 누적 성실도를 시각화하여 학습 지속성을 강화합니다.",
    },
    {
      icon: "📊",
      title: "개인화된 성과 리포트",
      desc: "정답률, 평균 실행 시간 등을 그래프로 제공하여 맞춤형 피드백을 제공합니다.",
    },
    {
      icon: "💬",
      title: "커뮤니티 활동 성과",
      desc: "좋은 답변/리뷰 제공 시 평판 점수를 부여하고 배지를 수여합니다.",
    },
    {
      icon: "🔔",
      title: "학습 독려 리마인드",
      desc: "활동 패턴 분석을 통한 시의적절한 학습 독려 리마인드를 제공합니다.",
    },
  ];

  // 랭킹 데이터 상태 (지금은 더미 사용)
  const [problemRanking, setProblemRanking] =
    useState<ProblemItem[]>(dummyProblemRanking);
  const [reputationRanking, setReputationRanking] = useState<ReputationItem[]>(
    dummyReputationRanking
  );
  const [reviewRanking, setReviewRanking] =
    useState<ReviewItem[]>(dummyReviewRanking);

  // 백엔드 연동용
  /*
  useEffect(() => {
    getProblemRanking()
      .then((res) => setProblemRanking(res))
      .catch(() => setProblemRanking([]));

    getReputationRanking()
      .then((res) => setReputationRanking(res))
      .catch(() => setReputationRanking([]));

    getReviewRanking()
      .then((res) => setReviewRanking(res))
      .catch(() => setReviewRanking([]));
  }, []);
  */
  //순위 데이터 렌더링용 변환
  const renderRankingData = () => {
    switch (activeRankingTab) {
      case RANKING_TABS.PROBLEM_VIEWS:
        return {
          headers: ["번호", "문제제목", "총 조회수", "주간 조회수"],
          data: problemRanking.map((item) => ({
            rank: item.rank,
            title: item.title,
            value1: item.view,
            value2: item.weekly_views,
          })),
        };

      case RANKING_TABS.REPUTATION:
        return {
          headers: ["순위", "유저명", "주간 평판 변화", "비고"],
          data: reputationRanking.map((item) => ({
            rank: item.rank,
            title: item.user_id,
            value1: item.delta,
            value2: "-", // 일단 비우고 나중에 확장해도 됨
          })),
        };

      case RANKING_TABS.CODE_REVIEW:
        return {
          headers: ["순위", "문제제목 / 리뷰제목", "투표수", "주간 변화량"],
          data: reviewRanking.map((item) => ({
            rank: item.rank,
            title: `${item.problem_title} / ${item.review_title}`,
            value1: item.vote,
            value2: item.delta,
          })),
        };

      default:
        return { headers: [], data: [] };
    }
  };

  const currentRankingData = renderRankingData();

  return (
    <HomeWrapper>
      <MainContentArea>
        <PageHeader>
          <MainTitle>UnIDE</MainTitle>
          <SubText>
            단순한 채점 플랫폼을 넘어, 학습자의 알고리즘 이해와 성장을 돕는
            지능형 IDE
          </SubText>
        </PageHeader>

        <BridgeSection>
          <h2>어떻게 학습을 더 똑똑하게 바꿀 수 있을까요?</h2>
          <p>
            UnIDE는 단순한 문제풀이 플랫폼이 아니라{" "}
            <strong>코드 분석·시각화·피드백</strong>을 통해 개발자의 성장 여정을
            함께 설계하는 학습 도구입니다.
          </p>
        </BridgeSection>

        <FeatureSectionContainer>
          <TabHeader>
            <TabButton
              isActive={activeTab === MAIN_TABS.CODE_ANALYSIS}
              onClick={() => setActiveTab(MAIN_TABS.CODE_ANALYSIS)}
            >
              코드 분석
            </TabButton>
            <TabButton
              isActive={activeTab === MAIN_TABS.USER_DASHBOARD}
              onClick={() => setActiveTab(MAIN_TABS.USER_DASHBOARD)}
            >
              사용자 대시보드
            </TabButton>
          </TabHeader>

          <FeatureGrid>
            {(activeTab === MAIN_TABS.CODE_ANALYSIS
              ? codeAnalysisFeatures
              : userDashboardFeatures
            ).map((feature) => (
              <FeatureCard key={feature.title}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureCardTitle>{feature.title}</FeatureCardTitle>
                <FeatureCardDescription>{feature.desc}</FeatureCardDescription>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </FeatureSectionContainer>

        <RankingSection>
          <RankingTitle>주간 순위</RankingTitle>

          <TabHeader>
            {Object.values(RANKING_TABS).map((tab) => (
              <TabButton
                key={tab}
                isActive={activeRankingTab === tab}
                onClick={() => setActiveRankingTab(tab)}
                style={{ fontSize: "18px", padding: "10px 15px" }}
              >
                {tab}
              </TabButton>
            ))}
          </TabHeader>

          <RankingTable>
            <thead>
              <tr>
                {currentRankingData.headers.map((header, index) => (
                  <th
                    key={index}
                    style={{
                      width: index === 1 ? "40%" : "15%", // 네가 원래 쓰던 비율 느낌 살려서
                      textAlign: index === 0 ? "left" : "center",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRankingData.data.map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "left" }}>{item.rank}</td>
                  <td
                    style={{
                      width: "40%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {item.title}
                  </td>
                  <td style={{ textAlign: "center" }}>{item.value1}</td>
                  <td style={{ textAlign: "center" }}>{item.value2}</td>
                </tr>
              ))}
            </tbody>
          </RankingTable>
        </RankingSection>
      </MainContentArea>
    </HomeWrapper>
  );
}
