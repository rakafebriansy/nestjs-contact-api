import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { Contact } from "@prisma/client";

@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) { }

    async deleteUser() {
        await this.prismaService.user.deleteMany({
            where: {
                username: 'test'
            }
        });
    }

    async createUser() {
        await this.prismaService.user.create({
            data: {
                username: 'test',
                name: 'test',
                password: await bcrypt.hash('test', 10),
                token: 'test',
            }
        });
    }
    
    async createContact() {
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

    async deleteContact() {
        await this.prismaService.contact.deleteMany({
            where: {
                username: 'test'
            }
        });
    }

    async getContact(): Promise<Contact|null> {
        return await this.prismaService.contact.findFirst({
            where: {
                username: 'test'
            }
        });
    }
}