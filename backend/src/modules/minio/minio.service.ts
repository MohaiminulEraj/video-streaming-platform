import { Injectable } from '@nestjs/common';
import { InjectMinio } from 'nestjs-minio';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private MINIO_BUCKET: string;
  private MINIO_FILE_EXPIRATION_TIME: number;

  constructor(
    private readonly configService: ConfigService,
    @InjectMinio() private readonly minioClient: Client,
  ) {
    this.MINIO_BUCKET = this.configService.get<string>(
      'MINIO_BUCKET',
      'video-streaming',
    );
    this.MINIO_FILE_EXPIRATION_TIME = parseInt(
      this.configService.get('MINIO_FILE_EXPIRATION_TIME', '300'),
    );
  }

  public async uploadStreamableFile(objectName: string, file: Buffer) {
    return await this.minioClient.putObject(
      this.MINIO_BUCKET,
      objectName,
      file,
    );
  }

  public async uploadStaticFile(objectName: string, filePath: string) {
    return await this.minioClient.fPutObject(
      this.MINIO_BUCKET,
      objectName,
      filePath,
    );
  }

  public async getPresignedURL(objectName: string) {
    const url = await this.minioClient.presignedGetObject(
      this.MINIO_BUCKET,
      objectName,
      this.MINIO_FILE_EXPIRATION_TIME,
    );
    console.log(url);
    return url;
  }

  public async removeFile(objectName: string) {
    return await this.minioClient.removeObject(this.MINIO_BUCKET, objectName);
  }
}
