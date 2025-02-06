import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../../common/prisma/prisma.service';
import { User } from '@prisma/client';
import { ContactResponse, CreateContactRequest } from '../../models/contact.model';
import { ValidationService } from '../../common/validation/validation.service';
import { ContactValidation } from './contact.validation';

@Injectable()
export class ContactService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private validationService: ValidationService
    ) { }

    async create(user: User, request: CreateContactRequest): Promise<ContactResponse> {
        this.logger.debug(`ContactService.create(${JSON.stringify(user)}, ${JSON.stringify(request)})`);
        const validateRequest: CreateContactRequest = this.validationService.validate(
            ContactValidation.CREATE,
            request
        );

        const contact = await this.prismaService.contact.create({
            data: {
                ...validateRequest,
                ...{ username: user.username }
            },
        });

        return {
            id: contact.id,
            first_name: contact.first_name,
            last_name: contact.last_name ?? undefined,
            email: contact.email ?? undefined,
            phone: contact.phone ?? undefined,
        }

    }
}
