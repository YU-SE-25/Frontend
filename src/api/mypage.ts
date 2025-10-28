import axios from "axios";

export async function getSolvedIds(userId: string): Promise<number[]> {
  const { data } = await axios.get<{ ids: number[] }>(
    `/api/users/${userId}/solved`
  );
  return data?.ids ?? [];
}

export async function getBookmarkedIds(userId: string): Promise<number[]> {
  const { data } = await axios.get<{ ids: number[] }>(
    `/api/users/${userId}/bookmarks`
  );
  return data?.ids ?? [];
}

export async function getRecentSubmissions(userId: string) {
  const { data } = await axios.get(`/api/users/${userId}/submissions`, {
    params: { limit: 20 },
  });
  return Array.isArray(data) ? data : [];
}
