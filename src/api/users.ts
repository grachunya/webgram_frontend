import type { User, UpdateUserPayload, UpdatePasswordPayload } from './users.types';
import {
  mockGetUsers,
  mockGetUser,
  mockGetMe,
  mockCreateUser,
  mockUpdateUser,
  mockUpdatePassword,
  mockDeleteUser,
} from './mock/users.mock';

export type { User, UpdateUserPayload, UpdatePasswordPayload };


export const getUsers = (): Promise<User[]> => mockGetUsers();

export const getUser = (uuid: string): Promise<User> => mockGetUser(uuid);

export const getMe = (): Promise<User> => mockGetMe();

export const createUser = (payload: Omit<User, 'user_uuid'>): Promise<User> =>
  mockCreateUser(payload);

export const updateUser = (payload: UpdateUserPayload): Promise<User> =>
  mockUpdateUser(payload);

export const updatePassword = (
  uuid: string,
  payload: UpdatePasswordPayload,
): Promise<User> => mockUpdatePassword(uuid, payload);

export const deleteUser = (uuid: string): Promise<User> => mockDeleteUser(uuid);
