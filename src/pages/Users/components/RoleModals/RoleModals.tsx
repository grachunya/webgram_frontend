import type { Role } from "@api/roles";
import Modal from "@ui/Modal/Modal";
import RoleForm from "../RoleForm/RoleForm";

type RoleModal = "create" | "edit" | null;

interface RoleModalsProps {
  modal: RoleModal;
  activeRole: Role | null;
  onClose: () => void;
  onCreate: (data: { role_name: string }) => void;
  onEdit: (data: { role_name: string }) => void;
  isCreating: boolean;
  isEditing: boolean;
}

const RoleModals = ({
  modal,
  activeRole,
  onClose,
  onCreate,
  onEdit,
  isCreating,
  isEditing,
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
      />
    ) : activeRole ? (
      <RoleForm
        defaultValues={{ role_name: activeRole.role_name }}
        onSubmit={onEdit}
        isPending={isEditing}
        submitLabel="Сохранить"
      />
    ) : null}
  </Modal>
);

export default RoleModals;
