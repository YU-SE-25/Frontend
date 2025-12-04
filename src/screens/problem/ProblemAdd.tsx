import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  RegisterWrapper,
  MainContent,
  TitleRow,
  SectionTitle,
  InputGroup,
  Label,
  StyledInput,
  StyledTextArea,
  //ExampleGrid,
  MainButton,
  //ActionButton,
  ErrorMessage,
  StyledSelect,
  TagDisplayContainer,
  TagChip,
  RemoveTagButton,
} from "../../theme/ProblemAdd.Style";

import {
  fetchAvailableTags,
  registerProblem,
  TAG_LABEL_MAP,
} from "../../api/problem_api";
export const ALL_AVAILABLE_TAGS = [
  "구현",
  "기초",
  "이진 탐색",
  "탐색",
  "문자열",
  "투 포인터",
  "중심 확장",
  "스택",
  "시뮬레이션",
  "자료구조",
  "다이나믹 프로그래밍",
  "카데인",
  "배열",
  "그리디",
  "정렬",
  "우선순위 큐",
  "그래프",
  "BFS",
  "DFS",
];

const USE_DUMMY = true;

const DIFFICULTY_OPTIONS = [
  { ko: "하", value: "EASY" },
  { ko: "중", value: "MEDIUM" },
  { ko: "상", value: "HARD" },
];

export default function ProblemAdd() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
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
  const [testCases, setTestCases] = useState<FileList | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [errorMessage, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const fetched = USE_DUMMY
        ? ALL_AVAILABLE_TAGS
        : await fetchAvailableTags();
      setAvailableTags(fetched);
    };
    load();
  }, []);

  const isValid = useMemo(() => {
    return (
      form.title.trim() &&
      form.description.trim() &&
      form.inputOutputExample.trim() &&
      form.timeLimit &&
      form.memoryLimit
    );
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValid) {
      setError("필수 항목을 모두 입력해야 합니다.");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      inputOutputExample: form.inputOutputExample,
      difficulty: form.difficulty as "EASY" | "MEDIUM" | "HARD",
      timeLimit: Number(form.timeLimit),
      memoryLimit: Number(form.memoryLimit),
      visibility: form.visibility as "PUBLIC" | "PRIVATE",
      tags,
      hint: form.hint,
      source: form.source,
      testcases: testCases ? Array.from(testCases) : undefined,
    };

    try {
      await registerProblem(payload);
      alert("문제 등록이 완료되었습니다.");
      navigate("/problem-list");
    } catch (e) {
      console.error(e);
      alert("등록 실패!");
    }
  };

  return (
    <RegisterWrapper>
      <MainContent>
        <TitleRow>
          <h1>문제 등록</h1>
        </TitleRow>

        <form onSubmit={handleSubmit}>
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

            <StyledSelect
              onChange={(e) => setTags([...tags, e.target.value])}
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
                  {t}
                  <RemoveTagButton
                    onClick={() => setTags(tags.filter((x) => x !== t))}
                  >
                    ×
                  </RemoveTagButton>
                </TagChip>
              ))}
            </TagDisplayContainer>
          </InputGroup>

          <SectionTitle>문제 설명</SectionTitle>

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
            <Label>시간 제한 (초)</Label>
            <StyledInput
              value={form.timeLimit}
              onChange={(e) => setForm({ ...form, timeLimit: e.target.value })}
            />
          </InputGroup>

          <InputGroup>
            <Label>메모리 제한 (MB)</Label>
            <StyledInput
              value={form.memoryLimit}
              onChange={(e) =>
                setForm({ ...form, memoryLimit: e.target.value })
              }
            />
          </InputGroup>

          <InputGroup>
            <Label>테스트케이스 파일</Label>
            <StyledInput
              type="file"
              multiple
              onChange={(e) => setTestCases(e.target.files)}
            />
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

          <MainButton type="submit" disabled={!isValid}>
            등록
          </MainButton>
        </form>
      </MainContent>
    </RegisterWrapper>
  );
}
