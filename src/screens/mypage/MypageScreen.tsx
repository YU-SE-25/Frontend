// mypage/MyPageScreen.tsx
import { useSearchParams } from "react-router-dom";
import ActivityPage from "./ActivityPage";
import EditAlert from "./EditAlert";

export default function MyPageScreen() {
  const [sp] = useSearchParams();
  const tab = sp.get("tab") ?? "activity";

  if (tab === "activity") return <ActivityPage />;
  else if (tab === "profile-edit") return <EditAlert />;
  return <div style={{ padding: 16 }}>준비 중: {tab}</div>;
}
