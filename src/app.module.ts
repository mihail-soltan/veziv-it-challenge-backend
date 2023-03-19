import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WorksModule } from './works/works.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    WorksModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: 'MONGODB_URI',
    useValue: process.env.MONGODB_URI,
  }],
})
export class AppModule {}
