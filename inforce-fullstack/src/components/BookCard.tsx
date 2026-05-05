import { IBook } from "../types/BookType";

interface BookProps {
  book: IBook;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function BookCard({ book, onDelete, onEdit }: BookProps) {
  return (
    <article className="rounded-2xl border border-(--border) bg-(--surface) p-5 shadow-[0_10px_26px_rgba(117,74,28,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(117,74,28,0.12)]">
      <h2 className="text-foreground text-lg font-semibold">{book.name}</h2>
      <p className="mt-2 text-sm text-[#674c2f]">Author: {book.author}</p>
      <p className="text-sm text-[#8d6b47]">Pages: {book.pageCount}</p>
      {(onEdit || onDelete) && (
        <div className="mt-4 flex gap-2">
          {onEdit && (
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
          )}

          {onDelete && (
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
          )}
        </div>
      )}
    </article>
  );
}
