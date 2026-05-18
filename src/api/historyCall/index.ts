import { api } from "@lib/api";

export interface HistoryCall {
  start_stamp: string;
  duration: string;
  direction: string;
  caller_id_number: string;
  call_uuid: string;
  destination_number: string;
}

export const getHistoryCall = (agent_number: string) =>
  api
    .get<HistoryCall[]>(`/agent-operator/history-by-day/${agent_number}`)
    .then((r) => r.data);

export const getRecord = async (call_uuid: string) => {
  const response = await api.get(`/record/${call_uuid}`, {
    responseType: "blob",
  });

  return URL.createObjectURL(response.data);
};
