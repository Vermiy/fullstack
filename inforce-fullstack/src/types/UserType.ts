import { IUserRole } from "./UserRoles";

export interface IUser {
  id: number;
  name: string;
  email: string;
  roles: IUserRole[];
}
