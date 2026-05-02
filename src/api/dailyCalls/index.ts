import { api } from "@lib/api";

export interface CdrMinute {
  hour_of_day: string;
  minute_of_hour: string;
  call_count: number;
}

export const getCdrCountByMinute = (year: number, month: number, day: number) =>
  api
    .get<CdrMinute[]>("/cdr-count-every-minute", { params: { year, month, day } })
    .then((r) => r.data);
