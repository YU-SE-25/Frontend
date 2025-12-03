// src/pages/qna/QnaWrite.tsx
import { useAtomValue } from "jotai";
import React, { useState, useMemo, useEffect } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import styled from "styled-components";
import { userProfileAtom } from "../../atoms";

// QnA API
import {
  addProblemNumber,
  createqnaPost,
  updateqnaPost,
} from "../../api/qna_api";

// 문제 API
import type { IProblem, SimpleProblem } from "../../api/problem_api";
import { fetchProblemDetail, fetchSimpleProblems } from "../../api/problem_api";

// ----------------- styled-components -----------------
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
  max-width: 1100px;
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

const Layout = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 8px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const LeftPane = styled.div`
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const RightPane = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const ProblemBox = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  background: ${({ theme }) => theme.bgColor};
  border: 1px solid ${({ theme }) => theme.textColor}33;
  color: ${({ theme }) => theme.textColor};
  font-size: 14px;
  line-height: 1.5;
  max-height: 360px;
  overflow-y: auto;

  pre {
    margin: 4px 0;
    padding: 6px 8px;
    border-radius: 8px;
    background: ${({ theme }) => theme.bgCardColor ?? "#111"};
    font-size: 12px;
    white-space: pre-wrap;
  }
`;

const ProblemInfoBox = styled.div`
  padding: 16px 20px;
  background: ${({ theme }) => theme.bgCardColor ?? theme.bgColor};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.textColor}22;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 12px;
`;

const ProblemHeader = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.textColor};
  margin: 0;
`;

const ProblemSubText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textColor}99;
  margin-top: -6px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const SectionContent = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor};
  line-height: 1.45;
  white-space: pre-wrap;
`;

const ProblemMetaRow = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}cc;
`;

const ExampleBlock = styled.div`
  background: ${({ theme }) => theme.bgColor};
  border: 1px solid ${({ theme }) => theme.textColor}33;
  padding: 10px 12px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ExampleCode = styled.pre`
  background: ${({ theme }) => theme.bgCardColor};
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.textColor};
  overflow-x: auto;
  white-space: pre-wrap;
`;

const ProblemMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.muteColor};
  margin-bottom: 6px;
`;

const ResultList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.textColor}22;
  max-height: 260px;
  overflow-y: auto;
`;
const MuteSpan = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.muteColor};
`;

const ResultItem = styled.li<{ $active?: boolean }>`
  padding: 8px 10px;
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
  background: ${({ $active, theme }) =>
    $active ? theme.focusColor + "22" : "transparent"};
  color: ${({ theme }) => theme.textColor};

  &:hover {
    background: ${({ theme }) => theme.focusColor + "33"};
  }

  .pid {
    font-weight: 600;
    font-size: 12px;
    color: ${({ theme }) => theme.muteColor};
  }

  .ptitle {
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: ${({ theme }) => theme.textColor};
  }
