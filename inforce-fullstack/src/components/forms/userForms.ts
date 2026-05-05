import { IUserRole } from "@/src/types/UserRoles";

export type EditUserFormState = {
  name: string;
  email: string;
  role: IUserRole | null;
};

export type CreateUserFormState = {
  name: string;
  email: string;
  password: string;
};

export const EMPTY_EDIT_USER_FORM: EditUserFormState = {
  name: "",
  email: "",
  role: null,
};

export const EMPTY_CREATE_USER_FORM: CreateUserFormState = {
  name: "",
  email: "",
  password: "",
};
