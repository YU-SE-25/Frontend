import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;
export default function Mypage() {
  return (
    <Container>
      <Avatar
        src="https://avatars.githubusercontent.com/u/122136634?v=4"
        alt="User Avatar"
      />
    </Container>
  );
}
