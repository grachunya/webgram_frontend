import type { LoginPayload, AuthResponse, RefreshResponse } from './mock/auth.mock';
import { mockLogin, mockRefresh } from './mock/auth.mock';

export type { LoginPayload, AuthResponse };

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  await new Promise((r) => setTimeout(r, 600));
  return mockLogin(payload);
};

export const refresh = async (refreshToken: string): Promise<RefreshResponse> => {
  await new Promise((r) => setTimeout(r, 300));
  return mockRefresh(refreshToken);
};
