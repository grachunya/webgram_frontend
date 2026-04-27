import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, logout as logoutApi } from '@api/auth';
import type { LoginPayload } from '@api/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['currentUser'] });
      navigate('/home');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      qc.clear();
      navigate('/login');
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isPending: loginMutation.isPending,
    isError: loginMutation.isError,
    error: loginMutation.error,
  };
};
