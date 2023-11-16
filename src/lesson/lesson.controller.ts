import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFiles, UsePipes, ValidationPipe, HttpStatus, Res
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {ApiTags} from "@nestjs/swagger";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";

@Controller('lesson')
@ApiTags('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post("create")
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor('files'))
  create(@Body() createLessonDto: CreateLessonDto,@UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png)/}),
        ],
      }),
  )
      files:   Array<Express.Multer.File>) {
    return this.lessonService.create(createLessonDto, files);

  }

  @Get()
  findAll() {
    return this.lessonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.update(+id, updateLessonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonService.remove(+id);
  }
  @Get('img/:imagename')
  getImage(@Param('imagename') image: string, @Res() res) {
    const response = res.sendFile(image, { root: './uploads/img/lesson' });
    return {
      status: HttpStatus.OK,
      data: response,
    };
  }
}
