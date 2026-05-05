type CreateUserModalProps = {
  isOpen: boolean;
  name: string;
  email: string;
  password: string;
  formError: string | null;
  isSubmitting: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function CreateUserModal({
  isOpen,
  name,
  email,
  password,
  formError,
  isSubmitting,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onClose,
  onSubmit,
}: CreateUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm rounded-xl border border-(--border) bg-(--surface) p-5 shadow-[0_14px_30px_rgba(117,74,28,0.18)]">
        <h2 className="text-foreground text-lg font-semibold">Create user</h2>
        <p className="mt-1 text-sm text-[#6f5438]">Add a new user account.</p>

        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <div>
            <label htmlFor="create-user-name" className="mb-1 block text-sm text-[#5d462f]">
              Name
            </label>
            <input
              id="create-user-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="text-foreground w-full rounded-md border border-(--border) bg-white px-3 py-2 text-sm outline-none focus:border-[#a58051]"
            />
          </div>
          <div>
            <label htmlFor="create-user-email" className="mb-1 block text-sm text-[#5d462f]">
              Email
            </label>
            <input
              id="create-user-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="text-foreground w-full rounded-md border border-(--border) bg-white px-3 py-2 text-sm outline-none focus:border-[#a58051]"
            />
          </div>
          <div>
            <label htmlFor="create-user-password" className="mb-1 block text-sm text-[#5d462f]">
              Password
            </label>
            <input
              id="create-user-password"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="text-foreground w-full rounded-md border border-(--border) bg-white px-3 py-2 text-sm outline-none focus:border-[#a58051]"
            />
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
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
