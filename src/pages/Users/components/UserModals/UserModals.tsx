import type { User } from "@api/users";
import type { Role } from "@api/roles";
import Modal from "@ui/Modal/Modal";
import UserForm from "../UserForm/UserForm";
import PasswordForm from "../PasswordForm/PasswordForm";
import { getServerErrorMessage } from "@lib/getErrorMessage";

type UserModal = "create" | "edit" | "password" | null;

interface UserModalsProps {
  modal: UserModal;
  activeUser: User | null;
  roles: Role[];
  onClose: () => void;
  onCreate: (data: { user_uuid: string; user_name: string; role_uuid: string; user_password?: string }) => void;
  onEdit: (data: { user_name: string; role_uuid: string }) => void;
  onPassword: (data: { user_password: string }) => void;
  isCreating: boolean;
  isEditing: boolean;
  isChangingPassword: boolean;
  createError?: unknown;
  editError?: unknown;
  passwordError?: unknown;
}

const UserModals = ({
  modal,
  activeUser,
  roles,
  onClose,
  onCreate,
  onEdit,
  onPassword,
  isCreating,
  isEditing,
  isChangingPassword,
  createError,
  editError,
  passwordError,
}: UserModalsProps) => (
  <>
    <Modal
      title={modal === "create" ? "Новый пользователь" : "Редактирование"}
      isOpen={modal === "create" || modal === "edit"}
      onClose={onClose}
    >
      {modal === "create" ? (
        <UserForm
          key="create"
          roles={roles}
          onSubmit={onCreate}
          isPending={isCreating}
          submitLabel="Создать"
          showPasswordField
          serverError={getServerErrorMessage(createError)}
        />
      ) : activeUser ? (
        <UserForm
          key={activeUser.user_uuid}
          roles={roles}
          defaultValues={{
            user_uuid: activeUser.user_uuid,
            user_name: activeUser.user_name,
            role_uuid: activeUser.role.role_uuid,
          }}
          onSubmit={onEdit}
          isPending={isEditing}
          submitLabel="Сохранить"
          showPasswordField={false}
          serverError={getServerErrorMessage(editError)}
        />
      ) : null}
    </Modal>

    <Modal title="Смена пароля" isOpen={modal === "password"} onClose={onClose}>
      <PasswordForm
        onSubmit={onPassword}
        isPending={isChangingPassword}
        serverError={getServerErrorMessage(passwordError)}
      />
    </Modal>
  </>
);

export default UserModals;
