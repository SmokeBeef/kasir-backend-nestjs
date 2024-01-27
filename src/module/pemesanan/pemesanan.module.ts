import { Module } from '@nestjs/common';
import { PemesananService } from './pemesanan.service';
import { PemesananController } from './pemesanan.controller';
import { PrismaService } from 'src/app/prisma.service';
import { MenuService } from '../menu/menu.service';

@Module({
  controllers: [PemesananController],
  providers: [PemesananService, PrismaService, MenuService],
})
export class PemesananModule {}
