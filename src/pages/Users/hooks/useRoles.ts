import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from '@api/roles';

export const useRoles = () => {
  const qc = useQueryClient();

  const invalidate = useCallback(
    () => qc.invalidateQueries({ queryKey: ['roles'] }),
    [qc],
  );

  const { data: roles = [], isPending } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const create = useMutation({
    mutationFn: createRole,
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: updateRole,
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: deleteRole,
    onSuccess: invalidate,
  });

  return { roles, isPending, create, update, remove };
};
