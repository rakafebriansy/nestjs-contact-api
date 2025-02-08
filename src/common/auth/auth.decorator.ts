import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { User } from '@prisma/client';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: any = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (user) {
      return user;
    } else {
      throw new HttpException('Unauthorized', 401);
    }
  },
);
