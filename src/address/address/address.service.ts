import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ValidationService } from '../../common/validation/validation.service';
import { Address, User } from '@prisma/client';
import { AddressResponse, CreateAddressRequest } from '../../models/address.model';
import { AddressValidation } from './address.validation';
import { ContactService } from '../../contact/contact/contact.service';

@Injectable()
export class AddressService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private validationService: ValidationService,
        private contactService: ContactService
    ) { }

    async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
        this.logger.debug(`AddressService.create(${JSON.stringify(user)}, ${JSON.stringify(request)})`);
        const validatedRequest: CreateAddressRequest = this.validationService.validate(
            AddressValidation.CREATE,
            request
        );

        await this.contactService.checkContactMustExists(user.username, validatedRequest.contact_id);

        const address: Address = await this.prismaService.address.create({
            data: validatedRequest
        });

        return {
            id: address.id,
            street: address.street ?? undefined,
            city: address.city ?? undefined,
            province: address.province ?? undefined,
            country: address.country,
            postal_code: address.postal_code,
        }
    }
}
