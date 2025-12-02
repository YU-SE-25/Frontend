// src/pages/board/BoardWrite.tsx
import { useAtomValue } from "jotai";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { userProfileAtom } from "../../atoms";
import { createDiscussPost, updateDiscussPost } from "../../api/board_api"; // ✅ 추가

export type BoardCategory = "daily" | "lecture" | "promotion" | "typo";

const CATEGORY_LABEL: Record<BoardCategory, string> = {
  daily: "토론 게시판",
  lecture: "강의",
  promotion: "홍보",
  typo: "오타",
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

//----- 스터디그룹 코드 -----
interface BoardWriteProps {
  mode?: "board" | "study";
  groupId?: number;
}

// 수정 모드에서 받을 게시글 형태(필요한 최소 필드만)
interface EditPostState {
  id: number;
  category: BoardCategory;
  title: string;
  content: string;
  isAnonymous: boolean;
  isPrivate: boolean;
  groupId?: number;
}

interface LocationState {
  post?: EditPostState;
}

export default function BoardWrite({
  mode = "board",
  groupId,
}: BoardWriteProps) {
  const navigate = useNavigate();
  const params = useParams();
  const { category: routeCategory } = useParams();
  const location = useLocation();
  const user = useAtomValue(userProfileAtom);

  const effectiveGroupId = Number(params.groupId ?? groupId);
  const isStudy = mode === "study";

  const editPost = (location.state as LocationState | null)?.post;
  const isEditMode = !!editPost;

  const initialCategory: BoardCategory =
    editPost?.category ??
    (routeCategory === "daily" ||
    routeCategory === "lecture" ||
    routeCategory === "promotion" ||
    routeCategory === "typo"
      ? (routeCategory as BoardCategory)
      : "daily");

  const initialTitle = editPost?.title ?? "";
  const initialContent = editPost?.content ?? "";
  const initialIsAnonymous = editPost?.isAnonymous ?? false;
  const initialIsPrivate = editPost?.isPrivate ?? false;

  const [category, setCategory] = useState<BoardCategory>(initialCategory);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(initialIsAnonymous);
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate);

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const isDirty =
    title !== initialTitle ||
    content !== initialContent ||
    isAnonymous !== initialIsAnonymous ||
    isPrivate !== initialIsPrivate ||
    category !== initialCategory;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isStudy) {
      setCategory("daily");
      setIsPrivate(false);
    }
  }, [isStudy]);

  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleCancel = () => {
    if (isDirty) {
      const ok = window.confirm(
        "작성 중인 내용이 저장되지 않았습니다. 나가시겠습니까?"
      );
      if (!ok) return;
    }
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setError("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    const ok = window.confirm(
      isEditMode ? "게시글을 수정하시겠습니까?" : "게시글을 등록하시겠습니까?"
    );
    if (!ok) return;

    setError(null);

    try {
      setIsSubmitting(true);

      if (isStudy) {
        const studyPayload = {
          post_title: title.trim(),
          contents: content.trim(),
          tag: "discussion",
          anonymity: isAnonymous,
          is_private: false,
        };

        if (isEditMode && editPost) {
          console.log("스터디그룹 글 수정 payload:", {
            id: editPost.id,
            ...studyPayload,
          });
          alert("스터디그룹 글 수정 완료! (더미)");
        } else {
          console.log("스터디그룹 글 작성 payload:", studyPayload);
          alert("스터디그룹 글 작성 완료! (더미)");
        }

        if (effectiveGroupId) {
          navigate(`/studygroup/${effectiveGroupId}`);
        } else {
          navigate("/studygroup");
        }
        return;
      }

      const payload = {
        anonymous: isAnonymous,
        title: title.trim(),
        contents: content.trim(),
        privatePost: isPrivate,
        attachmentUrl: null,
      };

      if (isEditMode && editPost) {
        await updateDiscussPost(editPost.id, payload);
      } else {
        await createDiscussPost(payload);
      }

      if (isEditMode && editPost) {
        navigate(-1);
      } else {
        navigate("/board/" + category);
      }
    } catch (e) {
      console.error("게시글 저장 오류:", e);
      setError("글 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page>
      <Wrapper as="form" onSubmit={handleSubmit}>
        <Title>{isEditMode ? "게시글 수정" : "게시글 작성"}</Title>

        {!isStudy && (
          <FieldRow>
            <Label>카테고리</Label>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as BoardCategory)}
                disabled={isEditMode}
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

              {!isStudy && (
                <CheckboxLabel>
                  <Checkbox
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                  />
                  비밀글
                </CheckboxLabel>
              )}
            </div>
          </FieldRow>
        )}

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
          <LeftOptions />
          <ButtonRow>
            <GhostButton type="button" onClick={handleCancel}>
              취소
            </GhostButton>
            <PrimaryButton type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? "수정 중..."
                  : "작성 중..."
                : isEditMode
                ? "수정 완료"
                : "등록"}
            </PrimaryButton>
          </ButtonRow>
        </BottomRow>
      </Wrapper>
    </Page>
  );
}
