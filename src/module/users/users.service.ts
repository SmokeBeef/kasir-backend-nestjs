import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/app/prisma.service';
import { Prisma, user } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.userCreateInput): Promise<user> {
    const result = await this.prisma.user.create({ data });
    return result;
  }

  async findAll(where?: Prisma.userFindFirstArgs): Promise<user[]> {
    const result = await this.prisma.user.findMany(where);
    return result;
  }

  async findByUsername(username: string): Promise<user> {
    const result = this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    return result;
  }

  async findOne(id: number) {
    const result = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return result;
  }

  async count() {
    return await this.prisma.user.count();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async delete(id: number) {
    const result = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return result;
  }
}
