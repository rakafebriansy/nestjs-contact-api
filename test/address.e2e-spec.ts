import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

// npm run test:e2e -- test/address.e2e-spec.ts
describe('AddressController (e2e)', () => {
    let app: INestApplication<App>;
    let testService: TestService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, TestModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        testService = app.get(TestService);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /api/contacts/:contactId/addresses', () => {
        beforeEach(async () => {
            await testService.deleteAddress();
            await testService.deleteContact();
            await testService.deleteUser();

            await testService.createUser();
            await testService.createContact();
        });

        it('should be rejected if request is invalid', async () => {
            const contact = await testService.getContact();

            const response = await request(app.getHttpServer())
                .post(`/api/contacts/${contact!.id}/addresses`)
                .set('Authorization', 'test')
                .send({
                    street: '',
                    city: '',
                    province: '',
                    country: '',
                    postal_code: '',
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to create address', async () => {
            const contact = await testService.getContact();

            const response = await request(app.getHttpServer())
                .post(`/api/contacts/${contact!.id}/addresses`)
                .set('Authorization', 'test')
                .send({
                    street: 'test street',
                    city: 'test city',
                    province: 'test province',
                    country: 'test country',
                    postal_code: '1111',
                });

            expect(response.status).toBe(201);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.street).toBe('test street');
            expect(response.body.data.city).toBe('test city');
            expect(response.body.data.province).toBe('test province');
            expect(response.body.data.country).toBe('test country');
            expect(response.body.data.postal_code).toBe('1111');
        });
    });

    describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
        beforeEach(async () => {
            await testService.deleteAddress();
            await testService.deleteContact();
            await testService.deleteUser();

            await testService.createUser();
            await testService.createContact();
            await testService.createAddress();
        });

        it('should be rejected if address is not found', async () => {
            const contact = await testService.getContact();
            const address = await testService.getAddress();

            const response = await request(app.getHttpServer())
                .get(`/api/contacts/${contact!.id}/addresses/${address!.id + 1}`)
                .set('Authorization', 'test');

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to get address', async () => {
            const contact = await testService.getContact();
            const address = await testService.getAddress();

            const response = await request(app.getHttpServer())
                .get(`/api/contacts/${contact!.id}/addresses/${address!.id}`)
                .set('Authorization', 'test');

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.street).toBe('test street');
            expect(response.body.data.city).toBe('test city');
            expect(response.body.data.province).toBe('test province');
            expect(response.body.data.country).toBe('test country');
            expect(response.body.data.postal_code).toBe('1111');
        });
    });

    describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
        beforeEach(async () => {
            await testService.deleteAddress();
            await testService.deleteContact();
            await testService.deleteUser();

            await testService.createUser();
            await testService.createContact();
            await testService.createAddress();
        });

        it('should be rejected if request is invalid', async () => {
            const contact = await testService.getContact();
            const address = await testService.getAddress();

            const response = await request(app.getHttpServer())
                .put(`/api/contacts/${contact!.id}/addresses/${address!.id}`)
                .set('Authorization', 'test')
                .send({
                    street: '',
                    city: '',
                    province: '',
                    country: '',
                    postal_code: '',
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be rejected if contact is not found', async () => {
            const contact = await testService.getContact();
            const address = await testService.getAddress();

            const response = await request(app.getHttpServer())
                .put(`/api/contacts/${contact!.id + 1}/addresses/${address!.id}`)
                .set('Authorization', 'test')
                .send({
                    street: 'update street',
                    city: 'update city',
                    province: 'update province',
                    country: 'update country',
                    postal_code: '2222',
                });

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be rejected if address is not found', async () => {
            const contact = await testService.getContact();
            const address = await testService.getAddress();

            const response = await request(app.getHttpServer())
                .put(`/api/contacts/${contact!.id}/addresses/${address!.id+ + 1}`)
                .set('Authorization', 'test')
                .send({
                    street: 'update street',
                    city: 'update city',
                    province: 'update province',
                    country: 'update country',
                    postal_code: '2222',
                });

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to update address', async () => {
            const contact = await testService.getContact();
            const address = await testService.getAddress();

            const response = await request(app.getHttpServer())
                .put(`/api/contacts/${contact!.id}/addresses/${address!.id}`)
                .set('Authorization', 'test')
                .send({
                    street: 'update street',
                    city: 'update city',
                    province: 'update province',
                    country: 'update country',
                    postal_code: '2222',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.street).toBe('update street');
            expect(response.body.data.city).toBe('update city');
            expect(response.body.data.province).toBe('update province');
            expect(response.body.data.country).toBe('update country');
            expect(response.body.data.postal_code).toBe('2222');
        });
    });
});