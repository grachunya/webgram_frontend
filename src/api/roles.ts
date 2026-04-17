import type { Role, CreateRolePayload, UpdateRolePayload } from './roles.types';
import {
  mockGetRoles,
  mockGetRole,
  mockCreateRole,
  mockUpdateRole,
  mockDeleteRole,
} from './mock/roles.mock';

export type { Role, CreateRolePayload, UpdateRolePayload };

export const getRoles = (): Promise<Role[]> => mockGetRoles();

export const getRole = (uuid: string): Promise<Role> => mockGetRole(uuid);

export const createRole = (payload: CreateRolePayload): Promise<Role> =>
  mockCreateRole(payload);

export const updateRole = (payload: UpdateRolePayload): Promise<Role> =>
  mockUpdateRole(payload);

export const deleteRole = (uuid: string): Promise<Role> => mockDeleteRole(uuid);
