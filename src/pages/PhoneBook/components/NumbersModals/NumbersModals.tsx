import type {
  CreatePhoneBook,
  PhoneBook,
  UpdatePhoneBook,
} from "@/api/phoneBook";
import Modal from "@/components/ui/Modal/Modal";
import { getServerErrorMessage } from "@lib/getErrorMessage";
import NumbersForm from "../NumbersForm/NumbersForm";

type NumbersModal = "create" | "edit" | null;

interface NumbersModalsProps {
  modal: NumbersModal;
  activeNumbers: PhoneBook | null;
  onClose: () => void;
  onCreate: (data: CreatePhoneBook) => void;
  onEdit: (data: UpdatePhoneBook) => void;
  isCreating: boolean;
  isEditing: boolean;
  createError?: unknown;
  editError?: unknown;
}

const NumbersModals = ({
  modal,
  activeNumbers,
  onClose,
  onCreate,
  onEdit,
  isCreating,
  isEditing,
  createError,
  editError,
}: NumbersModalsProps) => (
  <>
    <Modal
      title={modal === "create" ? "Новый номер" : "Редактирование"}
      isOpen={modal === "create" || modal === "edit"}
      onClose={onClose}
    >
      {modal === "create" ? (
        <NumbersForm
          key="create"
          onSubmit={onCreate}
          isPending={isCreating}
          submitLabel="Создать"
          serverError={getServerErrorMessage(createError)}
        />
      ) : activeNumbers ? (
        <NumbersForm
          key={activeNumbers.number_uuid}
          defaultValues={{
            number_uuid: activeNumbers.number_uuid,
            number_name: activeNumbers.number_name,
            number_number: activeNumbers.number_number,
          }}
          onSubmit={onEdit}
          isPending={isEditing}
          submitLabel="Сохранить"
          serverError={getServerErrorMessage(editError)}
        />
      ) : null}
    </Modal>
  </>
);

export default NumbersModals;
