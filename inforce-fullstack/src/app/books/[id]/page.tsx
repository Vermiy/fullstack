"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { GetBookById } from "@/src/services/book.services";

export default function Book() {
  const params = useParams();
  const bookId = params.id as string;

  const {
    data: book,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => GetBookById(bookId),
  });

  if (isLoading) {
    return <div className="px-6 py-10 text-[#6d5438]">Loading book...</div>;
  }

  if (error || !book) {
    return <div className="px-6 py-10 text-(--danger)">Failed to load book</div>;
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-10">
      <div className="rounded-2xl border border-(--border) bg-(--surface) p-8 shadow-[0_14px_30px_rgba(117,74,28,0.1)]">
        <Link
          href="/books"
          className="inline-block text-sm font-medium text-[#8b6a43] underline-offset-4 transition hover:underline"
        >
          Back to books
        </Link>

        <div className="mt-6 space-y-4">
          <h1 className="text-foreground text-3xl font-bold">{book.name}</h1>

          <div className="space-y-3">
            <div className="border-b border-(--border) pb-3">
              <p className="text-sm font-medium text-[#5d462f]">Author</p>
              <p className="text-foreground mt-1">{book.author}</p>
            </div>

            <div className="border-b border-(--border) pb-3">
              <p className="text-sm font-medium text-[#5d462f]">Pages</p>
              <p className="text-foreground mt-1">{book.pageCount}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-[#5d462f]">Book ID</p>
              <p className="text-foreground mt-1">{book.id}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
