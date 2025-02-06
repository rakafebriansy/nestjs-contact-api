import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ValidationService } from '../../common/validation/validation.service';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { LoginUserRequest, RegisterUserRequest, UserResponse } from '../../models/user.model';
import {v4 as uuid} from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) { }

    async register(request: RegisterUserRequest): Promise<UserResponse> {
        this.logger.info(`UserService.register(${JSON.stringify(request)})`);
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

    async login(request: LoginUserRequest): Promise<UserResponse> {
        this.logger.info(`UserService.login(${JSON.stringify(request)})`);
        const validatedRequest: LoginUserRequest = this.validationService.validate(
            UserValidation.LOGIN,
            request
        );
        let user = await this.prismaService.user.findUnique({
            where: {
                username: validatedRequest.username
            }
        });

        if(!user) {
            throw new HttpException('Username or password is wrong', 401);
        }
        
        const isPasswordValid = await bcrypt.compare(validatedRequest.password, user.password);
        
        if(!isPasswordValid) {
            throw new HttpException('Username or password is wrong', 401);
        }

        user = await this.prismaService.user.update({
            where: {
                username: validatedRequest.username
            },
            data: {
                token: uuid()
            }
        });

        return {
            username: user.username,
            name: user.name,
            token: user.token!
        };
    }

    async get(user: User): Promise<UserResponse> {
        return {
            username: user.username,
            name: user.name,
        };
    }
}
