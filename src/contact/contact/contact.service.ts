import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Contact, User } from '@prisma/client';
import { ContactResponse, CreateContactRequest, UpdateContactRequest } from '../../models/contact.model';
import { ValidationService } from '../../common/validation/validation.service';
import { ContactValidation } from './contact.validation';

@Injectable()
export class ContactService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private validationService: ValidationService
    ) { }

    toContactResponse(contact: Contact): ContactResponse {
        return {
            id: contact.id,
            first_name: contact.first_name,
            last_name: contact.last_name ?? undefined,
            email: contact.email ?? undefined,
            phone: contact.phone ?? undefined,
        }
    }

    async checkContactMustExists(username: string, contactId: number): Promise<Contact> {
        const contact = await this.prismaService.contact.findFirst({
            where: {
                username: username,
                id: contactId
            },
        });

        if (!contact) {
            throw new HttpException('Contact is not found', 404);
        }
        
        return contact;
    }

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

        return this.toContactResponse(contact);
    }

    async get(user: User, contactId: number): Promise<ContactResponse> {
        const contact = await this.checkContactMustExists(user.username, contactId);

        return this.toContactResponse(contact);
    }

    async update(user: User, request: UpdateContactRequest): Promise<ContactResponse> {
        this.logger.debug(`ContactService.update(${JSON.stringify(user)}, ${JSON.stringify(request)})`);
        const validateRequest: UpdateContactRequest = this.validationService.validate(
            ContactValidation.UPDATE,
            request
        );

        let contact = await this.checkContactMustExists(user.username, validateRequest.id);

        contact = await this.prismaService.contact.update({
            where: {
                id: contact.id,
                username: contact.username
            },
            data: validateRequest
        });

        return this.toContactResponse(contact);
    }

    async remove(user: User, contactId: number): Promise<ContactResponse> {
        await this.checkContactMustExists(user.username, contactId);

        const contact = await this.prismaService.contact.delete({
            where: {
                id: contactId,
                username: user.username
            }
        });

        return this.toContactResponse(contact);
    }
}
