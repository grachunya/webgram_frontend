import { getHistoryCall } from "@/api/historyCall";
import { useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useHistoryCall = () => {
  const agentNumber = useAppSelector(
    (state) => state.user.currentUser?.agent?.agent_number,
  );
  const [searchNumber, setSearchNumber] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const {
    data: history = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["history-call", agentNumber, searchValue],
    queryFn: () => {
      if (searchValue.length === 6) {
        return getHistoryCall(searchValue);
      }
      return getHistoryCall(agentNumber!);
    },
    enabled: !!agentNumber || searchValue.length === 6,
  });

  const handleSearch = (number: string) => {
    const cleaned = number.replace(/\D/g, "").slice(0, 6);
    setSearchNumber(cleaned);
  };

  const handleSubmit = () => {
    if (searchNumber.length === 6) {
      setSearchValue(searchNumber);
    }
  };

  const clearSearch = () => {
    setSearchNumber("");
    setSearchValue("");
  };

  return {
    history,
    isPending,
    isError,
    error,
    searchNumber,
    handleSearch,
    handleSubmit,
    clearSearch,
    isSearching: searchValue.length === 6,
  };
};
