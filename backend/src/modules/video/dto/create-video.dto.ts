import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({
    type: 'string',
    description: 'Video title',
    required: true,
    example: 'Video Title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: 'string',
    description: 'Directory UUID',
    required: false,
    example: 'Video Description',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Video file',
  })
  @IsOptional()
  video: any;
}
