import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AccessControlGuard } from 'src/common/guards/access-control.guard';
import { AllowedUserTypes } from 'src/common/decorators/allowed-user-types.decorator';
import { UserTypes } from '../users/data/user-type.enum';
import { RequiredVerifications } from 'src/common/decorators/verifications.decorator';
import { RequiredVerificationsEnum } from '../auth/data/required-verifications.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { VerifiedUserGuard } from 'src/common/guards/verified-user.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('🌏 🔒 Video API')
@UseGuards(ThrottlerGuard)
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, VerifiedUserGuard, AccessControlGuard)
  @AllowedUserTypes(UserTypes.SUPERADMIN, UserTypes.USER)
  @RequiredVerifications(RequiredVerificationsEnum.EMAIL)
  @ApiOperation({ summary: 'Uploading a Video' })
  @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
  @ApiResponse({
    description: 'Something went wrong',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    description: 'Video uploaded successfully',
    status: HttpStatus.CREATED,
  })
  @UseInterceptors(FileInterceptor('video'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Request() req,
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFile() video: Express.Multer.File,
  ) {
    return {
      status: HttpStatus.CREATED,
      message: 'Video Uploaded Successfully',
      result: await this.videoService.create(
        +req.user.id,
        createVideoDto,
        video,
      ),
    };
  }

  @Get()
  findAll() {
    return this.videoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}
