import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateWorkDto } from './dto/create-work.dto';
import { WorksService } from './works.service';
import { Work } from './interfaces/work.interface';

@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Get()
  async findAll(): Promise<Work[]> {
    return this.worksService.findAll();
  }

  @Get('visible')
  async findVisible(): Promise<Work[]> {
    return this.worksService.findVisible();
  }
  //   @Get(':id')
  //   findOne(@Param() param) {
  //     return `Get work ${param.id}`;
  //   }

  // Same as above, but using destructuring
  @Get(':id')
  findOne(@Param('id') id): Promise<Work> {
    return this.worksService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createWorkDto: CreateWorkDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Work> {
    const url = await this.worksService.uploadFileToS3(file);
    const work = await this.worksService.create({
      ...createWorkDto,
      image: url,
    });
    return work;
  }

  @Delete(':id')
  delete(@Param('id') id): Promise<Work> {
    return this.worksService.delete(id);
  }

  @Put(':id')
  update(@Body() updateWorkDto: CreateWorkDto, @Param('id') id): Promise<Work> {
    return this.worksService.update(id, updateWorkDto);
  }
}
