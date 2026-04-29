import type { PhoneBook } from "@/api/phoneBook";
import Button from "@ui/Button/Button";
import Input from "@ui/Input/Input";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import styles from "./NumbersForm.module.scss";

interface NumbersFormProps {
  defaultValues?: Partial<PhoneBook>;
  onSubmit: (data: PhoneBook) => void;
  isPending: boolean;
  submitLabel: string;
  serverError?: string;
}

const NumbersForm = ({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel,
  serverError,
}: NumbersFormProps) => {
  const generatedNumbersUuid = useMemo(() => {
    return defaultValues?.number_uuid ?? crypto.randomUUID();
  }, [defaultValues?.number_uuid]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneBook>({
    defaultValues: {
      number_uuid: generatedNumbersUuid,
      number_name: defaultValues?.number_name ?? "",
      number_number: defaultValues?.number_number ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.fields}>
        <input type="hidden" {...register("number_uuid")} />
        <Input
          label="Название"
          placeholder="Название"
          error={errors.number_name?.message}
          {...register("number_name", {
            required: "Обязательное поле",
            minLength: { value: 3, message: "Минимум 3 символа" },
          })}
        />

        <Input
          label="Номер"
          placeholder="Номер"
          error={errors.number_number?.message}
          {...register("number_number", {
            required: "Обязательное поле",
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

export default NumbersForm;
