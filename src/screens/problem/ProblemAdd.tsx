import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  RegisterWrapper,
  MainContent,
  TitleRow,
  SectionTitle,
  InputGroup,
  Label,
  StyledInput,
  StyledTextArea,
  MainButton,
  ErrorMessage,
  StyledSelect,
  TagDisplayContainer,
  TagChip,
  RemoveTagButton,
} from "../../theme/ProblemAdd.Style";

import {
  fetchAvailableTags,
  registerProblem,
  updateProblem,
  fetchProblemDetailForEdit,
  TAG_LABEL_MAP,
  TAG_REVERSE_MAP,
} from "../../api/problem_api";

const DIFFICULTY_OPTIONS = [
  { ko: "하", value: "EASY" },
  { ko: "중", value: "MEDIUM" },
  { ko: "상", value: "HARD" },
];

export default function ProblemAdd() {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const isEdit = !!problemId;

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    description: "",
    inputOutputExample: "",
    timeLimit: "",
    memoryLimit: "",
    difficulty: "EASY",
    hint: "",
    source: "",
    visibility: "PUBLIC",
  });

  const [tags, setTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [errorMessage, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /** 태그 목록 불러오기 */
  useEffect(() => {
    const load = async () => {
      const fetched = await fetchAvailableTags();
      setAvailableTags(fetched);
    };
    load();
  }, []);

  /** 수정 모드 → 기존 내용 로드 */
  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      const data = await fetchProblemDetailForEdit(Number(problemId));
      if (!data) return;

      setForm({
        title: data.title,
        summary: data.summary ?? "",
        description: data.description,
        inputOutputExample: data.inputOutputExample,
        difficulty: data.difficulty,
        timeLimit: String(data.timeLimit),
        memoryLimit: String(data.memoryLimit),
        hint: data.hint ?? "",
        source: data.source ?? "",
        visibility: "PUBLIC",
      });

      setTags(data.tags ?? []);
    })();
  }, [isEdit, problemId]);

  /** 필수값 체크 */
  const isValid = useMemo(() => {
    return (
      form.title.trim() &&
      form.summary.trim() &&
      form.description.trim() &&
      form.inputOutputExample.trim() &&
      form.timeLimit &&
      form.memoryLimit
    );
  }, [form]);

  /** 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isValid) {
      setError("필수 항목을 모두 입력해야 합니다.");
      setLoading(false);
      return;
    }

    if (!isEdit && !fileRef.current?.files?.[0]) {
      setError("테스트케이스 파일은 필수입니다.");
      setLoading(false);
      return;
    }

    const payload = {
      title: form.title,
      summary: form.summary,
      description: form.description,
      inputOutputExample: form.inputOutputExample,
      difficulty: form.difficulty,
      timeLimit: Number(form.timeLimit),
      memoryLimit: Number(form.memoryLimit),
      tags: tags,
      hint: form.hint,
      source: form.source,
      visibility: "PUBLIC",
    };

    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    const selectedFile = fileRef.current?.files?.[0];

    if (selectedFile && selectedFile.size > 1 * 1024 * 1024) {
      alert("파일 크기가 너무 큽니다.");
      setLoading(false);
      return;
    }

    if (selectedFile) {
      formData.append("testcaseFile", selectedFile);
    }

    tags.forEach((t) => {
      const eng = TAG_REVERSE_MAP[t] ?? t;
      formData.append("tags", eng);
    });

    formData.append("hint", form.hint);
    formData.append("source", form.source);

    try {
      if (isEdit) {
        await updateProblem(Number(problemId), formData);
        alert("문제가 수정되었습니다!");
      } else {
        await registerProblem(formData);
        alert("문제가 등록되었습니다!");
      }

      navigate(`/problem-list`);
    } catch (err) {
      console.error(err);
      setError("요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // ⬆️ 여기까지 handleSubmit 함수
  // ----------------------------

  return (
    <RegisterWrapper>
      <MainContent>
        <TitleRow>
          <h1>{isEdit ? "문제 수정" : "문제 등록"}</h1>
        </TitleRow>

        <form onSubmit={handleSubmit}>
          {/* --- 이하 동일, 전부 살림! --- */}

          <SectionTitle>기본 정보</SectionTitle>

          <InputGroup>
            <Label>문제 제목</Label>
            <StyledInput
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </InputGroup>

          <InputGroup>
            <Label>난이도</Label>
            <StyledSelect
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.ko}
                </option>
              ))}
            </StyledSelect>
          </InputGroup>

          <InputGroup>
            <Label>태그</Label>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
              }}
            >
              <StyledSelect
                onChange={(e) => {
                  const value = e.target.value;

                  if (tags.length >= 3) {
                    alert("태그는 최대 3개까지 선택할 수 있습니다!");
                    return;
                  }

                  if (!tags.includes(value)) {
                    setTags([...tags, value]);
                  }
                }}
                value=""
              >
                <option value="" disabled>
                  태그 선택
                </option>

                {availableTags
                  .filter((t) => !tags.includes(t))
                  .map((t) => (
                    <option key={t} value={t}>
                      {TAG_LABEL_MAP[t] ?? t}
                    </option>
                  ))}
              </StyledSelect>

              <TagDisplayContainer>
                {tags.map((t) => (
                  <TagChip key={t}>
                    {TAG_LABEL_MAP[t] ?? t}
                    <RemoveTagButton
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                    >
                      ×
                    </RemoveTagButton>
                  </TagChip>
                ))}
              </TagDisplayContainer>
            </div>
          </InputGroup>

          <SectionTitle>문제 설명</SectionTitle>

          <InputGroup>
            <Label>문제 요약</Label>
            <StyledTextArea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="이 문제를 간단히 요약해주세요. (최대 255자)"
              maxLength={255}
            />
          </InputGroup>

          <InputGroup>
            <Label>설명</Label>
            <StyledTextArea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </InputGroup>

          <InputGroup>
            <Label>입출력 예시 전체</Label>
            <StyledTextArea
              value={form.inputOutputExample}
              onChange={(e) =>
                setForm({ ...form, inputOutputExample: e.target.value })
              }
            />
          </InputGroup>

          <SectionTitle>제한</SectionTitle>

          <InputGroup>
            <Label>시간 제한 (ms)</Label>
            <StyledInput
              type="number"
              value={form.timeLimit}
              onChange={(e) => setForm({ ...form, timeLimit: e.target.value })}
            />
          </InputGroup>

          <InputGroup>
            <Label>메모리 제한 (MB)</Label>
            <StyledInput
              type="number"
              value={form.memoryLimit}
              onChange={(e) =>
                setForm({ ...form, memoryLimit: e.target.value })
              }
            />
          </InputGroup>

          <InputGroup>
            <Label>테스트케이스 파일 (필수)</Label>
            <StyledInput type="file" ref={fileRef} />
          </InputGroup>

          <SectionTitle>추가</SectionTitle>

          <InputGroup>
            <Label>힌트</Label>
            <StyledInput
              value={form.hint}
              onChange={(e) => setForm({ ...form, hint: e.target.value })}
            />
          </InputGroup>

          <InputGroup>
            <Label>출처</Label>
            <StyledInput
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            />
          </InputGroup>

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

          <MainButton type="submit" disabled={!isValid || loading}>
            {loading ? "처리 중..." : isEdit ? "수정하기" : "등록하기"}
          </MainButton>
        </form>
      </MainContent>
    </RegisterWrapper>
  );
}
