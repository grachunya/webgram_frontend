import { getRecord } from "@/api/historyCall";
import { useQuery } from "@tanstack/react-query";

export const useCallRecord = (callUuid: string | null | undefined) => {
  const {
    data: recordUrl,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["record", callUuid],
    queryFn: () => getRecord(callUuid!),
    enabled: !!callUuid,
    staleTime: 5 * 60 * 1000,
  });

  return {
    recordUrl,
    isPending,
    isError,
    error,
  };
};
