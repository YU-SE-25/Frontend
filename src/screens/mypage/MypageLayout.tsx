/*******************나중에 할 것*****************
실제 API로 교체


*************************************************/
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getDummyUserProfile } from "../../api/dummy/mypage_dummy"; //더미 API 사용
import { getUserProfile } from "../../api/mypage_api";
import {
  SiPython,
  SiCplusplus,
  SiJavascript,
  SiCoffeescript,
} from "react-icons/si";
const USE_DUMMY = true; //더미 데이터 사용 여부!

const Page = styled.div`
  max-width: 1040px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  gap: 20px;
`;

const Head = styled.header`
  color: ${(props) => props.theme.textColor};
  display: flex;
  align-items: top;
  justify-content: left;
  margin-top: 40px;
`;

const UserImg = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
`;

const UserInfo = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
`;
const Username = styled.h1`
  font-size: 60px;
  font-weight: bold;
  color: ${(props) => props.theme.textColor};
`;
const Bio = styled.p`
  font-size: 20px;
  margin-top: 15px;
  color: ${(props) => props.theme.textColor};
`;
const Chips = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;
const LangIcon = (tone: string) => {
  switch (tone) {
    case "Python":
      return <SiPython size={16} />;
    case "Java":
      return <SiCoffeescript size={16} />;
    case "C++":
      return <SiCplusplus size={16} />;
    case "JavaScript":
      return <SiJavascript size={16} />;
    default:
      return null;
  }
};
const LangChip = styled.div<{ tone?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  border-radius: 999px;
  background: ${({ tone }) => {
    switch (tone) {
      case "Python":
        return "#3776AB";
      case "Java":
        return "#E11E1E";
      case "C++":
        return "#00599C";
      case "JavaScript":
        return "#F7DF1E";
      case "more":
        return "#555555";
      default:
        return "#888";
    }
  }};
  span {
    margin-left: 6px;
    color: white;
  }
  svg {
    fill: ${({ tone }) => {
      switch (tone) {
        case "Python":
          return "#FFD43B";
        case "Java":
          return "#FFFFFF";
        case "C++":
          return "#FFFFFF";
        case "JavaScript":
          return "#000000";
        default:
          return "#FFFFFF";
      }
    }};
  }
`;
const Muted = styled.div`
  color: ${(props) => props.theme.textColor};
  font-size: 13px;
  opacity: 0.7;
`;
export default function MyPageLayout() {
  const userId = "123"; //임시 유저 ID

  //fetch user profile data
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () =>
      USE_DUMMY ? getDummyUserProfile() : await getUserProfile(userId),
    staleTime: 5 * 60 * 1000, //5분 이내에는 캐시 사용
  });
  if (isLoading) return <div>불러오는 중…</div>;
  if (isError || !user) return <div>에러가 발생했어요.</div>;

  console.log(user); //debug log
  return (
    <Page>
      <Head>
        <UserImg src={user.avatarUrl} alt="User Profile" />
        <UserInfo>
          <Username>{user.username}</Username>
          <Bio>{user.bio}</Bio>
          <Chips>
            {user.prefferred_language?.slice(0, 5).map((lang) => (
              <LangChip key={lang} tone={lang}>
                {LangIcon(lang)}
                <span>{lang}</span>
              </LangChip>
            ))}
            {(user.prefferred_language?.length ?? 0) > 5 && (
              <LangChip tone="more">
                + {(user.prefferred_language?.length ?? 0) - 5}..
              </LangChip>
            )}
          </Chips>
        </UserInfo>
      </Head>
    </Page>
  );
}
