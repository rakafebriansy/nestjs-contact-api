import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ValidationService } from '../../common/validation/validation.service';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { RegisterUserRequest, UserResponse } from '../../models/user.model';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) { }

    async register(request: RegisterUserRequest): Promise<UserResponse> {
        this.logger.info(`Register new user ${JSON.stringify(request)}`);
        const validatedRequest: RegisterUserRequest = this.validationService.validate(
            UserValidation.REGISTER, 
            request
        );
        const usersWithDuplicateUsernameCount = await this.prismaService.user.count({
            where: {
                username: validatedRequest.username
            }
        });

        if(usersWithDuplicateUsernameCount != 0) {
            throw new HttpException('Username is already exists', 400);
        }

        validatedRequest.password = await bcrypt.hash(validatedRequest.password, 10);
        const user = await this.prismaService.user.create({
            data: validatedRequest
        });

        return {
            username: user.username,
            name: user.name
        };
    }
}
