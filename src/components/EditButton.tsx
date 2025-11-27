import styled from "styled-components";

import { useNavigate } from "react-router-dom";

export default function EditButton({ to, state }: { to: string; state: any }) {
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(to, { state });
  };
  const handleDelete = () => {
    const yes = window.confirm("정말로 삭제하시겠습니까?");
    if (yes) {
      alert("삭제되었습니다. (실제 삭제 기능은 구현되어 있지 않습니다.)");
      navigate(-1);
    }
  };

  return (
    <>
      <Btn onClick={handleEdit}>수정</Btn>
      <Span>|</Span>
      <Btn onClick={handleDelete}>삭제</Btn>
    </>
  );
}

const Btn = styled.span`
  background: none;
  border: none;
  color: ${({ theme }) => theme.muteColor};
  cursor: pointer;
  font-size: 13px;
  padding: 0 4px;

  &:hover {
    opacity: 0.8;
    font-style: underline;
  }
`;
const Span = styled.span`
  color: ${({ theme }) => theme.muteColor};
  font-size: 13px;
  padding: 0 4px;
  border: none;
  background: none;
  cursor: default;
`;
