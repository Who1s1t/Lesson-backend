import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import * as argon2 from "argon2";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User) private userRepository:Repository<User>,
      private readonly jwtService:JwtService
  ) {
  }
  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      }
    })
    if(existUser) throw new BadRequestException('Пользователь с таким Email уже существует!')
    const user = await this.userRepository.save({
      firstName: createUserDto.firstName,
      surName:createUserDto.surName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      birthday: createUserDto.birthday,
      password: await argon2.hash(createUserDto.password),
      role: 'user',
    })
    const token = this.jwtService.sign({id: user.id, email: user.email,firstName: user.firstName,surName: user.surName, lastName: user.lastName,birthday: user.birthday, role: user.role });
    return {token}
  }
  async update(email:string, updateUserDto:UpdateUserDto) {
    const user = await this.findByEmail(email)
    if (!user) throw new NotFoundException("Пользователь не найден!")
    if (updateUserDto.password)  updateUserDto.password = await argon2.hash(updateUserDto.password)
    return await this.userRepository.update(user.id, updateUserDto);
  }




  async findByEmail(email: string) {
    const user =  await this.userRepository.findOne({
      where:{
        email
      }
    })
    return user
  }


}
