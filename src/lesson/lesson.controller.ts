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
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFiles,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Res,
  UseGuards, Req
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {ApiTags} from "@nestjs/swagger";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

@Controller('lesson')
@ApiTags('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
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
      files:   Array<Express.Multer.File>,@Req() req) {
    return this.lessonService.create(createLessonDto, files, +req.user.id);

  }

  @Get()
  findAll() {
    return this.lessonService.findAll();
  }

  @Get('public')
  findAllNotPublic() {
    return this.lessonService.findAllNotPublic();
  }

  @Get('not_public')
  findAllPublic() {
    return this.lessonService.findAllPublic();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(+id);
  }


  @Patch('update/:id')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto,@UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png)/}),
        ],
        fileIsRequired: false,
      }),
  )
      file: Express.Multer.File) {
    return this.lessonService.update(+id, updateLessonDto, file);
  }

  @Patch('change_public/:id')
  @UsePipes(new ValidationPipe())
  changePublic(@Param('id') id: string,) {
    return this.lessonService.changePublic(+id);
  }

  @Delete('remove/:id')
  removeLesson(@Param('id') id: string) {
    return this.lessonService.removeLesson(+id);
  }

  @Delete('remove/step/:id')
  removeStep(@Param('id') id: string) {
    return this.lessonService.removeStep(+id);
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
