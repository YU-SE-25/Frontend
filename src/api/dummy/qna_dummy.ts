// src/api/dummy/qna_dummy.ts
import type { QnaContent, QnaComment } from "../../screens/board/QnaList";

// 댓글 생성 헬퍼
function makeQnaComment(
  id: number,
  author: string,
  contents: string,
  anonymity?: boolean
): QnaComment {
  return {
    id,
    author,
    contents,
    anonymity: anonymity ?? false,
    create_time: new Date().toISOString(),
  };
}

// QnA 더미 데이터 (질문 5개)
export const QNA_DUMMY: QnaContent[] = [
  {
    post_id: 1,
    problem_id: 1,
    post_title: "1001번 두 수의 합, 시간 초과가 나요",
    author: "gamppe",
    anonymity: false,
    like_count: 3,
    comment_count: 2,
    create_time: "2025-11-20T10:00:00Z",
    contents:
      "입력을 scanf로 받는데도 시간 초과가 납니다. 어디를 고쳐야 할까요?",
    comments: [
      makeQnaComment(
        1,
        "고수1",
        "입력 처리보다 로직에서 불필요한 반복이 있는지 먼저 확인해보세요."
      ),
      makeQnaComment(
        2,
        "익명",
        "입출력 최적화(iostream이면 sync off 등)도 한 번 체크해보세요.",
        true
      ),
    ],
  },
  {
    post_id: 2,
    problem_id: 1,
    post_title: "두 수의 합 예제는 맞는데 틀렸습니다가 떠요",
    author: "익명",
    anonymity: true,
    like_count: 1,
    comment_count: 1,
    create_time: "2025-11-21T09:30:00Z",
    contents:
      "예제 입력/출력은 다 맞는데 제출하면 틀렸습니다가 뜹니다. 어떤 케이스를 놓친 걸까요?",
    comments: [
      makeQnaComment(
        1,
        "gamppe",
        "음수나 범위가 큰 입력도 고려했는지 확인해보세요."
      ),
    ],
  },
  {
    post_id: 3,
    problem_id: 2,
    post_title: "1200번 정렬 문제, 어떤 정렬 써야 할까요?",
    author: "정렬고민중",
    anonymity: false,
    like_count: 0,
    comment_count: 0,
    create_time: "2025-11-19T14:15:00Z",
    contents:
      "N이 100,000 정도인데 퀵소트 써도 괜찮을까요, 아니면 다른 정렬을 써야 할까요?",
    comments: [],
  },
  {
    post_id: 4,
    problem_id: 3,
    post_title: "1305번 DP 점화식이 이해가 안 됩니다",
    author: "DP어려워",
    anonymity: false,
    like_count: 5,
    comment_count: 2,
    create_time: "2025-11-18T20:40:00Z",
    contents:
      "에디토리얼의 점화식 설명을 봤는데, 왜 이전 상태에서 저렇게 넘어가는지 잘 모르겠습니다.",
    comments: [
      makeQnaComment(
        1,
        "DP장인",
        "상태를 그림으로 그려보고, 현재 선택이 이후 상태에 어떤 제약을 주는지 생각해보세요."
      ),
      makeQnaComment(
        2,
        "익명",
        "같은 고민이었는데, 표를 직접 채워보니까 이해됐어요.",
        true
      ),
    ],
  },
  {
    post_id: 5,
    problem_id: 6,
    post_title: "6번 입출력 형식이 헷갈립니다",
    author: "형식무서워",
    anonymity: false,
    like_count: 2,
    comment_count: 1,
    create_time: "2025-11-17T08:05:00Z",
    contents:
      "출력 예시에 공백이 한 칸인지 여러 칸인지, 마지막 줄 개행이 필요한지 잘 모르겠습니다.",
    comments: [
      makeQnaComment(
        1,
        "테스트광",
        "문제 설명 그대로 지키고, 마지막 줄도 개행 하나 추가하는 게 안전합니다."
      ),
    ],
  },
];
