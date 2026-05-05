import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UserRoles } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    email: string
    name: string
    roles: UserRoles
}
