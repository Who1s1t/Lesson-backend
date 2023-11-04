import {IsEmail, IsInt, IsNotEmpty, IsString, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @IsString()
    @ApiProperty()
    firstName:string

    @IsString()
    @ApiProperty()
    surName: string


    @IsString()
    @ApiProperty()
    lastName: string

    @IsString()
    @ApiProperty()
    birthday: string

    @IsEmail()
    @ApiProperty()
    email: string

    @MinLength(8, {message: "Пароль не может быть короче 8 символов!"})
    @ApiProperty()
    password: string

}