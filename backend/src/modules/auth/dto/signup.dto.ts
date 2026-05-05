import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRoles } from '@prisma/client';

export class SignupDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsEnum(UserRoles)
    role?: UserRoles;
}
