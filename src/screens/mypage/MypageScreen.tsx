// mypage/MyPageScreen.tsx
import { useSearchParams } from "react-router-dom";
import ActivityPage from "./ActivityPage";

export default function MyPageScreen() {
  const [sp] = useSearchParams();
  const tab = sp.get("tab") ?? "activity";

  if (tab === "activity") return <ActivityPage />;
  return <div style={{ padding: 16 }}>준비 중: {tab}</div>;
}
