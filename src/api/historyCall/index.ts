import { api } from "@lib/api";

export interface HistoryCall {
  start_stamp: string;
  duration: string;
  direction: string;
  caller_id_number: string;
  destination_number: string;
}

export const getHistoryCall = (agent_number: string) =>
  api
    .get<HistoryCall[]>(`/agent-operator/history-by-day/${agent_number}`)
    .then((r) => r.data);
