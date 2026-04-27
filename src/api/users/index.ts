import { api } from '@lib/api';

export interface User {
  user_uuid: string;
  user_name: string;
  role: {
    role_uuid: string;
    role_name: string;
  };
  agent: null;
}

export interface CreateUserPayload {
  user_uuid: string;
  user_name: string;
  user_password: string;
  role_uuid: string;
}

export interface UpdateUserPayload {
  user_uuid: string;
  user_name: string;
  role_uuid: string;
}

export interface UpdatePasswordPayload {
  user_password: string;
}

export const getUsers = () =>
  api.get<User[]>('/users').then((r) => r.data);

export const getMe = () =>
  api.get<User>('/users/show/me').then((r) => r.data);

export const createUser = (payload: CreateUserPayload) =>
  api.post<User>('/users', payload).then((r) => r.data);

export const updateUser = (payload: UpdateUserPayload) =>
  api.put<User>('/users', payload).then((r) => r.data);

export const updatePassword = (uuid: string, payload: UpdatePasswordPayload) =>
  api.patch<User>(`/users/${uuid}`, payload).then((r) => r.data);

export const deleteUser = (uuid: string) =>
  api.delete(`/users/${uuid}`);
