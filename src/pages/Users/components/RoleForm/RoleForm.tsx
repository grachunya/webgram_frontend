import { useForm } from "react-hook-form";
import Input from "@ui/Input/Input";
import Button from "@ui/Button/Button";
import styles from "./RoleForm.module.scss";

interface FormValues {
  role_name: string;
}

interface RoleFormProps {
  defaultValues?: { role_name: string };
  onSubmit: (data: FormValues) => void;
  isPending: boolean;
  submitLabel: string;
}

const RoleForm = ({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel,
}: RoleFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { role_name: defaultValues?.role_name ?? "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.fields}>
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
      <Button type="submit" block disabled={isPending}>
        {isPending ? "Сохранение..." : submitLabel}
      </Button>
    </form>
  );
};

export default RoleForm;
