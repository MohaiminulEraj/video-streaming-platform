import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestMinioOptions } from 'nestjs-minio';

export const minioConfig: any = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<NestMinioOptions> => {
    return {
      endPoint: configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(configService.get<string>('MINIO_PORT', '9000')),
      useSSL: configService.get<string>('MINIO_SSL', 'true') === 'true',
      accessKey: configService.get<string>('MINIO_ACCESS_KEY', ''),
      secretKey: configService.get<string>('MINIO_SECRET_KEY', ''),
      region: configService.get<string>('MINIO_REGION', ''),
    };
  },
};
