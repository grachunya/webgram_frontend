import type { LoginPayload } from "@api/auth";
import { useAuth } from "@hooks/useAuth";
import Button from "@ui/Button/Button";
import FormCard from "@ui/FormCard/FormCard";
import Input from "@ui/Input/Input";
import { getServerErrorMessage } from "@lib/getErrorMessage";
import { useForm } from "react-hook-form";
import styles from "./Login.module.scss";

const Login = () => {
  const { login: handleLogin, isPending, isError, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>();

  const onSubmit = (values: LoginPayload) => {
    handleLogin(values);
  };

  return (
    <FormCard>
      <h1 className={styles.brandTitle}>Вебграм</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.form}>
          <Input
            label="Логин"
            placeholder="Логин"
            autoComplete="username"
            error={errors.user_name?.message}
            {...register("user_name", {
              required: "Обязательное поле",
              minLength: {
                value: 3,
                message: "Минимум 3 символов",
              },
            })}
          />

          <Input
            label="Пароль"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.user_password?.message}
            {...register("user_password", {
              required: "Обязательное поле",
              minLength: {
                value: 8,
                message: "Минимум 8 символов",
              },
            })}
          />

          {isError && (
            <span className={styles.serverError}>
              {getServerErrorMessage(error) ?? "Произошла ошибка"}
            </span>
          )}

        
        </div>
          <Button type="submit" block disabled={isPending}>
            {isPending ? "Вход..." : "Войти"}
          </Button>
      </form>
    </FormCard>
  );
};

export default Login;
