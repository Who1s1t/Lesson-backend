import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {LessonService} from "../lesson/lesson.service";

@Injectable()
export class AuthorGuard implements CanActivate {
    constructor(
        private readonly lessonService: LessonService,
    ) {
    }
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        return request.user.id == (await this.lessonService.findOne(request.params.id)).user.id ||
            request.user.role == ("moder") ||
            request.user.role == ("admin");


    }

}