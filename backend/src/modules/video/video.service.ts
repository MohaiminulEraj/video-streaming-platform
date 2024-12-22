import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import * as path from 'path';
import { existsSync, mkdirSync, write, writeFile, writeFileSync } from 'fs';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  async create(
    userId: number,
    createVideoDto: CreateVideoDto,
    video: Express.Multer.File,
  ) {
    if (!video) {
      throw new HttpException('Video is required', HttpStatus.BAD_REQUEST);
    }
    if (video.size > 10000000) {
      throw new HttpException(
        'Video size should be less than 10MB',
        HttpStatus.BAD_REQUEST,
      );
    }
    const fileName = video.originalname.split('.').shift();
    const filePath = `./uploads/${createVideoDto.title + '-' + userId}/${video.originalname}`;

    try {
      const directory = path?.dirname(filePath);
      if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true });
      }

      writeFileSync(filePath, video.buffer);
    } catch (error) {
      throw new HttpException(
        `Error while saving ${fileName} video`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newVideo = new Video();
    newVideo.title = createVideoDto.title;
    newVideo.description = createVideoDto.description;
    newVideo.fileOriginalName = fileName;
    newVideo.mimeType = video.mimetype;
    newVideo.rawFileSizeMB = video.size / 1024 / 1024;
    newVideo.userId = userId;
    newVideo.format = video.originalname.split('.').pop();
    newVideo.serverUrl = filePath;
    return await this.videoRepository.save(newVideo);
  }

  findAll() {
    return `This action returns all video`;
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
