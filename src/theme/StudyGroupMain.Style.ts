import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px 20px;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
`;

export const HeaderContainer = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.authHoverBgColor};
  color: ${(props) => props.theme.textColor};
  padding-bottom: 15px;

  h1 {
    font-size: 30px;
    font-weight: 700;
    color: ${(props) => props.theme.textColor};
  }
  p {
    font-size: 18px;
    margin-top: 5px;
    opacity: 0.8;
    color: ${(props) => props.theme.textColor};
  }
`;

export const SectionContainer = styled.div`
  margin-bottom: 50px;
  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 25px;
    padding-bottom: 8px;
    border-bottom: 1px dashed ${(props) => props.theme.authHoverBgColor};
    color: ${(props) => props.theme.textColor};
  }
`;

export const MyGroupSection = styled(SectionContainer)`
  background-color: ${(props) => props.theme.authHoverBgColor};
  padding: 20px;
  border-radius: 10px;
`;

export const AddButton = styled.button`
  padding: 12px 30px;
  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.authHoverTextColor};
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
`;

export const SearchInput = styled.input`
  padding: 10px 15px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  width: 300px;
  font-size: 18px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.headerBgColor};
`;

// 그룹 카드 레이아웃
export const GroupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const BaseCard = styled.div`
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${(props) => props.theme.textColor};
  h3 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    color: ${(props) => props.theme.textColor};
  }
  p {
    font-size: 18px;
    opacity: 1;
    color: ${(props) => props.theme.textColor};
  }
`;

export const MyGroupCard = styled(BaseCard)`
  background-color: ${(props) => props.theme.bgColor};
  border: 2px solid ${(props) => props.theme.logoColor};
`;

export const GroupCard = styled(BaseCard)`
  background-color: ${(props) => props.theme.headerBgColor};
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const GroupLeader = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.logoColor};
  margin: 2px 0 5px 0;
`;

export const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  span {
    color: ${(props) => props.theme.authHoverBgColor};
    background-color: ${(props) => props.theme.focusColor};
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 18px;
  }
`;

export const JoinButton = styled.button`
  margin-top: 10px;
  padding: 10px 15px;
  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.authHoverTextColor};
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
`;

export const EmptyMessage = styled.p`
  font-size: 16px;
  opacity: 0.7;
`;

export const ControlBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;
//태그
export const TagDisplayContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
`;

export const TagChip = styled.span<{ active?: boolean }>`
  display: inline-flex;
  align-items: center;
  background-color: ${(props) =>
    props.active ? props.theme.focusColor : props.theme.authHoverBgColor};
  color: ${(props) => props.theme.textColor};
  padding: 4px 9px;
  border-radius: 13px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
