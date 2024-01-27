import { Injectable } from '@nestjs/common';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'src/app/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.menuCreateInput) {
    const result = await this.prisma.menu.create({
      data,
    });
    return result;
  }

  async findAll(option?: Prisma.menuFindManyArgs) {
    const result = await this.prisma.menu.findMany(option);
    return result;
  }

  async findOne(id: number) {
    const result = await this.prisma.menu.findUnique({
      where: {
        id,
      },
    });
    return result;
  }

  async count() {
    return this.prisma.menu.count();
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    return updateMenuDto;
  }

  async remove(id: number) {
    const result = await this.prisma.menu.delete({
      where: {
        id,
      },
    });
    return result;
  }
}
