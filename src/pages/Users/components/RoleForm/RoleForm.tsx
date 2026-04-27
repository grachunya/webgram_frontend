import { useMemo } from "react";
import { useForm } from "react-hook-form";
import Input from "@ui/Input/Input";
import Button from "@ui/Button/Button";
import styles from "./RoleForm.module.scss";

interface FormValues {
  role_uuid: string;
  role_name: string;
}

interface RoleFormProps {
  defaultValues?: { role_uuid?: string; role_name: string };
  onSubmit: (data: FormValues) => void;
  isPending: boolean;
  submitLabel: string;
  serverError?: string;
}

const RoleForm = ({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel,
  serverError,
}: RoleFormProps) => {
  const generatedRoleUuid = useMemo(() => {
    return defaultValues?.role_uuid ?? crypto.randomUUID();
  }, [defaultValues?.role_uuid]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      role_uuid: generatedRoleUuid,
      role_name: defaultValues?.role_name ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.fields}>
        <input type="hidden" {...register("role_uuid")} />
        <Input
          label="Название роли"
          placeholder="Название роли"
          error={errors.role_name?.message}
          {...register("role_name", {
            required: "Обязательное поле",
            minLength: { value: 2, message: "Минимум 2 символа" },
          })}
        />
      </div>
      {serverError && <span className={styles.serverError}>{serverError}</span>}
      <Button type="submit" block disabled={isPending}>
        {isPending ? "Сохранение..." : submitLabel}
      </Button>
    </form>
  );
};

export default RoleForm;
