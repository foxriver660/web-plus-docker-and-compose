import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserPublicProfileResponseDto } from '../users/dto/response-dto/user-public-profile.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class OwnerInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<UserPublicProfileResponseDto>> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const { email, ...user } = await this.usersService.findByIdOrName(
      userId,
      'id',
    );
    request.user = user;

    return next.handle();
  }
}
