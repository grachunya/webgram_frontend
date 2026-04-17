import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '@api/auth';
import { token } from '@lib/token';
import type { LoginPayload } from '@api/auth';

export const useAuth = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      token.set(data.access_token, data.refresh_token);
      navigate('/home');
    },
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
