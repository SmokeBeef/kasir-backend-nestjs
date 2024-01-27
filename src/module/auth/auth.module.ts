import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PrismaService } from 'src/app/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import config from 'utils/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: config.jwt.secretKey,
      signOptions: { expiresIn: config.jwt.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [PrismaService, JwtService],
})
export class AuthModule {}
