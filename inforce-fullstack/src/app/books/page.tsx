"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IBook } from "@/src/types/BookType";
import { useUser } from "@/src/store/UserContext";
import { IUserRole } from "@/src/types/UserRoles";
import { BookCard } from "@/src/components/BookCard";
import Link from "next/link";
import { useState } from "react";
import { CreateBook, DeleteBook, GetAllBooks, UpdateBook } from "@/src/services/book.services";
import CreateBookModal from "@/src/components/modals/CreateBookModal";
import EditBookModal from "@/src/components/modals/EditBookModal";

export default function Books() {
    const digitsOnlyPattern = /^\d+$/;
    const queryClient = useQueryClient();
    const { user } = useUser();
    const [isCreateBookModalOpen, setIsCreateBookModalOpen] = useState(false);
    const [bookName, setBookName] = useState("");
    const [bookAuthor, setBookAuthor] = useState("");
    const [bookPageCount, setBookPageCount] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [editingBook, setEditingBook] = useState<IBook | null>(null);
    const [editBookName, setEditBookName] = useState("");
    const [editBookAuthor, setEditBookAuthor] = useState("");
    const [editBookPageCount, setEditBookPageCount] = useState("");
    const [editFormError, setEditFormError] = useState<string | null>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ["books"],
        queryFn: () => GetAllBooks(),
        enabled: !!user,
    });

    const createMutation = useMutation({
        mutationFn: (payload: { name: string; author: string; pageCount: number }) =>
            CreateBook(payload),
        onSuccess: () => {
            setActionError(null);
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
        onError: () => {
            setActionError("Failed to create book");
        },
    });

    const editMutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: number;
            payload: { name: string; author: string; pageCount: number };
        }) => UpdateBook(id, payload),
        onSuccess: () => {
            setActionError(null);
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
        onError: () => {
            setActionError("Failed to edit book");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => DeleteBook(id),
        onSuccess: () => {
            setActionError(null);
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
        onError: () => {
            setActionError("Failed to delete book");
        },
    });

    const openCreateBookModal = () => {
        setBookName("");
        setBookAuthor("");
        setBookPageCount("");
        setFormError(null);
        setIsCreateBookModalOpen(true);
    };

    const closeCreateBookModal = () => {
        setBookName("");
        setBookAuthor("");
        setBookPageCount("");
        setFormError(null);
        setIsCreateBookModalOpen(false);
    };

    const handleDelete = (targetBook: IBook) => {
        const confirmed = window.confirm(`Delete ${targetBook.name}?`);
        if (!confirmed) return;

        deleteMutation.mutate(targetBook.id);
    };

    const handleEdit = (targetBook: IBook) => {
        setEditingBook(targetBook);
        setEditBookName(targetBook.name);
        setEditBookAuthor(targetBook.author);
        setEditBookPageCount(String(targetBook.pageCount));
        setEditFormError(null);
    };

    const closeEditModal = () => {
        setEditingBook(null);
        setEditBookName("");
        setEditBookAuthor("");
        setEditBookPageCount("");
        setEditFormError(null);
    };

    const handleSubmitEditBook = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editingBook) return;

        const name = editBookName.trim();
        const author = editBookAuthor.trim();
        const rawPageCount = editBookPageCount.trim();

        if (!name || !author || !rawPageCount) {
            setEditFormError("Name, author and page count are required");
            return;
        }

        if (!digitsOnlyPattern.test(rawPageCount)) {
            setEditFormError("Page count must contain digits only");
            return;
        }

        const pageCount = Number(rawPageCount);

        if (Number.isNaN(pageCount) || pageCount <= 0) {
            setEditFormError("Page count must be a positive number");
            return;
        }

        try {
            await editMutation.mutateAsync({
                id: editingBook.id,
                payload: { name, author, pageCount },
            });
            closeEditModal();
        } catch {
            setEditFormError("Failed to edit book");
        }
    };

    const handleSubmitCreateBook = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const name = bookName.trim();
        const author = bookAuthor.trim();
        const rawPageCount = bookPageCount.trim();

        if (!name || !author || !rawPageCount) {
            setFormError("Name, author and page count are required");
            return;
        }

        if (!digitsOnlyPattern.test(rawPageCount)) {
            setFormError("Page count must contain digits only");
            return;
        }

        const pageCount = Number(rawPageCount);

        if (Number.isNaN(pageCount) || pageCount <= 0) {
            setFormError("Page count must be a positive number");
            return;
        }

        try {
            await createMutation.mutateAsync({ name, author, pageCount });
            closeCreateBookModal();
        } catch {
            setFormError("Failed to create book");
        }
    };

    if (!user) return null;
    const roles = user.roles;
    const isUserAdmin = roles.includes(IUserRole.ADMIN);

    if (isLoading) {
        return <div className="px-6 py-10 text-[#6d5438]">Loading books...</div>;
    }

    if (error) {
        return <div className="px-6 py-10 text-(--danger)">Failed to load books</div>;
    }

    const books: IBook[] = data ?? [];

    return (
        <section className="mx-auto w-full max-w-6xl px-6 py-10">
            <h1 className="text-foreground text-3xl font-bold">Books</h1>
            {isUserAdmin && (
                <div>
                    <button
                        type="button"
                        onClick={openCreateBookModal}
                        className="mt-3 rounded-md bg-[#8b6a43] px-3 py-1.5 text-sm font-medium text-[#fff9f0]"
                    >
                        Create book
                    </button>
                </div>
            )}

            {actionError && <p className="mt-4 text-sm text-(--danger)">{actionError}</p>}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {books.map((b) => (
                    <Link key={b.id} href={`/books/${b.id}`} className="block">
                        <BookCard
                            book={b}
                            onEdit={isUserAdmin ? () => handleEdit(b) : undefined}
                            onDelete={isUserAdmin ? () => handleDelete(b) : undefined}
                        />
                    </Link>
                ))}
            </div>

            <EditBookModal
                isOpen={isUserAdmin && !!editingBook}
                name={editBookName}
                author={editBookAuthor}
                pageCount={editBookPageCount}
                formError={editFormError}
                isSubmitting={editMutation.isPending}
                onNameChange={setEditBookName}
                onAuthorChange={setEditBookAuthor}
                onPageCountChange={setEditBookPageCount}
                onClose={closeEditModal}
                onSubmit={handleSubmitEditBook}
            />

            <CreateBookModal
                isOpen={isUserAdmin && isCreateBookModalOpen}
                name={bookName}
                author={bookAuthor}
                pageCount={bookPageCount}
                formError={formError}
                isSubmitting={createMutation.isPending}
                onNameChange={setBookName}
                onAuthorChange={setBookAuthor}
                onPageCountChange={setBookPageCount}
                onClose={closeCreateBookModal}
                onSubmit={handleSubmitCreateBook}
            />
        </section>
    );
}
