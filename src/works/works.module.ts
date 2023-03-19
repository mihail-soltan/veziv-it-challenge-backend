import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorksController } from './works.controller';
import { WorksService } from './works.service';
import { WorkSchema } from './schemas/work.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Work', schema: WorkSchema }])],
  controllers: [WorksController],
  providers: [WorksService],
})
export class WorksModule {}
