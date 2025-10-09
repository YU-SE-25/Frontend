import styled from "styled-components";

const Cat = styled.img`
  width: auto;
  height: auto;
`;

export default function Main() {
  return (
    <Cat src="https://camo.githubusercontent.com/89946a1fdbfdf5c66275e9d78ccf6191cddfee5afd3578d22bcc14002deea052/68747470733a2f2f632e74656e6f722e636f6d2f42543849356233356f4d5141414141432f6f61746d65616c2d6d656d652e676966" />
  );
}
