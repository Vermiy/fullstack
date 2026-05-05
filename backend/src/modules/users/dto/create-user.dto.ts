import { UserRoles } from '@prisma/client';

export class CreateUserDto {
    name: string
    password: string
    email: string
    role: UserRoles
};
