import { useAtomValue } from "jotai";
import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { userProfileAtom } from "../../atoms";

type BoardCategory = "discussion" | "qna";

const CATEGORY_LABEL: Record<BoardCategory, string> = {
  // free: "자유게시판",
  discussion: "토론게시판",
  qna: "Q&A 게시판",
};

const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 60px 16px 40px;
  background: ${({ theme }) => theme.bgColor};
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 900px;
  background: ${({ theme }) => theme.bgCardColor ?? theme.bgColor};
  border-radius: 16px;
  padding: 24px 24px 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.textColor};
`;

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textColor}CC;
`;

const RequiredDot = styled.span`
  color: #ff4d4f;
  margin-left: 3px;
`;

const TextInput = styled.input`
  width: auto;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.textColor};
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.focusColor ?? "#4c6fff"};
  }
`;

const Select = styled.select`
  width: 220px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.textColor};
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.focusColor ?? "#4c6fff"};
  }
`;

const TextArea = styled.textarea`
  width: auto;
  min-height: 260px;
  resize: vertical;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.textColor};
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.focusColor ?? "#4c6fff"};
  }
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  gap: 12px;
`;

const LeftOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.muteColor};
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 13px;
  color: ${({ theme }) => theme.textColor};
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const PrimaryButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: ${({ theme }) => theme.focusColor};
  color: white;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const GhostButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.textColor};
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #ff4d4f;
`;

export default function BoardWrite() {
  const navigate = useNavigate();
  const { p } = useParams();

  const [category, setCategory] = useState<BoardCategory>(
    p === "qna" ? p : "discussion"
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const user = useAtomValue(userProfileAtom);

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const handleCancel = () => {
    const ok = window.confirm("작성 중인 내용을 취소할까요?");
    if (!ok) return;
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError("제목과 내용을 모두 입력해 주세요.");
      return;
    }
    setError(null);
    try {
      setIsSubmitting(true);
      const payload = {
        authorId: user?.userId ?? 0, //추가 요망
        category,
        title: title.trim(),
        content: content.trim(),
        isAnonymous: isAnonymous,
        privatePost: isPrivate, //추가 요망
      };
      console.log("게시글 전송 payload", payload);
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate("/board/" + category);
    } catch (e) {
      setError("글 작성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <Page>
      <Wrapper as="form" onSubmit={handleSubmit}>
        <Title>게시글 작성</Title>

        <FieldRow>
          <Label>카테고리</Label>

          {/* 카테고리 드롭다운 + 익명 체크박스 row */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as BoardCategory)}
            >
              {(Object.keys(CATEGORY_LABEL) as BoardCategory[]).map((key) => (
                <option key={key} value={key}>
                  {CATEGORY_LABEL[key]}
                </option>
              ))}
            </Select>

            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              익명 작성
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              비밀글
            </CheckboxLabel>
          </div>
        </FieldRow>

        <FieldRow>
          <Label>
            제목
            <RequiredDot>*</RequiredDot>
          </Label>
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해 주세요."
          />
        </FieldRow>

        <FieldRow>
          <Label>
            내용
            <RequiredDot>*</RequiredDot>
          </Label>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력해 주세요."
          />
        </FieldRow>

        {error && <ErrorText>{error}</ErrorText>}

        <BottomRow>
          <LeftOptions></LeftOptions>

          <ButtonRow>
            <GhostButton type="button" onClick={handleCancel}>
              취소
            </GhostButton>
            <PrimaryButton type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "작성 중..." : "등록"}
            </PrimaryButton>
          </ButtonRow>
        </BottomRow>
      </Wrapper>
    </Page>
  );
}
