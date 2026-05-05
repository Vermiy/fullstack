import { IUserRole } from "@/src/types/UserRoles";

type EditUserModalProps = {
  isOpen: boolean;
  name: string;
  email: string;
  role: IUserRole | null;
  formError: string | null;
  isSubmitting: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onRoleChange: (role: IUserRole) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function EditUserModal({
  isOpen,
  name,
  email,
  role,
  formError,
  isSubmitting,
  onNameChange,
  onEmailChange,
  onRoleChange,
  onClose,
  onSubmit,
}: EditUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm rounded-xl border border-(--border) bg-(--surface) p-5 shadow-[0_14px_30px_rgba(117,74,28,0.18)]">
        <h2 className="text-foreground text-lg font-semibold">Edit user</h2>
        <p className="mt-1 text-sm text-[#6f5438]">Update user information.</p>

        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <div>
            <label htmlFor="edit-user-name" className="mb-1 block text-sm text-[#5d462f]">
              Name
            </label>
            <input
              id="edit-user-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="text-foreground w-full rounded-md border border-(--border) bg-white px-3 py-2 text-sm outline-none focus:border-[#a58051]"
            />
          </div>
          <div>
            <label htmlFor="edit-user-email" className="mb-1 block text-sm text-[#5d462f]">
              Email
            </label>
            <input
              id="edit-user-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="text-foreground w-full rounded-md border border-(--border) bg-white px-3 py-2 text-sm outline-none focus:border-[#a58051]"
            />
          </div>

          <div>
            <p className="mb-2 block text-sm text-[#5d462f]">Role</p>
            <div className="flex flex-wrap gap-3">
              <label className="text-foreground inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="edit-user-role"
                  checked={role === IUserRole.USER}
                  onChange={() => onRoleChange(IUserRole.USER)}
                  className="h-4 w-4 rounded border-(--border)"
                />
                USER
              </label>

              <label className="text-foreground inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="edit-user-role"
                  checked={role === IUserRole.ADMIN}
                  onChange={() => onRoleChange(IUserRole.ADMIN)}
                  className="h-4 w-4 rounded border-(--border)"
                />
                ADMIN
              </label>
            </div>
          </div>

          {formError && <p className="text-sm text-(--danger)">{formError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-foreground rounded-md border border-(--border) px-3 py-1.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-[#8b6a43] px-3 py-1.5 text-sm font-medium text-[#fff9f0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
