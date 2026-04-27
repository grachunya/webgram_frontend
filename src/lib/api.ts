import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://вебграм.рф/backend/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;

let pending: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!original) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    const shouldTryRefresh =
      status === 401 &&
      !original._retry &&
      !original.url?.includes("/auth/refresh") &&
      !original.url?.includes("/auth/logout");

    if (!shouldTryRefresh) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pending.push({
          resolve: () => resolve(api(original)),
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      await axios.post(`${BASE_URL}/auth/refresh`, null, {
        withCredentials: true,
      });

      pending.forEach(({ resolve }) => resolve(api(original)));
      pending = [];

      return api(original);
    } catch (refreshError) {
      pending.forEach(({ reject }) => reject(refreshError));
      pending = [];

      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
