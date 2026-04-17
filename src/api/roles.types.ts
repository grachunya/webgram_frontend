export interface Role {
  role_uuid: string;
  role_name: string;
}

export interface CreateRolePayload {
  role_name: string;
}

export interface UpdateRolePayload {
  role_uuid: string;
  role_name: string;
}
