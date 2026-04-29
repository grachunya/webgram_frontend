import { useAppDispatch } from "@/store/hooks";
import { clearUser, fetchCurrentUser } from "@/store/slices/userSlice";
import type { LoginPayload } from "@api/auth";
import { login as loginApi, logout as logoutApi } from "@api/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: () => {
      dispatch(fetchCurrentUser())
        .unwrap()
        .then(() => {
          navigate("/home");
        })
        .catch((error) => {
          console.error("Ошибка загрузки пользователя:", error);
        });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      dispatch(clearUser());
      navigate("/login");
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isPending: loginMutation.isPending || logoutMutation.isPending,
    isError: loginMutation.isError || logoutMutation.isError,
    error: loginMutation.error || logoutMutation.error,
  };
};
