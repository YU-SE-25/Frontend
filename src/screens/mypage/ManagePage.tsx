import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getDummyUserProfile } from "../../api/dummy/mypage_dummy";
import { getUserProfile } from "../../api/mypage_api";
import UserManagementScreen from "./Manage/User";
import ReportManageScreen from "./Manage/Report";
import ProblemManagementScreen from "./Manage/Problem";

const USE_DUMMY = true;

const Wrapper = styled.div`
  flex: 1;
  margin-left: 32px;
  padding: 24px 16px;
  color: ${(props) => props.theme.textColor};
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: ${(props) => props.theme.textColor};
`;
const NavigateBar = styled.div`
  width: auto;
  height: wrap-content;
  padding-bottom: 8px;
  border-bottom: 1px solid ${(props) => props.theme.textColor}30;
  display: flex;
  gap: 12px;
  flex-wrap: nowrap; /* 줄바꿈 금지 */
  flex-shrink: 0;
`;

const NavigateItem = styled.div<{ $active: boolean }>`
  font-size: 20px;
  color: ${(props) =>
    props.$active ? props.theme.focusColor : props.theme.textColor};
  transform: ${(props) => (props.$active ? "scale(1.05)" : "scale(1.0)")};
  border-bottom: ${(props) =>
    props.$active ? `2px solid ${props.theme.focusColor}` : "none"};
  text-decoration: none;
  padding: 6px 10px;
  outline: none;
  cursor: pointer;
  transition: color 0.15 ease;
  /* 줄바꿈 금지 */
  white-space: nowrap;
  &:hover {
    color: ${(props) => props.theme.focusColor};
    transform: scale(1.05);
  }
  &:active {
    color: ${(props) => props.theme.focusColor};
    transform: scale(0.95);
  }
  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.focusColor};
    outline-offset: 2px;
  }
`;

const LoadingText = styled.div`
  padding: 40px 0;
`;

const ErrorText = styled.div`
  padding: 40px 0;
  color: #ef4444;
`;
const DebugDiv = styled.div`
  height: 100vh;
`;

function ManageScreen({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <UserManagementScreen />;
    case 1:
      return <ReportManageScreen />;
    case 2:
      return (
        <div>
          <ProblemManagementScreen />;
        </div>
      );
    default:
      return (
        <div>
          <h3>error</h3>
        </div>
      );
  }
}

export default function ManagePage() {
  const { username } = useParams<{ username: string }>();
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: USE_DUMMY ? ["dummyUserProfile"] : ["userProfile", username],
    queryFn: async () =>
      USE_DUMMY ? getDummyUserProfile() : await getUserProfile(username ?? ""),
    staleTime: 5 * 60 * 1000,
  });

  const [navigateState, setNavigateState] = useState<number>(0);
  const handleNavigateClick = (index: number) => {
    setNavigateState(index);
  };

  if (isLoading)
    return <LoadingText>프로필 정보를 불러오는 중입니다…</LoadingText>;
  if (isError || !user)
    return <ErrorText>프로필 정보를 불러오는 데 실패했어요.</ErrorText>;

  return (
    <Wrapper>
      <Title>관리자 페이지</Title>
      <NavigateBar>
        {["유저 관리", "신고 관리", "문제 관리"].map((label, index) => (
          <NavigateItem
            key={index}
            onClick={() => handleNavigateClick(index)}
            $active={navigateState === index}
          >
            {label}
          </NavigateItem>
        ))}
      </NavigateBar>

      <ManageScreen index={navigateState} />
      <DebugDiv></DebugDiv>
    </Wrapper>
  );
}
