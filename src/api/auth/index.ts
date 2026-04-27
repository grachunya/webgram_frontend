import { api } from '@lib/api';

export interface LoginPayload {
  user_name: string;
  user_password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export const login = (payload: LoginPayload) =>
  api.post<AuthResponse>('/auth/login', payload).then((r) => r.data);

export const logout = () =>
  api.post('/auth/logout');
