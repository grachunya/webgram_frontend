import {
  createNumber,
  deleteNumber,
  getNumbers,
  updateNumber,
} from "@/api/phoneBook";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const usePhoneBook = () => {
  const qc = useQueryClient();

  const invalidate = useCallback(
    () => qc.invalidateQueries({ queryKey: ["numbers"] }),
    [qc],
  );

  const {
    data: numbers = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["numbers"],
    queryFn: getNumbers,
  });

  const create = useMutation({
    mutationFn: createNumber,
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: updateNumber,
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: deleteNumber,
    onSuccess: invalidate,
  });

  return {
    numbers,
    isPending,
    isError,
    error,
    create,
    update,
    remove,
  };
};
