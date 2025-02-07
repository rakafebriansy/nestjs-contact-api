import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { create } from 'domain';
import { Auth } from '../../common/auth/auth.decorator';
import { User } from '@prisma/client';
import { ContactResponse, CreateContactRequest, SearchContactRequest, UpdateContactRequest } from '../../models/contact.model';
import { WebResponse } from '../../models/web.model';

@Controller('/api/contacts')
export class ContactController {
    constructor(
        private contactService: ContactService,
    ) {
    }

    @Post()
    async create(
        @Auth() user: User,
        @Body() request: CreateContactRequest
    ): Promise<WebResponse<ContactResponse>> {
        const result = await this.contactService.create(user, request);

        return {
            data: result
        };
    }

    @Get('/:contactId')
    @HttpCode(200)
    async get(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number
    ): Promise<WebResponse<ContactResponse>> {
        const result = await this.contactService.get(user, contactId);

        return {
            data: result
        };
    }

    @Put('/:contactId')
    async update(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Body() request: UpdateContactRequest
    ): Promise<WebResponse<ContactResponse>> {

        request.id = contactId;
        const result = await this.contactService.update(user, request);

        return {
            data: result
        };
    }

    @Delete('/:contactId')
    @HttpCode(200)
    async remove(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number
    ): Promise<WebResponse<boolean>> {
        await this.contactService.remove(user, contactId);

        return {
            data: true
        };
    }

    @Get('')
    @HttpCode(200)
    async search(
        @Auth() user: User,
        @Query('name') name?: string,
        @Query('email') email?: string,
        @Query('phone') phone?: string,
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('per_page', new ParseIntPipe({ optional: true })) per_page?: number
    ): Promise<WebResponse<ContactResponse[]>> {
        const request: SearchContactRequest = {
            name, email, phone, page: page || 1, per_page: per_page || 1
        }

        return this.contactService.search(user, request);
    }
}
