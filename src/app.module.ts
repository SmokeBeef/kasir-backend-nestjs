import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './module/users/users.module';
import { PemesananModule } from './module/pemesanan/pemesanan.module';
import { AuthModule } from './module/auth/auth.module';
import { MenuModule } from './module/menu/menu.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PemesananModule,
    AuthModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
