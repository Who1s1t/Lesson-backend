import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class CreateLessonDto {
    @IsString()
    @ApiProperty()
    name:string

    @IsString()
    @ApiProperty()
    text: string


}
