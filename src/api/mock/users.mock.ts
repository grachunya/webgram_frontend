import type { User, UpdateUserPayload, UpdatePasswordPayload } from '../users.types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let users: User[] = [
  {
    user_uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    user_name: 'admin1',
    user_password: '123456',
    role_uuid: '11111111-1111-1111-1111-111111111111',
  },
  {
    user_uuid: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    user_name: 'manager1',
    user_password: 'password',
    role_uuid: '22222222-2222-2222-2222-222222222222',
  },
  {
    user_uuid: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    user_name: 'user1',
    user_password: 'qwerty',
    role_uuid: '33333333-3333-3333-3333-333333333333',
  },
];

export const mockGetUsers = async (): Promise<User[]> => {
  await delay(400);
  return [...users];
};

export const mockGetUser = async (uuid: string): Promise<User> => {
  await delay(300);
  const user = users.find((u) => u.user_uuid === uuid);
  if (!user) throw new Error('Пользователь не найден');
  return { ...user };
};

export const mockGetMe = async (): Promise<User> => {
  await delay(300);
  const user = users[0];
  if (!user) throw new Error('Пользователь не найден');
  return { ...user };
};

export const mockCreateUser = async (payload: Omit<User, 'user_uuid'>): Promise<User> => {
  await delay(500);
  const exists = users.some((u) => u.user_name === payload.user_name);
  if (exists) throw new Error('Пользователь с таким именем уже существует');
  const newUser: User = {
    ...payload,
    user_uuid: crypto.randomUUID(),
  };
  users = [...users, newUser];
  return { ...newUser };
};

export const mockUpdateUser = async (payload: UpdateUserPayload): Promise<User> => {
  await delay(500);
  const idx = users.findIndex((u) => u.user_uuid === payload.user_uuid);
  if (idx === -1) throw new Error('Пользователь не найден');
  users[idx] = { ...users[idx], ...payload, user_password: users[idx].user_password };
  return { ...users[idx] };
};

export const mockUpdatePassword = async (
  uuid: string,
  payload: UpdatePasswordPayload,
): Promise<User> => {
  await delay(500);
  const idx = users.findIndex((u) => u.user_uuid === uuid);
  if (idx === -1) throw new Error('Пользователь не найден');
  users[idx] = { ...users[idx], user_password: payload.user_password };
  return { ...users[idx] };
};

export const mockDeleteUser = async (uuid: string): Promise<User> => {
  await delay(400);
  const idx = users.findIndex((u) => u.user_uuid === uuid);
  if (idx === -1) throw new Error('Пользователь не найден');
  const [deleted] = users.splice(idx, 1);
  return { ...deleted };
};
