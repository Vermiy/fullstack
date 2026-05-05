import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  private readonly publicUserSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
  };

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, role } = createUserDto;

    return this.prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
      select: this.publicUserSelect,
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: this.publicUserSelect,
    });
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: id
      },
      select: this.publicUserSelect,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { name, email } = updateUserDto;

    return await this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        name: name,
        email: email,
      },
      select: this.publicUserSelect,
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
      where: {
        id: id,
      },
      select: this.publicUserSelect,
    });
  }
}
