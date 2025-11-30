import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { getUserProfile, updateMyProfile } from "../../api/mypage_api";
import { useAtom, useSetAtom } from "jotai";
import { isDarkAtom, toggleThemeActionAtom } from "../../atoms";

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

const GoalRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 10px;
`;

const GoalBox = styled.div`
  padding: 12px 14px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.bgCardColor};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const GoalLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const GoalInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GoalUnit = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor};
`;

// 설정 섹션
const SettingsList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SettingItem = styled.div`
  padding: 10px 12px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bgCardColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const SettingTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const SettingTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const SettingDescription = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.muteColor};
`;

// 토글 버튼
const ToggleButton = styled.div<{ $enable: boolean }>`
  width: 44px;
  height: 24px;
  background-color: ${(props) =>
    props.$enable ? props.theme.focusColor : props.theme.authHoverBgColor};
  border-radius: 12px;
  position: relative;
  transition: background-color 0.3s;
`;

// 스위치 핸들 (동그란 부분)
const ToggleThumb = styled.div<{ $enable: boolean }>`
  width: 18px;
  height: 18px;
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: ${(props) => (props.$enable ? "23px" : "3px")};
  transition: left 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
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
  border: 1px solid ${(props) => props.theme.muteColor};
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

export type EditableProfile = {
  avatarUrl: string;
  username: string;
  bio: string;
  prefferred_language: string[];
  extralanguage?: string;
  dailyMinimumStudyMinutes?: number | string;
  weeklyStudyGoalMinutes?: number | string;
  enableStudyReminder: boolean;
  preferDarkMode: boolean;
  hideMyPage: boolean; // isPublic의 반대 의미
};

const ALL_LANGS = ["Python", "Java", "C++", "JavaScript"];

