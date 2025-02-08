import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: Request, res: Request, next: () => void) {
    const token: string | undefined = req.headers['authorization'] as string;
    if (token) {
      const user: User | null = await this.prismaService.user.findFirst({
        where: {
          token: token,
        },
      });

      if (user) {
        (req as any).user = user;
      }
    }

    next();
  }
}
