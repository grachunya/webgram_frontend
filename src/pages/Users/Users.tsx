import { useState } from "react";
import { Plus, Users as UsersIcon, Key } from "lucide-react";
import type { User } from "@api/users";
import type { Role } from "@api/roles";
import Button from "@ui/Button/Button";
import ModalConfirm from "@ui/ModalConfirm/ModalConfirm";
import Tabs from "@components/ui/Tabs/Tabs";
import type { TabItem } from "@components/ui/Tabs/Tabs";
import { useUsers } from "./hooks/useUsers";
import { useRoles } from "./hooks/useRoles";
import UsersTable from "./components/UsersTable/UsersTable";
import UserModals from "./components/UserModals/UserModals";
import RolesTable from "./components/RolesTable/RolesTable";
import RoleModals from "./components/RoleModals/RoleModals";
import styles from "./Users.module.scss";
import { useConfirm } from "../../hooks/useConfirm";
import { getServerErrorMessage } from "@lib/getErrorMessage";

type Tab = "users" | "roles";

const tabs: TabItem[] = [
  { id: "users", label: "Пользователи", icon: <UsersIcon size={16} /> },
  { id: "roles", label: "Роли", icon: <Key size={16} /> },
];

const Users = () => {
  const [activeTab, setActiveTab] = useState<Tab>("users");

  const usersData = useUsers();
  const rolesData = useRoles();
  const { confirm, requestConfirm, handleConfirm, cancelConfirm } =
    useConfirm();

  const [userModal, setUserModal] = useState<
    "create" | "edit" | "password" | null
  >(null);
  const [activeUser, setActiveUser] = useState<User | null>(null);

  const [roleModal, setRoleModal] = useState<"create" | "edit" | null>(null);
  const [activeRole, setActiveRole] = useState<Role | null>(null);

  const closeUserModal = () => {
    setUserModal(null);
    setActiveUser(null);
  };
  const closeRoleModal = () => {
    setRoleModal(null);
    setActiveRole(null);
  };

  const handleCreateUser = (data: {
  user_uuid: string;
  user_name: string;
  role_uuid: string;
  user_password?: string;
}) => {
  usersData.create.mutate(
    {
      ...data,
      user_password: data.user_password ?? "",
    },
    { onSuccess: closeUserModal },
  );
};

  const handleEditUser = (data: { user_name: string; role_uuid: string }) => {
    if (!activeUser) return;
    usersData.update.mutate(
      { user_uuid: activeUser.user_uuid, ...data },
      { onSuccess: closeUserModal },
    );
  };

  const handlePassword = (data: { user_password: string }) => {
    if (!activeUser) return;
    usersData.changePassword.mutate(
      { uuid: activeUser.user_uuid, payload: data },
      { onSuccess: closeUserModal },
    );
  };

  const handleCreateRole = (data: { role_uuid: string; role_name: string }) => {
    rolesData.create.mutate(data, { onSuccess: closeRoleModal });
  };

  const handleEditRole = (data: { role_name: string }) => {
    if (!activeRole) return;
    rolesData.update.mutate(
      { role_uuid: activeRole.role_uuid, ...data },
      { onSuccess: closeRoleModal },
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>Управление</h1>
        <Button
          onClick={
            activeTab === "users"
              ? () => setUserModal("create")
              : () => setRoleModal("create")
          }
        >
          <Plus size={18} />
          <span>
            {activeTab === "users" ? "Добавить пользователя" : "Добавить роль"}
          </span>
        </Button>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as Tab)}
      />

      {activeTab === "users" ? (
        usersData.isPending ? (
          <p className={styles.loading}>Загрузка…</p>
        ) : usersData.isError ? (
          <p className={styles.error}>
            {getServerErrorMessage(usersData.error) ?? "Ошибка загрузки пользователей"}
          </p>
        ) : (
          <UsersTable
            users={usersData.users}
            onEdit={(u) => {
              setActiveUser(u);
              setUserModal("edit");
            }}
            onPassword={(u) => {
              setActiveUser(u);
              setUserModal("password");
            }}
            onDelete={(u) =>
              requestConfirm(
                "Удаление пользователя",
                `Удалить «${u.user_name}»?`,
                () => usersData.remove.mutate(u.user_uuid),
              )
            }
          />
        )
      ) : rolesData.isPending ? (
        <p className={styles.loading}>Загрузка…</p>
      ) : rolesData.isError ? (
        <p className={styles.error}>
          {getServerErrorMessage(rolesData.error) ?? "Ошибка загрузки ролей"}
        </p>
      ) : (
        <RolesTable
          roles={rolesData.roles}
          onEdit={(r) => {
            setActiveRole(r);
            setRoleModal("edit");
          }}
          onDelete={(r) =>
            requestConfirm("Удаление роли", `Удалить «${r.role_name}»?`, () =>
              rolesData.remove.mutate(r.role_uuid),
            )
          }
        />
      )}

      <UserModals
        modal={userModal}
        activeUser={activeUser}
        roles={rolesData.roles}
        onClose={closeUserModal}
        onCreate={handleCreateUser}
        onEdit={handleEditUser}
        onPassword={handlePassword}
        isCreating={usersData.create.isPending}
        isEditing={usersData.update.isPending}
        isChangingPassword={usersData.changePassword.isPending}
        createError={usersData.create.error}
        editError={usersData.update.error}
        passwordError={usersData.changePassword.error}
      />

      <RoleModals
        modal={roleModal}
        activeRole={activeRole}
        onClose={closeRoleModal}
        onCreate={handleCreateRole}
        onEdit={handleEditRole}
        isCreating={rolesData.create.isPending}
        isEditing={rolesData.update.isPending}
        createError={rolesData.create.error}
        editError={rolesData.update.error}
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

export default Users;
