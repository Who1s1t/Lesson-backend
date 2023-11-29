import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Lesson} from "./entities/lesson.entity";
import {Repository} from "typeorm";
import {extname, join} from 'path';
import {Step} from "./entities/step.entity";
import {access, mkdir, writeFile} from 'fs';
import {User} from "../user/entities/user.entity";

@Injectable()
export class LessonService {
  constructor(
      @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
      @InjectRepository(Step) private stepRepository: Repository<Step>,
      @InjectRepository(User) private userRepository: Repository<User>

  ) {
  }


  async create(createLessonDto: CreateLessonDto, files:  Array<Express.Multer.File>,id) {
    const newLesson = await this.lessonRepository.save({
      name: createLessonDto.name,
      user: id,
      public: false

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

  async findAll() {
    return await this.lessonRepository.find({
      relations:{
        steps: true
      }
    }) ;
  }

  async findOne(id: number) {
    const lesson = await this.lessonRepository.findOne({
      where:{
        id
      },
      relations:{
        steps: true
      }
    })
    if (!lesson) throw new NotFoundException("Урок не найден!")
    return lesson;
  }

  async update(id: number, updateLessonDto: UpdateLessonDto, file) {
    const lesson = await this.lessonRepository.findOne({
      where:{
        id
      },
      relations:{
        steps: true
      }
    })
    if (!lesson) throw new NotFoundException("Урок не найден!");
    if (updateLessonDto.name) lesson.name = updateLessonDto.name;
    if (updateLessonDto.number && lesson.steps.slice(-1)[0].number >= updateLessonDto.number){
      if (file){
            file.originalname = Array(10)
                .fill(null)
                .map(() => Math.round(Math.random() * 10).toString(10))
                .join('') + file.originalname;
            const upload = join(__dirname, '..','..','/uploads/img/lesson')
            lesson.steps[updateLessonDto.number].image = file.originalname
            await writeFile(join(upload,file.originalname),file.buffer,err =>
            {   if (err)
            {    console.log(err)   }
            })
      }
      if (updateLessonDto.text){
        lesson.steps[updateLessonDto.number].text = updateLessonDto.text
      }

    }
    await this.lessonRepository.save(lesson)
    return lesson;
  }


  async changePublic(id:number){
    const lesson = await this.lessonRepository.findOne({
      where:{
        id
      }
    })
    if (!lesson) throw new NotFoundException("Урок не найден!");
    lesson.public = !lesson.public
    await this.lessonRepository.update(id, lesson)
    return lesson

  }

  async removeLesson(id: number) {
    const lesson = await this.lessonRepository.findOne({
      where:{
        id
      }
    })
    if (!lesson) throw new NotFoundException("Урок не найден!");
    return await this.lessonRepository.remove(lesson);
  }

  async removeStep(id: number) {
    const step = await this.stepRepository.findOne({
      where:{
        id
      }
    })
    if (!step) throw new NotFoundException("Шаг не найден!");
    return await this.stepRepository.remove(step);
  }
}
