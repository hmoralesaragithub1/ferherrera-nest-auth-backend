import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /*Habilitamos CORS*/
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const PORT = process.env.PORT ?? 3000;
  console.log(`App corriendo en el puerto ${PORT}`);
  console.log('process.env.MONGO_URI', process.env.MONGO_URI);
  console.log('process.env.MONGO_DB_NAME', process.env.MONGO_DB_NAME);
  await app.listen(PORT);
}
bootstrap();
