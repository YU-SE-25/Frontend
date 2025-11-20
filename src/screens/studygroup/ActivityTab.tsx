import React, { useEffect, useState } from "react";
import styled from "styled-components";
import type { ActivityLog } from "../../api/studygroup_api";
import { DUMMY_ACTIVITY_LOGS } from "../../api/dummy/studygroupdetail_dummy";

// 스타일
const ActivityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ActivityItem = styled.div`
  background-color: ${({ theme }) => theme.bgColor};
  border: 1px solid ${({ theme }) => theme.authHoverBgColor};
  padding: 15px 20px;
  border-radius: 8px;
  display: flex;
  gap: 15px;
  align-items: center;
`;

const Icon = styled.span`
  font-size: 26px;
`;

const ActivityContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const LogDate = styled.div`
  font-size: 14px;
  opacity: 0.7;
  color: ${({ theme }) => theme.textColor};
`;

export default function ActivityTab() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // ⭐ 나중에 fetchGroupActivity(groupId)로 교체하면 됨!
    setLogs(DUMMY_ACTIVITY_LOGS);
  }, []);

  if (logs.length === 0) {
    return <p style={{ opacity: 0.7 }}>활동 기록이 없습니다.</p>;
  }

  return (
    <ActivityContainer>
      {logs.map((log, index) => (
        <ActivityItem key={index}>
          <Icon>{log.icon}</Icon>

          <ActivityContent>
            <LogText>{log.text}</LogText>
            <LogDate>{log.date}</LogDate>
          </ActivityContent>
        </ActivityItem>
      ))}
    </ActivityContainer>
  );
}
