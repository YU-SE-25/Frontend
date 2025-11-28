//임시 저장 불러오기 더미
export const DUMMY_DRAFT = {
  code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Dummy!");
    }
}`,
  language: "JAVA",
};

//코드 실행 더미
export const DUMMY_RUN_RESULT = {
  output: "Hello World\n123",
  compileError: null,
  compileTimeMs: 42,
};

//임시 저장 응답 더미
export const DUMMY_DRAFT_SAVE_RESPONSE = {
  message: "임시 저장이 완료되었습니다.",
  draftSubmissionId: 999,
};

//제출하기
export const DUMMY_SUBMIT_RESPONSE = {
  submissionId: 12345,
  message: "제출 완료. 채점을 진행합니다.",
};
