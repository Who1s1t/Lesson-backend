import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Lesson} from "./entities/lesson.entity";
import {Step} from "./entities/step.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Lesson,Step])],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
