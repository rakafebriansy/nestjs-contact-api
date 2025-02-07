import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { Address, Contact } from "@prisma/client";

@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) { }

    async deleteUser(): Promise<void> {
        await this.prismaService.user.deleteMany({
            where: {
                username: 'test'
            }
        });
    }

    async createUser(): Promise<void> {
        await this.prismaService.user.create({
            data: {
                username: 'test',
                name: 'test',
                password: await bcrypt.hash('test', 10),
                token: 'test',
            }
        });
    }

    async createContact(): Promise<void> {
        await this.prismaService.contact.create({
            data: {
                first_name: 'test',
                last_name: 'test',
                email: 'test@example.com',
                phone: '9999',
                username: 'test',
            }
        });
    }

    async deleteContact(): Promise<void> {
        await this.prismaService.contact.deleteMany({
            where: {
                username: 'test'
            }
        });
    }

    async getContact(): Promise<Contact | null> {
        return await this.prismaService.contact.findFirst({
            where: {
                username: 'test'
            }
        });
    }

    async createAddress(): Promise<void> {
        const contact: Contact | null = await this.getContact();
        await this.prismaService.address.create({
            data: {
                contact_id: contact!.id,
                street: 'test street',
                city: 'test city',
                province: 'test province',
                country: 'test country',
                postal_code: '1111',
            }
        });
    }

    async getAddress(): Promise<Address | null> {
        return this.prismaService.address.findFirst({
            where: {
                contact: {
                    username: 'test'
                }
            }
        });
    }

    async deleteAddress(): Promise<void> {
        await this.prismaService.address.deleteMany({
            where: {
                contact: {
                    username: 'test'
                }
            }
        });
    }
}