`;

// ----------------- 타입 -----------------
type EditPostState = {
  state: "edit";
  id: number;
  problemId?: number;
  title: string;
  content: string;
  isAnonymous: boolean;
  isPrivate: boolean;
};

type QnaWritePayload = {
  anonymous: boolean;
  title: string;
  contents: string;
  privatePost: boolean;
  problemId: number;
  attachmentUrl?: string | null;
};

// ----------------- 컴포넌트 -----------------
export default function QnaWrite() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const user = useAtomValue(userProfileAtom);

  const editPost = (location.state as any)?.post as EditPostState | undefined;
  const isEditMode = editPost?.state === "edit";

  const rawProblemIdFromEdit =
    isEditMode && editPost?.problemId != null
      ? String(editPost.problemId)
      : null;
  const rawProblemIdFromQuery = searchParams.get("id");

  const initialProblemIdParam = rawProblemIdFromEdit || rawProblemIdFromQuery;
  const initialProblemId = initialProblemIdParam
    ? Number(initialProblemIdParam)
    : undefined;

  const [problemList, setProblemList] = useState<SimpleProblem[]>([]);
  const [problemListLoading, setProblemListLoading] = useState(false);

  const [selectedProblem, setSelectedProblem] = useState<SimpleProblem | null>(
    null
  );
  const [problemKeyword, setProblemKeyword] = useState(
    initialProblemId ? String(initialProblemId) : ""
  );

  const [problemDetail, setProblemDetail] = useState<IProblem | null>(null);
  const [problemLoading, setProblemLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadList = async () => {
      try {
        setProblemListLoading(true);
        const list = await fetchSimpleProblems();
        if (cancelled) return;

        setProblemList(list);

        if (initialProblemId && !selectedProblem) {
          const found = list.find((p) => p.problemId === initialProblemId);
          if (found) {
            setSelectedProblem(found);
            setProblemKeyword(String(found.problemId));
          }
        }
      } catch (e) {
        console.error("문제 목록 로드 실패:", e);
      } finally {
        if (!cancelled) setProblemListLoading(false);
      }
    };

    loadList();

    return () => {
      cancelled = true;
    };
    // initialProblemId, selectedProblem는 초기 셋업용
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedProblem) {
      setProblemDetail(null);
      return;
    }

    let cancelled = false;

    const loadDetail = async () => {
      try {
        setProblemLoading(true);
        const data = await fetchProblemDetail(selectedProblem.problemId);
        if (!cancelled) {
          setProblemDetail(data);
        }
      } catch (e) {
        console.error("문제 정보 로드 실패:", e);
        if (!cancelled) setProblemDetail(null);
      } finally {
        if (!cancelled) setProblemLoading(false);
      }
    };

    loadDetail();

    return () => {
      cancelled = true;
    };
  }, [selectedProblem]);

  const [title, setTitle] = useState(isEditMode ? editPost?.title ?? "" : "");
  const [content, setContent] = useState(
    isEditMode ? editPost?.content ?? "" : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(
    isEditMode ? !!editPost?.isAnonymous : false
  );
  const [isPrivate, setIsPrivate] = useState(
    isEditMode ? !!editPost?.isPrivate : false
  );

  const isValid =
    !!selectedProblem && title.trim().length > 0 && content.trim().length > 0;

  const filteredProblems = useMemo(() => {
    const q = problemKeyword.trim().toLowerCase();
    if (!q) return problemList;

    return problemList.filter(
      (p) =>
        p.problemId.toString().includes(q) ||
        p.problemTitle.toLowerCase().includes(q)
    );
  }, [problemKeyword, problemList]);

  const handleSelectProblem = (p: SimpleProblem) => {
    if (isEditMode && editPost?.problemId != null) return;
    setSelectedProblem(p);
    setProblemKeyword(String(p.problemId));
  };

  const handleCancel = () => {
    const ok = window.confirm(
      isEditMode ? "수정을 취소할까요?" : "작성 중인 내용을 취소할까요?"
    );
    if (!ok) return;
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblem) {
      setError("질문을 남길 문제를 먼저 선택해 주세요.");
      return;
    }
    if (!isValid) {
      setError("제목과 내용을 모두 입력해 주세요.");
      return;
    }
    setError(null);

    const basePayload: QnaWritePayload = {
      anonymous: isAnonymous,
      title: title.trim(),
      contents: content.trim(),
      privatePost: isPrivate,
      problemId: selectedProblem.problemId,
      attachmentUrl: null,
    };

    try {
      setIsSubmitting(true);

      if (isEditMode && editPost) {
        const payloadWithId = { ...basePayload, postId: editPost.id };
        await updateqnaPost(editPost.id, payloadWithId);

        alert("질문이 수정되었습니다.");
        navigate(-1);
      } else {
        const problemId = selectedProblem.problemId;
        const created = await createqnaPost(basePayload);
        const selectedPostId = created?.postId;
        await addProblemNumber(selectedPostId, problemId);
        alert("질문이 등록되었습니다.");

        if (created && typeof created.postId === "number") {
          navigate(`/qna?no=${created.postId}`);
        } else {
          navigate(`/qna?id=${selectedProblem.problemId}`);
        }
      }
    } catch (e) {
      console.error("QnA 작성/수정 실패:", e);
      setError(
        isEditMode
          ? "질문 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
          : "질문 작성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
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
        <Title>{isEditMode ? "Q&A 질문 수정" : "Q&A 질문 작성"}</Title>

        <Layout>
          <LeftPane>
            <FieldRow>
              <Label>
                문제 선택
                <RequiredDot>*</RequiredDot>
              </Label>
              <TextInput
                value={problemKeyword}
                onChange={(e) => setProblemKeyword(e.target.value)}
                placeholder={
                  isEditMode && editPost?.problemId != null
                    ? "문제는 수정할 수 없습니다."
                    : "문제 번호 또는 제목으로 검색"
                }
                disabled={isEditMode && editPost?.problemId != null}
              />
            </FieldRow>

            <ProblemBox>
              {problemLoading && (
                <ProblemMeta>문제 정보를 불러오는 중...</ProblemMeta>
              )}
              {!problemLoading && selectedProblem && problemDetail && (
                <ProblemInfoBox>
                  <ProblemHeader>
                    #{selectedProblem.problemId} {problemDetail.title}
                  </ProblemHeader>

                  <ProblemSubText>
                    이 문제에 대한 질문을 작성합니다.
                  </ProblemSubText>

                  <Section>
                    <SectionTitle>설명</SectionTitle>
                    <SectionContent>
                      {problemDetail.description || "설명 없음"}
                    </SectionContent>
                  </Section>

                  <Section>
                    <ProblemMetaRow>입력과 출력</ProblemMetaRow>
                  </Section>

                  {problemDetail.inputOutputExample && (
                    <Section>
                      <SectionTitle>예제 1</SectionTitle>
                      <ExampleBlock>
                        <ExampleCode>
                          {problemDetail.inputOutputExample}
                        </ExampleCode>
                      </ExampleBlock>
                    </Section>
                  )}

                  <ProblemMetaRow>
                    제한: {problemDetail.timeLimit}ms /{" "}
                    {problemDetail.memoryLimit}KB
                  </ProblemMetaRow>
                </ProblemInfoBox>
              )}

              {!problemLoading && !selectedProblem && (
                <ProblemMeta>
                  왼쪽 검색창에서 질문을 남길 문제를 선택해 주세요.
                </ProblemMeta>
              )}
            </ProblemBox>

            <ResultList>
              {problemListLoading && filteredProblems.length === 0 ? (
                <li style={{ padding: "8px 10px", fontSize: 13 }}>
                  문제 목록을 불러오는 중입니다...
                </li>
              ) : (
                filteredProblems.map((p) => (
                  <ResultItem
                    key={p.problemId}
                    $active={selectedProblem?.problemId === p.problemId}
                    onClick={() => handleSelectProblem(p)}
                  >
                    <span className="pid">#{p.problemId}</span>
                    <span className="ptitle">{p.problemTitle}</span>
                  </ResultItem>
                ))
              )}
            </ResultList>
          </LeftPane>

          <RightPane>
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

            <FieldRow>
              <Label>옵션</Label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
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
                {isAnonymous && (
                  <MuteSpan>익명 작성은 수정이 불가합니다.</MuteSpan>
                )}
              </div>
            </FieldRow>

            {error && <ErrorText>{error}</ErrorText>}

            <BottomRow>
              <LeftOptions />
              <ButtonRow>
                <GhostButton type="button" onClick={handleCancel}>
                  취소
                </GhostButton>
                <PrimaryButton
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
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
          </RightPane>
        </Layout>
      </Wrapper>
    </Page>
  );
}
