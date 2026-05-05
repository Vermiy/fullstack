"use client";

import { IUserRole } from "@/src/types/UserRoles";
import { useUser } from "../../store/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IUser } from "@/src/types/UserType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateUser, DeleteUser, GetAllUsers, UpdateUser } from "../../services/user.services";
import UserCard from "@/src/components/UserCard";
import Link from "next/link";
import CreateUserModal from "@/src/components/modals/CreateUserModal";
import EditUserModal from "@/src/components/modals/EditUserModal";

export default function Users() {
  const router = useRouter();
  const { user, loading } = useUser();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<IUserRole | null>(null);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createFormError, setCreateFormError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const roles = user.roles || [];

    if (!roles.includes(IUserRole.ADMIN)) {
      router.push("/forbidden");
    }
  }, [user, loading, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => GetAllUsers(),
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => DeleteUser(id),
    onSuccess: () => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      setActionError("Failed to delete user");
    },
  });

  const editMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { name: string; email: string; role: IUserRole };
    }) => UpdateUser(id, payload),
    onSuccess: () => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      setActionError("Failed to edit user");
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; email: string; password: string }) => CreateUser(payload),
    onSuccess: () => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      setActionError("Failed to create user");
    },
  });

  const handleDelete = (targetUser: IUser) => {
    const confirmed = window.confirm(`Delete ${targetUser.name}?`);
    if (!confirmed) return;

    deleteMutation.mutate(targetUser.id);
  };

  const handleEdit = (targetUser: IUser) => {
    setEditingUser(targetUser);
    setEditName(targetUser.name);
    setEditEmail(targetUser.email);
    setEditRole(targetUser.roles.includes(IUserRole.ADMIN) ? IUserRole.ADMIN : IUserRole.USER);
    setEditFormError(null);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditName("");
    setEditEmail("");
    setEditRole(null);
    setEditFormError(null);
  };

  const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingUser) return;

    const name = editName.trim();
    const email = editEmail.trim();

    if (!name || !email) {
      setEditFormError("Name and email are required");
      return;
    }

    if (!editRole) {
      setEditFormError("Select one role");
      return;
    }

    try {
      await editMutation.mutateAsync({
        id: editingUser.id,
        payload: { name, email, role: editRole },
      });
      closeEditModal();
    } catch {
      setEditFormError("Failed to edit user");
    }
  };

  const openCreateModal = () => {
    setCreateName("");
    setCreateEmail("");
    setCreatePassword("");
    setCreateFormError(null);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateName("");
    setCreateEmail("");
    setCreatePassword("");
    setCreateFormError(null);
  };

  const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = createName.trim();
    const email = createEmail.trim();
    const password = createPassword;

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
        isOpen={!!editingUser}
        name={editName}
        email={editEmail}
        role={editRole}
        formError={editFormError}
        isSubmitting={editMutation.isPending}
        onNameChange={setEditName}
        onEmailChange={setEditEmail}
        onRoleChange={setEditRole}
        onClose={closeEditModal}
        onSubmit={handleSubmitEdit}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        name={createName}
        email={createEmail}
        password={createPassword}
        formError={createFormError}
        isSubmitting={createMutation.isPending}
        onNameChange={setCreateName}
        onEmailChange={setCreateEmail}
        onPasswordChange={setCreatePassword}
        onClose={closeCreateModal}
        onSubmit={handleSubmitCreate}
      />
    </section>
  );
}
