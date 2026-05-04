import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, role } = createUserDto;

    return this.prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: id
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        name: "1"
      }
    });
  }

  async remove(id: number) {
    return await this.prisma.book.delete({
      where: {
        id: id,
      }
    });
  }
}
