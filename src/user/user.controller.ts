import {Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiTags} from "@nestjs/swagger";

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService,
                      ) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('update/:email')
  @UsePipes(new ValidationPipe())
  update(@Param('email') email: string,@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(email,updateUserDto);
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
}
