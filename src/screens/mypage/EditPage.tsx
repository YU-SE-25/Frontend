import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getDummyUserProfile } from "../../api/dummy/mypage_dummy";
import { getUserProfile } from "../../api/mypage_api";

const USE_DUMMY = true;

const Wrapper = styled.div`
  flex: 1;
  margin-left: 32px;
  padding: 24px 16px;
  color: ${(props) => props.theme.textColor};
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: ${(props) => props.theme.textColor};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 640px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const Hint = styled.span`
  font-size: 12px;
  opacity: 0.7;
  color: ${(props) => props.theme.textColor};
`;

const Input = styled.input`
  margin-top: 10px;
  width: 80%;
  padding: 10px;
  /* 입력창 경계선 색상은 텍스트 색상 또는 포커스 색상 활용 */
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  background: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 120px;

  &:focus {
    border-color: ${(props) => props.theme.textColor};
  }
`;
const AvatarOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.15s ease;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  cursor: pointer;

  &:hover ${AvatarOverlay} {
    opacity: 1;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LangChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const LangChip = styled.button<{ $selected?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.focusColor : "rgba(0,0,0,0.16)"};
  background: ${({ $selected, theme }) =>
    $selected ? theme.focusColor : "transparent"};
  color: ${({ $selected, theme }) =>
    $selected ? theme.bgColor : theme.textColor};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const ButtonRow = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 12px;
`;

const PrimaryButton = styled.button`
  padding: 10px 18px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: ${(props) => props.theme.focusColor};
  color: ${(props) => props.theme.bgColor};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GhostButton = styled.button`
  padding: 10px 18px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: transparent;
  color: ${(props) => props.theme.textColor};
  font-size: 14px;
  cursor: pointer;
`;

const LoadingText = styled.div`
  padding: 40px 0;
`;

const ErrorText = styled.div`
  padding: 40px 0;
  color: #ef4444;
`;
const DebugDiv = styled.div`
  height: 100vh;
`;

type EditableProfile = {
  avatarUrl: string;
  username: string;
  bio: string;
  prefferred_language: string[];
  extralanguage?: string;
};

const ALL_LANGS = ["Python", "Java", "C++", "JavaScript"];

export default function EditPage() {
  const { username } = useParams<{ username: string }>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: USE_DUMMY ? ["dummyUserProfile"] : ["userProfile", username],
    queryFn: async () =>
      USE_DUMMY ? getDummyUserProfile() : await getUserProfile(username ?? ""),
    staleTime: 5 * 60 * 1000,
  });

  const [form, setForm] = useState<EditableProfile>({
    avatarUrl: "",
    username: "",
    bio: "",
    prefferred_language: [],
    extralanguage: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        avatarUrl: user.avatarUrl ?? "",
        username: user.username ?? "",
        bio: user.bio ?? "",
        prefferred_language: user.prefferred_language ?? [],
      });
    }
  }, [user]);

  const toggleLang = (lang: string) => {
    setForm((prev) => {
      const has = prev.prefferred_language.includes(lang);
      return {
        ...prev,
        prefferred_language: has
          ? prev.prefferred_language.filter((l) => l !== lang)
          : [...prev.prefferred_language, lang],
      };
    });
  };
  const [showExtraLang, setShowExtraLang] = useState(false);

  const handleChange =
    (field: keyof EditableProfile) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "프로필 저장 기능은 나중에 API 연동 시 구현될 예정입니다.\n\n" +
        JSON.stringify(form, null, 2)
    );
  };
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, avatarUrl: url }));
  };

  const handleReset = () => {
    if (!user) return;
    setForm({
      avatarUrl: user.avatarUrl ?? "",
      username: user.username ?? "",
      bio: user.bio ?? "",
      prefferred_language: user.prefferred_language ?? [],
    });
  };

  if (isLoading)
    return <LoadingText>프로필 정보를 불러오는 중입니다…</LoadingText>;
  if (isError || !user)
    return <ErrorText>프로필 정보를 불러오는 데 실패했어요.</ErrorText>;

  return (
    <Wrapper>
      <Title>프로필 수정</Title>
      <Form onSubmit={handleSubmit}>
        <FieldGroup>
          <Label>프로필 이미지</Label>
          <Hint>이미지를 클릭하면 새로운 이미지를 업로드 할 수 있습니다..</Hint>
          <AvatarRow>
            <AvatarWrapper onClick={handleAvatarClick}>
              <AvatarImage
                src={form.avatarUrl || user.avatarUrl}
                alt="프로필 이미지"
              />
              <AvatarOverlay>수정</AvatarOverlay>
            </AvatarWrapper>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <span>!!이 공간에 추가할 것 : 사진 크기별로 보여주기</span>
          </AvatarRow>
        </FieldGroup>

        <FieldGroup>
          <Label>닉네임</Label>
          <Hint>서비스 내에서 표시되는 이름입니다.</Hint>
          <Input
            type="text"
            value={form.username}
            onChange={handleChange("username")}
            placeholder="닉네임을 입력하세요"
          />
        </FieldGroup>

        <FieldGroup>
          <Label>소개</Label>
          <Hint>자기소개, 관심 분야, 현재 공부 중인 내용을 적어보세요.</Hint>
          <TextArea
            value={form.bio}
            onChange={handleChange("bio")}
            placeholder="안녕하세요! 👋 현재 알고리즘과 웹 개발을 공부하고 있어요."
          />
        </FieldGroup>

        <FieldGroup>
          <Label>선호 언어</Label>
          <Hint>
            자주 사용하는 언어를 선택하세요. 여러 개 선택할 수 있습니다.
          </Hint>
          <LangChipRow>
            {ALL_LANGS.map((lang) => (
              <LangChip
                key={lang}
                type="button"
                $selected={form.prefferred_language.includes(lang)}
                onClick={() => toggleLang(lang)}
              >
                {lang}
              </LangChip>
            ))}
            <LangChip
              type="button"
              $selected={showExtraLang}
              onClick={() => setShowExtraLang((prev) => !prev)}
            >
              more..
            </LangChip>
          </LangChipRow>
          {showExtraLang && (
            <form>
              <Hint>
                구분자(,)를 이용해 프로필에 표시할 언어를 추가로 작성할 수
                있습니다.
              </Hint>
              <Input
                type="text"
                value={form.extralanguage}
                onChange={handleChange("extralanguage")}
                placeholder="추가로 선호하는 언어를 입력하세요 (쉼표로 구분해도 됨)"
                style={{ marginTop: "8px" }}
              />
            </form>
          )}
        </FieldGroup>

        <ButtonRow>
          <PrimaryButton type="submit">저장</PrimaryButton>
          <GhostButton type="button" onClick={handleReset}>
            변경사항 초기화
          </GhostButton>
        </ButtonRow>
      </Form>
      <DebugDiv></DebugDiv>
    </Wrapper>
  );
}
