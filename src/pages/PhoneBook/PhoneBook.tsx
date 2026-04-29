import { Plus } from "lucide-react";
import { useState } from "react";

import Button from "@ui/Button/Button";
import ModalConfirm from "@ui/ModalConfirm/ModalConfirm";

import type {
  CreatePhoneBook,
  PhoneBook,
  UpdatePhoneBook,
} from "@/api/phoneBook";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getServerErrorMessage } from "@lib/getErrorMessage";
import { useConfirm } from "../../hooks/useConfirm";
import styles from "./PhoneBook.module.scss";
import NumbersModals from "./components/NumbersModals/NumbersModals";
import NumbersTable from "./components/NumbersTable/NumbersTable";
import { usePhoneBook } from "./hooks/usePhoneBook";

const PhoneBookPage = () => {
  const numbersData = usePhoneBook();
  const { data: user } = useCurrentUser();
  const { confirm, requestConfirm, handleConfirm, cancelConfirm } =
    useConfirm();

  const [activeNumber, setActiveNumber] = useState<PhoneBook | null>(null);
  const [numberModal, setNumberModal] = useState<"create" | "edit" | null>(
    null,
  );

  const closeNumberModal = () => {
    setNumberModal(null);
    setActiveNumber(null);
  };

  const handleCreateNumber = (data: CreatePhoneBook) => {
    numbersData.create.mutate(data, { onSuccess: closeNumberModal });
  };

  const handleEditNumber = (data: UpdatePhoneBook) => {
    numbersData.update.mutate(data, { onSuccess: closeNumberModal });
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>Телефонная книга</h1>
        {user?.role.role_name === "superadmin" && (
          <Button onClick={() => setNumberModal("create")}>
            <Plus size={18} />
            <span>Добавить номер</span>
          </Button>
        )}
      </div>

      {numbersData.isPending ? (
        <p className={styles.loading}>Загрузка…</p>
      ) : numbersData.isError ? (
        <p className={styles.error}>
          {getServerErrorMessage(numbersData.error) ??
            "Ошибка загрузки номеров"}
        </p>
      ) : (
        <NumbersTable
          role={user?.role.role_name || ""}
          numbers={numbersData.numbers}
          onEdit={(number) => {
            setActiveNumber(number);
            setNumberModal("edit");
          }}
          onDelete={(number) =>
            requestConfirm(
              "Удаление номера",
              `Удалить «${number.number_name}»?`,
              () => numbersData.remove.mutate(number.number_uuid),
            )
          }
        />
      )}

      <NumbersModals
        modal={numberModal}
        activeNumbers={activeNumber}
        onClose={closeNumberModal}
        onCreate={handleCreateNumber}
        onEdit={handleEditNumber}
        isCreating={numbersData.create.isPending}
        isEditing={numbersData.update.isPending}
        createError={numbersData.create.error}
        editError={numbersData.update.error}
      />

      <ModalConfirm
        isOpen={confirm !== null}
        title={confirm?.title ?? ""}
        message={confirm?.message ?? ""}
        onConfirm={handleConfirm}
        onCancel={cancelConfirm}
      />
    </div>
  );
};

export default PhoneBookPage;
