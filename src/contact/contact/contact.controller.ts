import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { create } from 'domain';
import { Auth } from '../../common/auth/auth.decorator';
import { User } from '@prisma/client';
import { ContactResponse, CreateContactRequest } from '../../models/contact.model';
import { WebResponse } from '../../models/web.model';

@Controller('/api/contacts')
export class ContactController {
    constructor(
        private contactService: ContactService,
    ) {
    }

    @Post()
    async create(@Auth() user: User, @Body() request: CreateContactRequest): Promise<WebResponse<ContactResponse>> {
        const result = await this.contactService.create(user, request);

        return {
            data: result
        };
    }

    @Get('/:contactId')
    @HttpCode(200)
    async get(@Auth() user: User, @Param('contactId', ParseIntPipe) contactId: number): Promise<WebResponse<ContactResponse>> {
        const result = await this.contactService.get(user, contactId);

        return {
            data: result
        };
    }
}
