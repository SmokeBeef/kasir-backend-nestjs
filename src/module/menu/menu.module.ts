import { Module, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { PrismaService } from 'src/app/prisma.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  controllers: [MenuController],
  providers: [MenuService, PrismaService, AuthGuard],
})
@UseGuards(AuthGuard)
export class MenuModule {}
