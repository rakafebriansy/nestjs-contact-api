import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { WebResponse } from '../../models/web.model';
import { AddressResponse, CreateAddressRequest } from '../../models/address.model';
import { Auth } from '../../common/auth/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/contacts/:contactId/addresses')
export class AddressController {
    constructor(
        private addressService: AddressService
    ) { }

    @Post()
    async create(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Body() request: CreateAddressRequest
    ): Promise<WebResponse<AddressResponse>> {
        request.contact_id = contactId;
        const result = await this.addressService.create(user, request);
        return {
            data: result
        };
    }
}
