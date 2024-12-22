import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Video Streaming Platform')
  .setDescription('This is the collection of APIs.')
  .setVersion('0.0.1')
  .addBearerAuth()
  .build();
