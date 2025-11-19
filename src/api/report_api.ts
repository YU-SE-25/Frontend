//import { api } from "./axios"; //백엔드 연동 시 주석해재

export interface ReportPayload {
  reporter_name: string;
  report_title: string;
  target_content_type: string;
  target_content_id: number;
  reason: string;
}

export interface ReportResponse {
  report_id: number;
  message: string;
  status: string;
  reported_at: string;
}

//신고 등록 API
export async function createReport(
  payload: ReportPayload
): Promise<ReportResponse> {
  // 백엔드 연동 코드
  // const response = await api.put<ReportResponse>("/reports", payload);
  // return response.data;

  // 테스트(더미) 응답
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        report_id: Math.floor(Math.random() * 10000),
        message: "신고가 접수되었습니다.",
        status: "PENDING",
        reported_at: new Date().toISOString(),
      });
    }, 800)
  );
}
