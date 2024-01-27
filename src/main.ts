import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import config from 'utils/config';

async function bootstrap() {
  const port: string | number = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  initializeApp(config.firebaseConfig);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ credentials: true });
  await app.listen(port, () => console.log('app running in port ' + port));
}
bootstrap();
