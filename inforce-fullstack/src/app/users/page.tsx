"use client";

import { IUserRole } from "@/src/types/UserRoles";
import { useUser } from "../../store/UserContext";
import { useState } from "react";
import { IUser } from "@/src/types/UserType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateUser, DeleteUser, GetAllUsers, UpdateUser } from "../../services/user.services";
import UserCard from "@/src/components/UserCard";
import Link from "next/link";
import CreateUserModal from "@/src/components/modals/CreateUserModal";
import EditUserModal from "@/src/components/modals/EditUserModal";
import {
  CreateUserFormState,
  EditUserFormState,
  EMPTY_CREATE_USER_FORM,
  EMPTY_EDIT_USER_FORM,
} from "@/src/components/forms/userForms";
import { useAdminGuard } from "@/src/utils/roleGuard";

type CreateUserMutationPayload = Pick<IUser, "name" | "email"> & {
  password: string;
};

type UpdateUserMutationPayload = Pick<IUser, "name" | "email"> & {
  role: IUserRole;
};

type UpdateUserMutationVariables = {
  id: number;
  payload: UpdateUserMutationPayload;
};

export default function Users() {
  const { user, loading } = useUser();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editUserForm, setEditUserForm] = useState<EditUserFormState>(EMPTY_EDIT_USER_FORM);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createUserForm, setCreateUserForm] = useState<CreateUserFormState>(EMPTY_CREATE_USER_FORM);
  const [createFormError, setCreateFormError] = useState<string | null>(null);

  useAdminGuard(user, loading);

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => GetAllUsers(),
    enabled: !!user,
  });

  const handleSuccess = () => {
    setActionError(null);
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const handleError = (msg: string) => {
    setActionError(msg);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => DeleteUser(id),
    onSuccess: () => handleSuccess(),
    onError: () => handleError("Failed to delete user"),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, payload }: UpdateUserMutationVariables) => UpdateUser(id, payload),
    onSuccess: () => handleSuccess(),
    onError: () => handleError("Failed to edit user"),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserMutationPayload) => CreateUser(payload),
    onSuccess: () => handleSuccess(),
    onError: () => handleError("Failed to create user"),

  });

  const handleDelete = (targetUser: IUser) => {
    const confirmed = window.confirm(`Delete ${targetUser.name}?`);
    if (!confirmed) return;

    deleteMutation.mutate(targetUser.id);
  };

  const handleEdit = (targetUser: IUser) => {
    setEditingUserId(targetUser.id);
    setEditUserForm({
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.roles.includes(IUserRole.ADMIN) ? IUserRole.ADMIN : IUserRole.USER,
    });
    setEditFormError(null);
  };

  const closeEditModal = () => {
    setEditingUserId(null);
    setEditUserForm(EMPTY_EDIT_USER_FORM);
    setEditFormError(null);
  };

  const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingUserId) return;

    const name = editUserForm.name.trim();
    const email = editUserForm.email.trim();

    if (!name || !email) {
      setEditFormError("Name and email are required");
      return;
    }

    if (!editUserForm.role) {
      setEditFormError("Select one role");
      return;
    }

    try {
      await editMutation.mutateAsync({
        id: editingUserId,
        payload: { name, email, role: editUserForm.role },
      });
      closeEditModal();
    } catch {
      setEditFormError("Failed to edit user");
    }
  };

  const openCreateModal = () => {
    setCreateUserForm(EMPTY_CREATE_USER_FORM);
    setCreateFormError(null);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateUserForm(EMPTY_CREATE_USER_FORM);
    setCreateFormError(null);
  };

  const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = createUserForm.name.trim();
    const email = createUserForm.email.trim();
    const password = createUserForm.password;

    if (!name || !email || !password) {
      setCreateFormError("Name, email and password are required");
      return;
    }

    if (password.length < 6) {
      setCreateFormError("Password must be at least 6 characters");
      return;
    }

    try {
      await createMutation.mutateAsync({ name, email, password });
      closeCreateModal();
    } catch {
      setCreateFormError("Failed to create user");
    }
  };

  if (loading || isLoading) {
    return <div className="px-6 py-10 text-[#6d5438]">Loading users...</div>;
  }

  if (error) {
    return <div className="px-6 py-10 text-(--danger)">Failed to load users</div>;
  }

  const users: IUser[] = data ?? [];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-foreground text-3xl font-bold">Users</h1>
      <button
        type="button"
        onClick={openCreateModal}
        className="mt-3 rounded-md bg-[#8b6a43] px-3 py-1.5 text-sm font-medium text-[#fff9f0]"
      >
        Create user
      </button>
      {actionError && <p className="mt-4 text-sm text-(--danger)">{actionError}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((currentUser) => (
          <Link key={currentUser.id} href={`/users/${currentUser.id}`} className="block">
            <UserCard
              user={currentUser}
              onEdit={() => handleEdit(currentUser)}
              onDelete={() => handleDelete(currentUser)}
            />
          </Link>
        ))}
      </div>

      <EditUserModal
        isOpen={!!editingUserId}
        name={editUserForm.name}
        email={editUserForm.email}
        role={editUserForm.role}
        formError={editFormError}
        isSubmitting={editMutation.isPending}
        onNameChange={(value) =>
          setEditUserForm((prev) => ({
            ...prev,
            name: value,
          }))
        }
        onEmailChange={(value) =>
          setEditUserForm((prev) => ({
            ...prev,
            email: value,
          }))
        }
        onRoleChange={(role) =>
          setEditUserForm((prev) => ({
            ...prev,
            role,
          }))
        }
        onClose={closeEditModal}
        onSubmit={handleSubmitEdit}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        name={createUserForm.name}
        email={createUserForm.email}
        password={createUserForm.password}
        formError={createFormError}
        isSubmitting={createMutation.isPending}
        onNameChange={(value) =>
          setCreateUserForm((prev) => ({
            ...prev,
            name: value,
          }))
        }
        onEmailChange={(value) =>
          setCreateUserForm((prev) => ({
            ...prev,
            email: value,
          }))
        }
        onPasswordChange={(value) =>
          setCreateUserForm((prev) => ({
            ...prev,
            password: value,
          }))
        }
        onClose={closeCreateModal}
        onSubmit={handleSubmitCreate}
      />
    </section>
  );
}
