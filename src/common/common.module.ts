import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { PrismaService } from './prisma/prisma.service';
import { ValidationService } from './validation/validation.service';
import * as winston from 'winston';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error/error.filter';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        WinstonModule.forRoot({
            format: winston.format.combine(
                winston.format.timestamp(),
                nestWinstonModuleUtilities.format.nestLike()
            ),
            transports: [
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    )
                }),
                new winston.transports.File({
                    filename: 'logs/combined.log',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    )
                }),
            ]
        })],
    providers: [PrismaService, ValidationService, {
        provide: APP_FILTER,
        useClass: ErrorFilter
    }],
    exports: [PrismaService, ValidationService],
})

export class CommonModule { }
