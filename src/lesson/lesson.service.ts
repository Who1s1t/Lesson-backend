import {Injectable, InternalServerErrorException} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Lesson} from "./entities/lesson.entity";
import {Repository} from "typeorm";
import {extname, join} from 'path';
import {Step} from "./entities/step.entity";
import {access, mkdir, writeFile} from 'fs';

@Injectable()
export class LessonService {
  constructor(
      @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
      @InjectRepository(Step) private stepRepository: Repository<Step>

  ) {
  }


  async create(createLessonDto: CreateLessonDto, files:  Array<Express.Multer.File>) {
    const newLesson = await this.lessonRepository.save({
      name: createLessonDto.name
    })
    const upload = join(__dirname, '..','..','/uploads/img/lesson')
    try {
    await access(upload,async err => {
      if (err) {
      await mkdir(upload,{ recursive: true },err => {
      if (err) {
        console.log(err)
      }
      });
    }
    });
    }catch (e){
      throw new InternalServerErrorException(`Ошибка создания папки`)
    }


    const splitText = createLessonDto.text.split("|..,,.,|")
    // await files.forEach((img,number) =>{
    //     this.stepRepository.save({
    //       number: number,
    //       text: splitText[number],
    //       image: img.originalname,
    //       lesson: newLesson
    //     })
    // })
    await Promise.all(files.map(async (img,number)=>{
      try {
        img.originalname = Array(10)
            .fill(null)
            .map(() => Math.round(Math.random() * 10).toString(10))
            .join('') + img.originalname;
      await this.stepRepository.save({
              number: number,
              text: splitText[number],
              image: img.originalname,
              lesson: newLesson
            })
      await writeFile(join(upload,img.originalname),img.buffer,err =>
      {   if (err)
      {    console.log(err)   }
      })

      }catch (e) {
     throw new InternalServerErrorException(`Ошибка сохранения шага ${number}`)
      }

    }))

    return newLesson;
  }

  findAll() {
    return `This action returns all lesson`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lesson`;
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return `This action updates a #${id} lesson`;
  }

  remove(id: number) {
    return `This action removes a #${id} lesson`;
  }
}
