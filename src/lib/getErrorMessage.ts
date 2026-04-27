import type { AxiosError } from 'axios';

interface BackendError {
  message?: string;
}

export const getServerErrorMessage = (error: unknown): string | undefined => {
  if (!error) return undefined;
  const axiosErr = error as AxiosError<BackendError>;
  return axiosErr.response?.data?.message;
};
