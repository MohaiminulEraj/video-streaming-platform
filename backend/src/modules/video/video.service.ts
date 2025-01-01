import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import * as path from 'path';
import { existsSync, mkdirSync, write, writeFile, writeFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  private readonly logger = new Logger(VideoService.name);

  async create(
    userId: number,
    createVideoDto: CreateVideoDto,
    video: Express.Multer.File,
  ) {
    if (!video) {
      throw new HttpException('Video is required', HttpStatus.BAD_REQUEST);
    }
    if (video.size > 100000000) {
      throw new HttpException(
        'Video size should be less than 100MB',
        HttpStatus.BAD_REQUEST,
      );
    }
    const fileName = video.originalname.split('.').shift();
    const folderPath = `./uploads/${createVideoDto.title + '-' + userId}`;
    const filePath = `${folderPath}/${video.originalname}`;

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
    // try {
    //   // const inputPath = path.join(__dirname, '..', 'uploads', filePath);
    //   const outputPath = path.join(
    //     __dirname,
    //     '..',
    //     'uploads',
    //     `converted-${fileName}`,
    //   );
    //   const manifestPath = path.join(
    //     __dirname,
    //     '..',
    //     'uploads',
    //     `manifest-${fileName}.mpd`,
    //   );
    //   const execPromise = promisify(exec);
    //   // Execute the command.sh script
    //   await execPromise(
    //     `./command.sh ${fileName} ${outputPath} ${manifestPath}`,
    //   );
    // } catch (error) {
    //   console.log(error);
    // }
    await this.convertAndChunkVideo(folderPath, video.originalname);
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

  async convertAndChunkVideo(folderPath: string, fileOriginalName: string) {
    try {
      let outputPath = folderPath + '/' + fileOriginalName;
      // check if the file is mp4
      if (fileOriginalName.split('.').pop() !== 'mp4') {
        outputPath =
          folderPath + '/converted/' + `converted-${fileOriginalName}`;
        if (!existsSync(folderPath + '/converted')) {
          mkdirSync(folderPath + '/converted', { recursive: true });
        }

        // Convert video to H.264 format
        await new Promise((resolve, reject) => {
          ffmpeg(folderPath + '/' + fileOriginalName)
            .videoCodec('libx264')
            .audioCodec('aac')
            .addOption('-crf', '22')
            .addOption('-b:a', '128k')
            .on('start', (commandLine) => {
              this.logger.log(`Spawned FFmpeg with command: ${commandLine}`);
            })
            .on('progress', (progress) => {
              this.logger.log(`Processing: ${progress.percent}% done`);
            })
            .on('end', () => {
              this.logger.log('Video conversion finished');
              resolve(null);
            })
            .on('error', (err) => {
              this.logger.error(`Error: ${err.message}`);
              reject(err);
            })
            .save(outputPath);
        });
      }

      if (!existsSync(folderPath + '/converted-manifest')) {
        mkdirSync(folderPath + '/converted-manifest', { recursive: true });
      }

      const manifestPath = folderPath + '/converted-manifest/' + `manifest.mpd`;

      // Chunk the video using DASH
      await new Promise((resolve, reject) => {
        ffmpeg(outputPath);
        ffmpeg(folderPath + '/' + fileOriginalName)
          .format('dash')
          // Corrected way to add DASH options
          .addOption('-seg_duration', '4')
          .addOption('-use_template', '1')
          .addOption('-use_timeline', '1')
          .addOption('-init_seg_name', 'init.m4s')
          .addOption('-media_seg_name', 'chunk_$Number$.m4s')
          .on('start', (commandLine) => {
            this.logger.log(`Spawned FFmpeg with command: ${commandLine}`);
          })
          .on('progress', (progress) => {
            this.logger.log(`Chunking: ${progress.percent}% done`);
          })
          .on('end', () => {
            this.logger.log('Video chunking finished');
            resolve(null);
          })
          .on('error', (err) => {
            this.logger.error(`Error: ${err.message}`);
            reject(err);
          })
          .save(manifestPath);
      });

      await this.watermarkVideoChunk(
        folderPath,
        manifestPath,
        'eraj@gmail.com',
      );
    } catch (error) {
      console.log(error);
    }
  }

  // async watermarkVideoChunk(chunkPath: string, email: string): Promise<string> {
  async watermarkVideoChunk(
    folderPath: string,
    chunkPath: string,
    email: string,
  ): Promise<string> {
    if (!existsSync(folderPath + '/watermarked')) {
      mkdirSync(folderPath + '/watermarked', { recursive: true });
    }
    const watermarkedPath = folderPath + '/watermarked/' + `watermarked.m4s`;

    try {
      await new Promise((resolve, reject) => {
        ffmpeg(chunkPath)
          // Corrected way to add video filter
          .videoFilters({
            filter: 'drawtext',
            options: {
              text: email,
              fontcolor: 'white',
              fontsize: '24',
              x: 'w*mod(n,30)/30', // This will make the text move horizontally
              y: 'h*mod(n,20)/20', // This will make the text move vertically
            },
          })
          .on('start', (commandLine) => {
            this.logger.log(`Spawned FFmpeg with command: ${commandLine}`);
          })
          .on('progress', (progress) => {
            this.logger.log(`Watermarking: ${progress.percent}% done`);
          })
          .on('end', () => {
            this.logger.log('Watermarking finished');
            resolve(null);
          })
          .on('error', (err) => {
            this.logger.error(`Error: ${err.message}`);
            reject(err);
          })
          .save(watermarkedPath);
      });

      return watermarkedPath;
    } catch (error) {
      this.logger.error(`Failed to watermark video chunk: ${error.message}`);
      throw error;
    }
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
