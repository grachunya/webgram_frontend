import { useForm } from "react-hook-form";
import Input from "@ui/Input/Input";
import Button from "@ui/Button/Button";
import styles from "./PasswordForm.module.scss";

interface PasswordFormProps {
  onSubmit: (data: { user_password: string }) => void;
  isPending: boolean;
  serverError?: string;
}

const PasswordForm = ({ onSubmit, isPending, serverError }: PasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ user_password: string }>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.fields}>
        <Input
          label="Новый пароль"
          type="password"
          placeholder="••••••••"
          error={errors.user_password?.message}
          {...register("user_password", {
            required: "Обязательное поле",
            minLength: { value: 6, message: "Минимум 6 символов" },
          })}
        />
      </div>
      {serverError && <span className={styles.serverError}>{serverError}</span>}
      <Button type="submit" block disabled={isPending}>
        {isPending ? "Сохранение..." : "Сменить пароль"}
      </Button>
    </form>
  );
};

export default PasswordForm;
