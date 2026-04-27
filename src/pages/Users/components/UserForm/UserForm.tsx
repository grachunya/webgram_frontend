import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import type { Role } from "@api/roles";
import Input from "@ui/Input/Input";
import Select from "@ui/Select/Select";
import Button from "@ui/Button/Button";
import styles from "./UserForm.module.scss";

interface FormValues {
  user_uuid: string;
  user_name: string;
  role_uuid: string;
  user_password?: string;
}

interface UserFormProps {
  roles: Role[];
  defaultValues?: {
    user_uuid?: string;
    user_name: string;
    role_uuid: string;
    user_password?: string;
  };
  onSubmit: (data: FormValues) => void;
  isPending: boolean;
  submitLabel: string;
  showPasswordField?: boolean;
  serverError?: string;
}

const UserForm = ({
  roles,
  defaultValues,
  onSubmit,
  isPending,
  submitLabel,
  showPasswordField = true,
  serverError,
}: UserFormProps) => {
  const generatedUserUuid = useMemo(() => {
    return defaultValues?.user_uuid ?? crypto.randomUUID();
  }, [defaultValues?.user_uuid]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      user_uuid: generatedUserUuid,
      user_name: defaultValues?.user_name ?? "",
      role_uuid: defaultValues?.role_uuid ?? "",
      user_password: defaultValues?.user_password ?? "",
    },
  });

  const roleOptions = roles.map((r) => ({
    value: r.role_uuid,
    label: r.role_name,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.fields}>
        <input type="hidden" {...register("user_uuid")} />
        <Input
          label="Логин"
          placeholder="Логин"
          error={errors.user_name?.message}
          {...register("user_name", {
            required: "Обязательное поле",
            minLength: { value: 3, message: "Минимум 3 символа" },
          })}
        />

        <Controller
          name="role_uuid"
          control={control}
          rules={{ required: "Обязательное поле" }}
          render={({ field }) => (
            <Select
              label="Роль"
              options={roleOptions}
              value={field.value}
              error={errors.role_uuid?.message}
              onChange={field.onChange}
              name={field.name}
            />
          )}
        />

        {showPasswordField && (
          <Input
            label="Пароль"
            type="password"
            placeholder="••••••••"
            error={errors.user_password?.message}
            {...register("user_password", {
              required: showPasswordField ? "Обязательное поле" : false,
              minLength: { value: 6, message: "Минимум 6 символов" },
            })}
          />
        )}
      </div>

      {serverError && <span className={styles.serverError}>{serverError}</span>}

      <Button type="submit" block disabled={isPending}>
        {isPending ? "Сохранение..." : submitLabel}
      </Button>
    </form>
  );
};

export default UserForm;
