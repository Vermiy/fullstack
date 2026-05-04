import { UserRoles } from "generated/prisma/enums"

export class CreateUserDto {
    name: string
    password: string
    email: string
    role: UserRoles
};
