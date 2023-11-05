import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {ConfigModule} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";


@Module({
  imports: [TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '90d'}

    })],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
