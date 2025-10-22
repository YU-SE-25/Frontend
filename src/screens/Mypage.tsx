import { useParams } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;
const UserName = styled.h2`
  margin-top: 10px;
  font-size: 24px;
  color: ${(props) => props.theme.textColor};
  text-align: center;
`;
interface IUser {
  id: number;
  userName: string;
  avatarUrl: string;
}
const userExample: IUser[] = [
  {
    id: 1,
    userName: "exampleUser",
    avatarUrl: "https://avatars.githubusercontent.com/u/122136634?v=4",
  },
  {
    id: 2,
    userName: "anotherUser",
    avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
  },
];
export default function Mypage() {
  const { userName } = useParams();
  return (
    <Container>
      <Avatar
        src="https://avatars.githubusercontent.com/u/122136634?v=4"
        alt="User Avatar"
      />
      <UserName>{userName}</UserName>
    </Container>
  );
}
