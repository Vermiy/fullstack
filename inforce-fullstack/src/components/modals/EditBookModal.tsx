type EditBookModalProps = {
  isOpen: boolean;
  name: string;
  author: string;
  pageCount: string;
  formError: string | null;
  isSubmitting: boolean;
  onNameChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onPageCountChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function EditBookModal({
  isOpen,
  name,
  author,
  pageCount,
  formError,
  isSubmitting,
  onNameChange,
  onAuthorChange,
  onPageCountChange,
  onClose,
  onSubmit,
}: EditBookModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm rounded-xl border border-(--border) bg-(--surface) p-5 shadow-[0_14px_30px_rgba(117,74,28,0.18)]">
        <h2 className="text-foreground text-lg font-semibold">Edit book</h2>
        <p className="mt-1 text-sm text-[#6f5438]">Update book information.</p>

        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <div>
            <label htmlFor="edit-book-name" className="mb-1 block text-sm text-[#5d462f]">
              Name
            </label>
            <input
              id="edit-book-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="text-foreground w-full rounded-md border border-(--border) bg-white px-3 py-2 text-sm outline-none focus:border-[#a58051]"
            />
          </div>
          <div>
            <label htmlFor="edit-book-author" className="mb-1 block text-sm text-[#5d462f]">
              Author
            </label>
            <input
              id="edit-book-author"
              value={author}
              onChange={(e) => onAuthorChange(e.target.value)}
              className="text-foreground w-full rounded-md border border-(--border) bg-white px-3 py-2 text-sm outline-none focus:border-[#a58051]"
            />
          </div>
          <div>
            <label htmlFor="edit-book-page-count" className="mb-1 block text-sm text-[#5d462f]">
              Page count
            </label>
            <input
              id="edit-book-page-count"
              type="number"
              min="1"
              value={pageCount}
              onChange={(e) => onPageCountChange(e.target.value)}
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
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
