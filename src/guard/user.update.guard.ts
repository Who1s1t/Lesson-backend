import {CanActivate, ExecutionContext, Injectable, NotFoundException} from "@nestjs/common";
import {LessonService} from "../lesson/lesson.service";
import {UserService} from "../user/user.service";

@Injectable()
export class UserUpdateGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
    ) {
    }
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const user = await this.userService.findByEmail(request.params.email)
        if (!user) throw new NotFoundException("Пользователь не найден!")
        return request.user.email == user.email ||
            request.user.role == ("admin");


    }

}