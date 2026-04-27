import type { Role } from "@api/roles";
import Modal from "@ui/Modal/Modal";
import RoleForm from "../RoleForm/RoleForm";
import { getServerErrorMessage } from "@lib/getErrorMessage";

type RoleModal = "create" | "edit" | null;

interface RoleModalsProps {
  modal: RoleModal;
  activeRole: Role | null;
  onClose: () => void;
  onCreate: (data: { role_uuid: string; role_name: string }) => void;
  onEdit: (data: { role_name: string }) => void;
  isCreating: boolean;
  isEditing: boolean;
  createError?: unknown;
  editError?: unknown;
}

const RoleModals = ({
  modal,
  activeRole,
  onClose,
  onCreate,
  onEdit,
  isCreating,
  isEditing,
  createError,
  editError,
}: RoleModalsProps) => (
  <Modal
    title={modal === "create" ? "Новая роль" : "Редактирование роли"}
    isOpen={modal !== null}
    onClose={onClose}
  >
    {modal === "create" ? (
      <RoleForm
        onSubmit={onCreate}
        isPending={isCreating}
        submitLabel="Создать"
        serverError={getServerErrorMessage(createError)}
      />
    ) : activeRole ? (
      <RoleForm
        defaultValues={{ role_uuid: activeRole.role_uuid, role_name: activeRole.role_name }}
        onSubmit={onEdit}
        isPending={isEditing}
        submitLabel="Сохранить"
        serverError={getServerErrorMessage(editError)}
      />
    ) : null}
  </Modal>
);

export default RoleModals;
