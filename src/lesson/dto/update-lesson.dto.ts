import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateLessonDto } from './create-lesson.dto';
import {IsNotEmpty, IsNumber} from "class-validator";

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
    @ApiProperty()
    number: number


}
