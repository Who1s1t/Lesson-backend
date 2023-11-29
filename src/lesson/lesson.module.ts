import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Lesson} from "./entities/lesson.entity";
import {Step} from "./entities/step.entity";
import {User} from "../user/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Lesson,Step,User])],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
