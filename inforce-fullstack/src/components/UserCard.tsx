import { IUser } from "../types/UserType";

interface UserProps {
  user: IUser;
  onDelete: () => void;
  onEdit: () => void;
}

export default function UserCard({ user, onDelete, onEdit }: UserProps) {
  return (
    <article className="rounded-xl border border-(--border) bg-(--surface) p-4 shadow-[0_8px_20px_rgba(117,74,28,0.06)]">
      <h3 className="text-foreground font-semibold">{user.name}</h3>
      <p className="text-sm text-[#6f5438]">{user.email}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {user.roles && user.roles.length > 0 ? (
          user.roles.map((role) => (
            <span
              key={role}
              className="inline-block rounded-full bg-[#8b6a43] px-2.5 py-1 text-xs font-medium text-[#fff9f0]"
            >
              {role}
            </span>
          ))
        ) : (
          <p className="text-xs text-[#8d6b47]">No role assigned</p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onEdit();
          }}
          className="text-foreground rounded-md border border-(--border) px-3 py-1 text-sm font-medium transition hover:bg-[#f6eee2]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDelete();
          }}
          className="rounded-md border border-(--danger) px-3 py-1 text-sm font-medium text-(--danger) transition hover:bg-[#fde8e8]"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
