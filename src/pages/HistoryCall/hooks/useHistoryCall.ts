import { getHistoryCall } from "@/api/historyCall";
import { useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";

export const useHistoryCall = () => {
  const agentNumber = useAppSelector(
    (state) => state.user.currentUser?.agent?.agent_number,
  );
  const {
    data: history = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["history-call", agentNumber],
    queryFn: () => getHistoryCall(agentNumber!),
    enabled: !!agentNumber,
  });

  return {
    history,
    isPending,
    isError,
    error,
  };
};
