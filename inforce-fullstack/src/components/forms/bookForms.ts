export type BookFormState = {
    name: string;
    author: string;
    pageCount: string;
};

export const EMPTY_BOOK_FORM: BookFormState = {
    name: "",
    author: "",
    pageCount: "",
};
