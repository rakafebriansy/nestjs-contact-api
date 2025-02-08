import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ValidationService } from '../../common/validation/validation.service';
import { Address, User } from '@prisma/client';
import { AddressResponse, CreateAddressRequest, GetAddressRequest, RemoveAddressRequest, UpdateAddressRequest } from '../../models/address.model';
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

    toAddressResponse(address: Address): AddressResponse {
        return {
            id: address.id,
            street: address.street ?? undefined,
            city: address.city ?? undefined,
            province: address.province ?? undefined,
            country: address.country,
            postal_code: address.postal_code,
        }
    }

    async checkAddressMustExists(contactId:number, addressId: number): Promise<Address> {
        const address: Address | null = await this.prismaService.address.findFirst({
            where: {
                id: addressId,
                contact_id: contactId,
            }
        });

        if (!address) {
            throw new HttpException('Address is not found.', 404);
        }

        return address;
    }

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

        return this.toAddressResponse(address);
    }

    async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
        const validatedRequest: GetAddressRequest = this.validationService.validate(
            AddressValidation.GET,
            request
        );

        await this.contactService.checkContactMustExists(user.username, validatedRequest.contact_id);

        const address = await this.checkAddressMustExists(validatedRequest.contact_id, validatedRequest.address_id);

        return this.toAddressResponse(address);
    }

    async update(user: User, request: UpdateAddressRequest): Promise<AddressResponse> {
        const validatedRequest: UpdateAddressRequest = this.validationService.validate(
            AddressValidation.UPDATE,
            request
        );

        await this.contactService.checkContactMustExists(user.username, validatedRequest.contact_id);

        let address = await this.checkAddressMustExists(validatedRequest.contact_id, validatedRequest.id);

        address = await this.prismaService.address.update({
            where: {
                id: address.id,
                contact_id: address.contact_id
            },
            data: validatedRequest
        });

        return this.toAddressResponse(address);
    }

    async remove(user: User, request: RemoveAddressRequest): Promise<AddressResponse> {
        const validatedRequest: RemoveAddressRequest = this.validationService.validate(
            AddressValidation.REMOVE,
            request
        );

        await this.contactService.checkContactMustExists(user.username, validatedRequest.contact_id);

        await this.checkAddressMustExists(validatedRequest.contact_id, validatedRequest.address_id);

        const address = await this.prismaService.address.delete({
            where: {
                id: validatedRequest.address_id,
                contact_id: validatedRequest.contact_id
            }
        });

        return this.toAddressResponse(address);
    }
}
