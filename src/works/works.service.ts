import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Work } from './interfaces/work.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { S3 } from 'aws-sdk';

@Injectable()
export class WorksService {
  private s3: S3;
  configValue: string;

  constructor(@InjectModel('Work') private readonly workModel: Model<Work>, private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('secretAccessKey'),
    });
    this.configValue = this.configService.get('secretAccessKey');
  }

  async findAll(): Promise<Work[]> {
    return await this.workModel.find();
  }

  async findOne(id: string): Promise<Work> {
    return await this.workModel.findOne({ _id: id });
  }

  async create(work: Work): Promise<Work> {
    const newWork = new this.workModel(work);
    return await newWork.save();
  }

  async uploadFileToS3(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
    }
    const params = {
      Bucket: this.configService.get('s3BucketName'),
      Key: file.originalname,
      Body: file.buffer,
      ACL: this.configService.get('ACL'),
      ContentType: file.mimetype,
    };
    const image = (await this.s3.upload(params).promise()).Location;
    return image;
  }

  async delete(id: string): Promise<Work> {
    return await this.workModel.findByIdAndRemove(id);
  }

  async update(id: string, work: Work): Promise<Work> {
    return await this.workModel.findByIdAndUpdate(id, work, { new: true });
  }
}
