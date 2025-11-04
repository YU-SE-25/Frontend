import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  color: ${(props) => props.theme.logoColor};
`;

const Subtitle = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.textColor};
`;

export default function Main() {
  return (
    <Wrapper>
      <Title>UnIDE</Title>
      <Subtitle>
        단순한 채점 플랫폼을 넘어, 학습자의 알고리즘 이해와 성장을 돕는 지능형
        IDE
      </Subtitle>
      {/*특징 설명 추후 추가 예정*/}
      {/*주간 순위 또한 추후 추가 예정*/}
    </Wrapper>
  );
}