export default function EditPage() {
  const { username } = useParams<{ username: string }>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDark] = useAtom(isDarkAtom);
  const runToggleTheme = useSetAtom(toggleThemeActionAtom);
  const didInit = useRef(false);
  // ✅ 실제 API 호출용 useQuery
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfileEdit", username],
    enabled: !!username, // username 없으면 요청만 막음 (훅은 항상 호출)
    queryFn: async () => {
      if (!username) {
        throw new Error("username is missing");
      }
      return await getUserProfile(username);
    },
    staleTime: 5 * 60 * 1000,
  });

  const [form, setForm] = useState<EditableProfile>({
    avatarUrl: "",
    username: "",
    bio: "",
    prefferred_language: [],
    extralanguage: "",
    dailyMinimumStudyMinutes: "",
    weeklyStudyGoalMinutes: "",
    enableStudyReminder: false,
    preferDarkMode: isDark,
    hideMyPage: false,
  });

  useEffect(() => {
    if (!user || didInit.current) return;
    didInit.current = true;

    setForm({
      avatarUrl: user.avatarUrl ?? "",
      username: user.username ?? "",
      bio: user.bio ?? "",
      prefferred_language: user.prefferred_language ?? [],
      extralanguage: "",
      dailyMinimumStudyMinutes: user.goals?.dailyMinimumStudyMinutes ?? "",
      weeklyStudyGoalMinutes: user.goals?.weeklyStudyGoalMinutes ?? "",
      enableStudyReminder: user.goals?.isReminderEnabled ?? false,
      preferDarkMode: isDark,
      hideMyPage: user.isPublic === false,
    });
  }, [user, isDark]); // deps에 isDark 있어도, didInit 때문에 한 번만 세팅됨

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMyProfile(form);
      await useQueryClient().invalidateQueries({
        queryKey: ["userProfile"],
      });
      alert("프로필이 성공적으로 업데이트되었습니다!");
    } catch (err) {
      alert("프로필 수정 중 오류가 발생했습니다.");
    }
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
      extralanguage: "",
      dailyMinimumStudyMinutes: user.goals?.dailyMinimumStudyMinutes ?? "",
      weeklyStudyGoalMinutes: user.goals?.weeklyStudyGoalMinutes ?? "",
      enableStudyReminder: user.goals?.isReminderEnabled ?? false,
      preferDarkMode: isDark,
      hideMyPage: user.isPublic === false,
    });
  };

  if (!username) {
    return <ErrorText>잘못된 접근입니다. (username 없음)</ErrorText>;
  }

  if (isLoading) {
    return <LoadingText>프로필 정보를 불러오는 중입니다…</LoadingText>;
  }

  if (isError || !user) {
    return <ErrorText>프로필 정보를 불러오는 데 실패했어요.</ErrorText>;
  }

  return (
    <Wrapper>
      <Title>프로필 수정</Title>
      <Form onSubmit={handleSubmit}>
        <FieldGroup>
          <Label>프로필 이미지</Label>
          <Hint>이미지를 클릭하면 새로운 이미지를 업로드 할 수 있습니다.</Hint>
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
            <div>
              {/* 🚫 form 안에 form 중첩 방지: div로 변경 */}
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
            </div>
          )}
        </FieldGroup>

        {/* 학습 목표 */}
        <FieldGroup>
          <Label>학습 목표</Label>
          <Hint>
            하루 / 주간 학습 시간을 설정하면 대시보드에서 진척도를 확인할 수
            있어요.
          </Hint>

          <GoalRow>
            <GoalBox>
              <GoalLabel>하루 최소 학습 시간</GoalLabel>
              <GoalInputRow>
                <Input
                  type="number"
                  min={0}
                  value={form.dailyMinimumStudyMinutes ?? ""}
                  onChange={handleChange("dailyMinimumStudyMinutes")}
                  placeholder="예: 30"
                />
                <GoalUnit>분</GoalUnit>
              </GoalInputRow>
            </GoalBox>

            <GoalBox>
              <GoalLabel>주간 학습 목표</GoalLabel>
              <GoalInputRow>
                <Input
                  type="number"
                  min={0}
                  value={form.weeklyStudyGoalMinutes ?? ""}
                  onChange={handleChange("weeklyStudyGoalMinutes")}
                  placeholder="예: 600"
                />
                <GoalUnit>분</GoalUnit>
              </GoalInputRow>
            </GoalBox>
          </GoalRow>
        </FieldGroup>

        {/* 설정 섹션 */}
        <FieldGroup>
          <Label>설정</Label>
          <Hint>계정과 마이페이지에 대한 기본 설정입니다.</Hint>

          <SettingsList>
            <SettingItem>
              <SettingTextGroup>
                <SettingTitle>학습 알림</SettingTitle>
                <SettingDescription>
                  설정한 시간에 학습 알림을 받아요.
                </SettingDescription>
              </SettingTextGroup>
              <ToggleButton
                $enable={form.enableStudyReminder}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    enableStudyReminder: !prev.enableStudyReminder,
                  }))
                }
              >
                <ToggleThumb $enable={form.enableStudyReminder} />
              </ToggleButton>
            </SettingItem>

            <SettingItem>
              <SettingTextGroup>
                <SettingTitle>다크 모드 사용</SettingTitle>
                <SettingDescription>
                  기본 테마를 다크 모드로 사용할지 설정해요.
                </SettingDescription>
              </SettingTextGroup>
              <ToggleButton $enable={isDark} onClick={runToggleTheme}>
                <ToggleThumb $enable={isDark} />
              </ToggleButton>
            </SettingItem>

            <SettingItem>
              <SettingTextGroup>
                <SettingTitle>마이페이지 비공개</SettingTitle>
                <SettingDescription>
                  다른 사용자에게 마이페이지를 공개하지 않아요.
                </SettingDescription>
              </SettingTextGroup>
              <ToggleButton
                $enable={form.hideMyPage}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    hideMyPage: !prev.hideMyPage,
                  }))
                }
              >
                <ToggleThumb $enable={form.hideMyPage} />
              </ToggleButton>
            </SettingItem>
          </SettingsList>
        </FieldGroup>

        <ButtonRow>
          <PrimaryButton type="submit">저장</PrimaryButton>
          <GhostButton type="button" onClick={handleReset}>
            변경사항 초기화
          </GhostButton>
        </ButtonRow>
      </Form>
      <DebugDiv />
    </Wrapper>
  );
}
