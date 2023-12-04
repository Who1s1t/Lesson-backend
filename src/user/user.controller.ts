import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UserUpdateGuard} from "../guard/user.update.guard";

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
  @UseGuards(JwtAuthGuard,UserUpdateGuard)
  @UsePipes(new ValidationPipe())
  update(@Param('email') email: string,@Body() updateUserDto: UpdateUserDto,@Req() req) {
    return this.userService.update(email,updateUserDto, req.user.role);
  }

  @Get(':email')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
}
