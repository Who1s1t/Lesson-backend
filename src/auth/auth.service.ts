import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as argon2 from "argon2";
import {JwtService} from "@nestjs/jwt";
import {IUser} from "../types/user.types";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtService
                ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        const passwordIsMatch = await argon2.verify(user.password, password);
        if (user && passwordIsMatch) {
            return user;
        }

        throw new UnauthorizedException("Неверный Email или пароль!")
    }
    async login(user: IUser) {
        const payload = {id: user.id, email: user.email,firstName: user.firstName,surName: user.surName, lastName: user.lastName,birthday: user.birthday, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
