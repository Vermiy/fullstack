import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createBookDto: CreateBookDto) {
    const { author, name, pageCount } = createBookDto;

    return await this.prisma.book.create({
      data: {
        name,
        author,
        pageCount,
      }
    });
  }

  async findAll() {
    return await this.prisma.book.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.book.findUnique({
      where: {
        id: id
      }
    });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    return await this.prisma.book.update({
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
