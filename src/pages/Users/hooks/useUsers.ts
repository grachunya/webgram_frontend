import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
} from "@api/users";
import type { UpdatePasswordPayload } from "@api/users";

export const useUsers = () => {
  const qc = useQueryClient();

  const invalidate = useCallback(
    () => qc.invalidateQueries({ queryKey: ["users"] }),
    [qc],
  );

  const { data: users = [], isPending, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const create = useMutation({
    mutationFn: createUser,
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: updateUser,
    onSuccess: invalidate,
  });

  const changePassword = useMutation({
    mutationFn: ({
      uuid,
      payload,
    }: {
      uuid: string;
      payload: UpdatePasswordPayload;
    }) => updatePassword(uuid, payload),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: deleteUser,
    onSuccess: invalidate,
  });

  return { users, isPending, isError, error, create, update, changePassword, remove };
};
