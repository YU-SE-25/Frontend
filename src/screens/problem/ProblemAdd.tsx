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
  ExampleGrid,
  MainButton,
  ActionButton,
  ErrorMessage,
  StyledSelect,
  TagDisplayContainer,
  TagChip,
  RemoveTagButton,
} from "../../theme/ProblemAdd.Style";

//태그 api에서 fetch
import { fetchAvailableTags } from "../../api/problem_api";
//태그 더미 사용
import { ALL_AVAILABLE_TAGS } from "../../api/dummy/problem_dummy";
const USE_DUMMY = true;

//임시용 폼 데이터 타입 정의 (추후 api 맞춰서 연동할겁니다)
interface ProblemFormData {
  title: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  timeLimit: string;
  memoryLimit: string;
  difficulty: string;
  tags: string;
  keywords: string;
  hint: string;
  source: string;
  lectureLink: string;
  curriculum: string;
}

//임시 난이도 옵션
const DIFFICULTY_OPTIONS = ["하", "중", "상", "최상"];

export default function ProblemAdd() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProblemFormData>({
    title: "",
    description: "",
    inputDescription: "",
    outputDescription: "",
    timeLimit: "",
    memoryLimit: "",
    difficulty: "하",
    tags: "",
    keywords: "",
    hint: "",
    source: "",
    lectureLink: "",
    curriculum: "",
  });

  const [examples, setExamples] = useState([{ input: "", output: "" }]);
  const [testCases, setTestCases] = useState<FileList | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  //태그 불러오기
  useEffect(() => {
    const loadAvailableTags = async () => {
      try {
        // 더미 데이터 사용
        const fetchedTags = USE_DUMMY
          ? ALL_AVAILABLE_TAGS
          : await fetchAvailableTags();
        setAvailableTags(fetchedTags);
      } catch (e) {
        console.error("사용 가능한 태그 목록을 불러오는 데 실패했습니다.", e);
      }
    };
    loadAvailableTags();
  }, []);

  //태그 추가/삭제 핸들러
  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // 필수 유효성 검사 (제목, 설명, 예제 1개, 시간/메모리)
  const isFormValid = useMemo(() => {
    return (
      formData.title.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.inputDescription.trim() !== "" &&
      formData.outputDescription.trim() !== "" &&
      formData.timeLimit.trim() !== "" &&
      formData.memoryLimit.trim() !== "" &&
      examples.length >= 1 &&
      examples.every((ex) => ex.input.trim() !== "" && ex.output.trim() !== "")
    );
  }, [formData, examples]);

  const handleRemoveExample = (index: number) => {
    if (examples.length > 1) {
      // 최소 1개 유지를 위해 1개 초과일 때만 삭제
      setExamples(examples.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isFormValid) {
      setErrorMessage(
        "제목, 설명, 제약 조건, 최소 1개 이상의 예제는 필수 항목입니다."
      );
      return;
    }

    // TODO: FormData를 사용하여 문제 정보와 테스트 파일을 API로 전송 (Axios)

    //저장 성공 시: 완료 메시지 출력 후 문제 목록 이동
    alert("문제 등록이 성공적으로 완료되었습니다.");
    navigate("/problem-list");
  };

  return (
    <RegisterWrapper>
      <MainContent>
        <TitleRow>
          <h1>문제 등록</h1>
        </TitleRow>

        <form onSubmit={handleSubmit}>
          <SectionTitle>기본 정보 (필수)</SectionTitle>
          <InputGroup>
            <Label htmlFor="title">문제 제목:</Label>
            <StyledInput
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="difficulty">난이도:</Label>
            <StyledSelect
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
            >
              {DIFFICULTY_OPTIONS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </StyledSelect>
          </InputGroup>

          <InputGroup style={{ alignItems: "flex-start" }}>
            <Label htmlFor="tagSelect">태그 선택:</Label>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <StyledSelect
                id="tagSelect"
                onChange={(e) => handleTagSelect(e.target.value)}
                value=""
                style={{ maxWidth: "200px" }}
              >
                <option value="" disabled>
                  태그를 선택하세요
                </option>
                {availableTags
                  .filter((tag) => !selectedTags.includes(tag))
                  .map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
              </StyledSelect>

              <TagDisplayContainer>
                {selectedTags.map((tag) => (
                  <TagChip key={tag}>
                    {tag}
                    <RemoveTagButton
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                    >
                      &times;
                    </RemoveTagButton>
                  </TagChip>
                ))}
              </TagDisplayContainer>
            </div>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="keywords">키워드:</Label>
            <StyledInput
              id="keywords"
              value={formData.keywords}
              onChange={(e) =>
                setFormData({ ...formData, keywords: e.target.value })
              }
            />
          </InputGroup>

          <SectionTitle>문제 상세 설명</SectionTitle>
          <InputGroup>
            <Label htmlFor="desc">문제 설명:</Label>
            <StyledTextArea
              id="desc"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="inputDesc">입력 형식 설명:</Label>
            <StyledTextArea
              id="inputDesc"
              value={formData.inputDescription}
              onChange={(e) =>
                setFormData({ ...formData, inputDescription: e.target.value })
              }
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="outputDesc">출력 형식 설명:</Label>
            <StyledTextArea
              id="outputDesc"
              value={formData.outputDescription}
              onChange={(e) =>
                setFormData({ ...formData, outputDescription: e.target.value })
              }
            />
          </InputGroup>

          <SectionTitle>제약 조건 및 테스트 케이스</SectionTitle>
          <InputGroup>
            <Label htmlFor="timeLimit">시간 제한 (초):</Label>
            <StyledInput
              id="timeLimit"
              value={formData.timeLimit}
              onChange={(e) =>
                setFormData({ ...formData, timeLimit: e.target.value })
              }
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="memoryLimit">공간 제한 (MB):</Label>
            <StyledInput
              id="memoryLimit"
              value={formData.memoryLimit}
              onChange={(e) =>
                setFormData({ ...formData, memoryLimit: e.target.value })
              }
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="testCaseFile">테스트 케이스 파일 업로드:</Label>
            <StyledInput
              id="testCaseFile"
              type="file"
              onChange={(e) => setTestCases(e.target.files)}
              multiple
            />
          </InputGroup>

          <SectionTitle>
            입출력 예제
            <ActionButton
              type="button"
              onClick={() =>
                setExamples([...examples, { input: "", output: "" }])
              }
            >
              + 예제 추가
            </ActionButton>
          </SectionTitle>

          {examples.map((example, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                border: "1px dashed #ccc",
                padding: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <h4>예제 {index + 1}</h4>
                {examples.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveExample(index)}
                    style={{
                      color: "red",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    삭제
                  </button>
                )}
              </div>
              <ExampleGrid>
                <div>
                  <Label>입력:</Label>
                  <StyledTextArea
                    value={example.input}
                    onChange={(e) => {
                      const newEx = [...examples];
                      newEx[index].input = e.target.value;
                      setExamples(newEx);
                    }}
                  />
                </div>
                <div>
                  <Label>출력:</Label>
                  <StyledTextArea
                    value={example.output}
                    onChange={(e) => {
                      const newEx = [...examples];
                      newEx[index].output = e.target.value;
                      setExamples(newEx);
                    }}
                  />
                </div>
              </ExampleGrid>
            </div>
          ))}

          <SectionTitle>추가 항목</SectionTitle>
          <InputGroup>
            <Label htmlFor="hint">힌트:</Label>
            <StyledInput
              id="hint"
              value={formData.hint}
              onChange={(e) =>
                setFormData({ ...formData, hint: e.target.value })
              }
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="source">출처:</Label>
            <StyledInput
              id="source"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
            />
          </InputGroup>

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

          <MainButton
            type="submit"
            disabled={!isFormValid}
            style={{ marginTop: "40px" }}
          >
            문제 등록
          </MainButton>
        </form>
      </MainContent>
    </RegisterWrapper>
  );
}
