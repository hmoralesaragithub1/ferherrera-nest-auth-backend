import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(), // para acceder a variables de entorno
    //MongooseModule.forRoot(process.env.MONGO_URI!,{dbName:process.env.MONGO_DB_NAME}), //conexion bd mongo
    MongooseModule.forRoot('mongodb://localhost:27017/test')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
