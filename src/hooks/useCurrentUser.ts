import { useQuery } from '@tanstack/react-query';
import { getMe } from '@api/users';

export const useCurrentUser = () =>
  useQuery({
    queryKey: ['currentUser'],
    queryFn: getMe,
    retry: false,
  });
