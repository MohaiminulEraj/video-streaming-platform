import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { NestMinioModule } from 'nestjs-minio';
import { minioConfig } from 'src/config/minio.config';

@Module({
  imports: [NestMinioModule.registerAsync(minioConfig)],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
