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

});