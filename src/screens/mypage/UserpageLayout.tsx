/*******************나중에 할 것*****************
실제 API로 교체


*************************************************/
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getDummyUserProfile } from "../../api/dummy/mypage_dummy"; //더미 API 사용
import { getUserProfile } from "../../api/mypage_api";

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

export default function UserPageLayout() {
  const userId = "123"; //임시 유저 ID
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
  console.log(user);
  return (
    <Page>
      <Head>
        <UserImg
          src="https://media.tenor.com/CNI1fSM1XSoAAAAe/shocked-surprised.png"
          alt="User Profile"
        />
        <UserInfo>
          <Username>{user.username}</Username>
        </UserInfo>
      </Head>
    </Page>
  );
}
