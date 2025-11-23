/*******************나중에 할 것*****************
실제 API로 교체


*************************************************/
import { Outlet, useParams } from "react-router-dom";
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
import Sidebar from "../../components/mypage_sidebar";
import { useAtomValue } from "jotai";
import { userProfileAtom } from "../../atoms";
const USE_DUMMY = true; //더미 데이터 사용 여부!

//css styles
const Page = styled.div`
  max-width: 2080px;
  margin: 0 auto;
  padding: 24px;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
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

const Body = styled.div`
  max-width: 1200px;
  margin-top: 30px;
  width: 100%;
  height: auto;
  display: flex;
`;

export default function MyPageLayout() {
  const { username } = useParams<{ username: string }>();
  const userProfile = useAtomValue(userProfileAtom) ?? {
    nickname: "guest",
    role: "GUEST",
    userId: "0",
  };
  //내 페이지인지 판별
  const isMypage = userProfile.nickname === username ? true : false;

  const userId = "23"; //여기서 뭔가 문제가 있는거 같아요...

  //fetch user profile data
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: USE_DUMMY ? ["dummyUserProfile"] : ["userProfile", userId],
    queryFn: async () =>
      USE_DUMMY ? getDummyUserProfile() : await getUserProfile(userId!),
    staleTime: 5 * 60 * 1000, //5분 이내에는 캐시 사용
  });
  if (isLoading) return <div>불러오는 중…</div>;
  if (isError || !user) return <div>에러가 발생했어요.</div>;
  console.log("role in sidebar:", userProfile.role);

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
      <Body>
        <Sidebar isMyPage={isMypage} role={userProfile.role} />
        <Outlet />
      </Body>
    </Page>
  );
}
