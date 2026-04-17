export interface LoginPayload {
  user_name: string;
  user_password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

const MOCK_USER = {
  user_name: 'admin1',
  user_password: '123456',
};

const fakeToken = (payload: object, ttl = 3600): string => {
  const exp = Math.floor(Date.now() / 1000) + ttl;
  return btoa(JSON.stringify({ ...payload, exp }));
};

export const mockLogin = (payload: LoginPayload): AuthResponse => {
  if (
    payload.user_name !== MOCK_USER.user_name ||
    payload.user_password !== MOCK_USER.user_password
  ) {
    throw new Error('Неверное имя пользователя или пароль');
  }

  return {
    access_token: fakeToken({ sub: payload.user_name }, 600),
    refresh_token: fakeToken({ sub: payload.user_name, type: 'refresh' }, 86400),
  };
};

export const mockRefresh = (refreshToken: string): RefreshResponse => {
  try {
    const decoded = JSON.parse(atob(refreshToken));
    if (decoded.exp < Date.now() / 1000) throw new Error('expired');
    return {
      access_token: fakeToken({ sub: decoded.sub }, 600),
      refresh_token: fakeToken({ sub: decoded.sub, type: 'refresh' }, 86400),
    };
  } catch {
    throw new Error('Недействительный токен обновления');
  }
};
