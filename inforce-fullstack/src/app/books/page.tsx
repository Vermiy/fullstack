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
import { DIGITS_ONLY_PATTERN } from "@/src/utils/validation";
import { BookFormState, EMPTY_BOOK_FORM } from "@/src/components/forms/bookForms";

type BookMutationPayload = Pick<IBook, "name" | "author" | "pageCount">;
type UpdateBookMutationVariables = {
    id: number;
    payload: BookMutationPayload;
};

export default function Books() {
    const queryClient = useQueryClient();
    const { user } = useUser();
    const [isCreateBookModalOpen, setIsCreateBookModalOpen] = useState(false);
    const [createBookForm, setCreateBookForm] = useState<BookFormState>(EMPTY_BOOK_FORM);
    const [formError, setFormError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [editingBookId, setEditingBookId] = useState<number | null>(null);
    const [editBookForm, setEditBookForm] = useState<BookFormState>(EMPTY_BOOK_FORM);
    const [editFormError, setEditFormError] = useState<string | null>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ["books"],
        queryFn: () => GetAllBooks(),
        enabled: !!user,
    });

    const handleSuccess = () => {
        setActionError(null);
        queryClient.invalidateQueries({ queryKey: ["books"] });
    };

    const handleError = (msg: string) => {
        setActionError(msg);
    };

    const createMutation = useMutation({
        mutationFn: (payload: BookMutationPayload) => CreateBook(payload),
        onSuccess: () => handleSuccess(),
        onError: () => handleError("Failed to create book"),
    });

    const editMutation = useMutation({
        mutationFn: ({ id, payload }: UpdateBookMutationVariables) => UpdateBook(id, payload),
        onSuccess: () => handleSuccess(),
        onError: () => handleError("Failed to edit book"),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => DeleteBook(id),
        onSuccess: () => handleSuccess(),
        onError: () => handleError("Failed to delete book")
    });

    const openCreateBookModal = () => {
        setCreateBookForm(EMPTY_BOOK_FORM);
        setFormError(null);
        setIsCreateBookModalOpen(true);
    };

    const closeCreateBookModal = () => {
        setCreateBookForm(EMPTY_BOOK_FORM);
        setFormError(null);
        setIsCreateBookModalOpen(false);
    };

    const handleDelete = (targetBook: IBook) => {
        const confirmed = window.confirm(`Delete ${targetBook.name}?`);
        if (!confirmed) return;

        deleteMutation.mutate(targetBook.id);
    };

    const handleEdit = (targetBook: IBook) => {
        setEditingBookId(targetBook.id);
        setEditBookForm({
            name: targetBook.name,
            author: targetBook.author,
            pageCount: String(targetBook.pageCount),
        });
        setEditFormError(null);
    };

    const closeEditModal = () => {
        setEditingBookId(null);
        setEditBookForm(EMPTY_BOOK_FORM);
        setEditFormError(null);
    };

    const handleSubmitEditBook = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editingBookId) return;

        const name = editBookForm.name.trim();
        const author = editBookForm.author.trim();
        const rawPageCount = editBookForm.pageCount.trim();

        if (!name || !author || !rawPageCount) {
            setEditFormError("Name, author and page count are required");
            return;
        }

        if (!DIGITS_ONLY_PATTERN.test(rawPageCount)) {
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
                id: editingBookId,
                payload: { name, author, pageCount },
            });
            closeEditModal();
        } catch {
            setEditFormError("Failed to edit book");
        }
    };

    const handleSubmitCreateBook = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const name = createBookForm.name.trim();
        const author = createBookForm.author.trim();
        const rawPageCount = createBookForm.pageCount.trim();

        if (!name || !author || !rawPageCount) {
            setFormError("Name, author and page count are required");
            return;
        }

        if (!DIGITS_ONLY_PATTERN.test(rawPageCount)) {
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
                isOpen={isUserAdmin && !!editingBookId}
                name={editBookForm.name}
                author={editBookForm.author}
                pageCount={editBookForm.pageCount}
                formError={editFormError}
                isSubmitting={editMutation.isPending}
                onNameChange={(value) =>
                    setEditBookForm((prev) => ({
                        ...prev,
                        name: value,
                    }))
                }
                onAuthorChange={(value) =>
                    setEditBookForm((prev) => ({
                        ...prev,
                        author: value,
                    }))
                }
                onPageCountChange={(value) =>
                    setEditBookForm((prev) => ({
                        ...prev,
                        pageCount: value,
                    }))
                }
                onClose={closeEditModal}
                onSubmit={handleSubmitEditBook}
            />

            <CreateBookModal
                isOpen={isUserAdmin && isCreateBookModalOpen}
                name={createBookForm.name}
                author={createBookForm.author}
                pageCount={createBookForm.pageCount}
                formError={formError}
                isSubmitting={createMutation.isPending}
                onNameChange={(value) =>
                    setCreateBookForm((prev) => ({
                        ...prev,
                        name: value,
                    }))
                }
                onAuthorChange={(value) =>
                    setCreateBookForm((prev) => ({
                        ...prev,
                        author: value,
                    }))
                }
                onPageCountChange={(value) =>
                    setCreateBookForm((prev) => ({
                        ...prev,
                        pageCount: value,
                    }))
                }
                onClose={closeCreateBookModal}
                onSubmit={handleSubmitCreateBook}
            />
        </section>
    );
}
