import { Injectable } from '@nestjs/common';
import { CreatePemesananDto } from './dto/create-pemesanan.dto';
import { UpdatePemesananDto } from './dto/update-pemesanan.dto';
import { PrismaService } from 'src/app/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PemesananService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreatePemesananDto) {
    const result = await this.prisma.pemesanan.create({
      data: {
        ...data,
        detailPemesanan: {
          createMany: {
            data: data.detailPemesanan,
          },
        },
      },
    });
    return result;
  }

  async count() {
    return await this.prisma.pemesanan.count();
  }

  async findAll(option?: Prisma.pemesananFindManyArgs) {
    const result = await this.prisma.pemesanan.findMany({
      ...option,
      include: {
        detailPemesanan: true,
      },
    });
    return result;
  }

  async findOne(id: number) {
    return await this.prisma.pemesanan.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        detailPemesanan: {
          include: {
            menu: true,
          },
        },
      },
    });
  }

  async update(id: number, updatePemesananDto: UpdatePemesananDto) {
    return updatePemesananDto;
  }

  async remove(id: number) {
    return `This action removes a #${id} pemesanan`;
  }
}
