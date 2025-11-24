import { api } from "./axios.ts";

export async function fetchBoardList() {
  const response = await api.get("/dis_board");
  return response.data;
}
