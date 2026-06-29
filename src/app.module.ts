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
    MongooseModule.forRoot(process.env.MONGO_URI!,{dbName:process.env.MONGO_DB_NAME}), //conexion bd mongo
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { MongooseModule } from '@nestjs/mongoose';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),

//     MongooseModule.forRootAsync({
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => {
//         console.log('MONGO_URI:', config.get<string>('MONGO_URI'));
//         console.log('MONGO_DB_NAME:', config.get<string>('MONGO_DB_NAME'));

//         return {
//           uri: config.get<string>('MONGO_URI'),
//           dbName: config.get<string>('MONGO_DB_NAME'),
//         };
//       },
//     }),

//     AuthModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
