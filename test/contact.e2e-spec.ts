import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

// npm run test:e2e -- test/contact.e2e-spec.ts
describe('ContactController (e2e)', () => {
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

    describe('POST /api/contacts', () => {
        beforeEach(async () => {
            await testService.deleteContact();
            await testService.deleteUser();
            await testService.createUser();
        });

        it('should be rejected if request is invalid', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/contacts')
                .set('Authorization', 'test')
                .send({
                    first_name: '',
                    last_name: '',
                    email: 'wrong',
                    phone: '',
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to create contact', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/contacts')
                .set('Authorization', 'test')
                .send({
                    first_name: 'test',
                    last_name: 'test',
                    email: 'test@example.com',
                    phone: '9999',
                });

            expect(response.status).toBe(201);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.first_name).toBe('test');
            expect(response.body.data.last_name).toBe('test');
            expect(response.body.data.email).toBe('test@example.com');
            expect(response.body.data.phone).toBe('9999');
        });
    });

    describe('GET /api/contacts/:contactId', () => {
        beforeEach(async () => {
            await testService.deleteContact();
            await testService.deleteUser();
            await testService.createUser();
            await testService.createContact();
        });

        it('should be rejected if contact is not found', async () => {
            const contact = await testService.getContact();
            const response = await request(app.getHttpServer())
                .get(`/api/contacts/${contact!.id + 1}`)
                .set('Authorization', 'test');

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to find contact', async () => {
            const contact = await testService.getContact();

            const response = await request(app.getHttpServer())
                .get(`/api/contacts/${contact!.id}`)
                .set('Authorization', 'test');

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.first_name).toBe('test');
            expect(response.body.data.last_name).toBe('test');
            expect(response.body.data.email).toBe('test@example.com');
            expect(response.body.data.phone).toBe('9999');
        });
    });

    describe('PUT /api/contacts/:contactId', () => {
        beforeEach(async () => {
            await testService.deleteContact();
            await testService.deleteUser();
            await testService.createUser();
            await testService.createContact();
        });

        it('should be rejected if request is invalid', async () => {
            const contact = await testService.getContact();
            const response = await request(app.getHttpServer())
                .put(`/api/contacts/${contact!.id}`)
                .set('Authorization', 'test')
                .send({
                    first_name: '',
                    last_name: '',
                    email: 'wrong',
                    phone: '',
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be rejected if contact is not found', async () => {
            const contact = await testService.getContact();

            const response = await request(app.getHttpServer())
                .put(`/api/contacts/${contact!.id + 1}`)
                .set('Authorization', 'test')
                .send({
                    first_name: 'test updated',
                    last_name: 'test updated',
                    email: 'testupdated@example.com',
                    phone: '8888',
                });

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to create contact', async () => {
            const contact = await testService.getContact();

            const response = await request(app.getHttpServer())
                .put(`/api/contacts/${contact!.id}`)
                .set('Authorization', 'test')
                .send({
                    first_name: 'test updated',
                    last_name: 'test updated',
                    email: 'testupdated@example.com',
                    phone: '8888',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.first_name).toBe('test updated');
            expect(response.body.data.last_name).toBe('test updated');
            expect(response.body.data.email).toBe('testupdated@example.com');
            expect(response.body.data.phone).toBe('8888');
        });
    });

    describe('DELETE /api/contacts/:contactId', () => {
        beforeEach(async () => {
            await testService.deleteContact();
            await testService.deleteUser();
            await testService.createUser();
            await testService.createContact();
        });

        it('should be rejected if contact is not found', async () => {
            const contact = await testService.getContact();

            const response = await request(app.getHttpServer())
                .delete(`/api/contacts/${contact!.id + 1}`)
                .set('Authorization', 'test');

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to remove contact', async () => {
            const contact = await testService.getContact();

            const response = await request(app.getHttpServer())
                .delete(`/api/contacts/${contact!.id}`)
                .set('Authorization', 'test');

            expect(response.status).toBe(200);
            expect(response.body.data).toBe(true);
        });
    });

    describe('GET /api/contacts', () => {
        beforeEach(async () => {
            await testService.deleteContact();
            await testService.deleteUser();
            await testService.createUser();
            await testService.createContact();
        });

        it('should be able to search contacts', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/contacts')
                .set('Authorization', 'test');

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(1);
        });

        it('should be able to search contacts by name', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/contacts')
                .set('Authorization', 'test')
                .query({
                    name: 'st',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(1);
        });

        it('should be return nothing if search contacts by name and contact with this name is not found', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/contacts')
                .set('Authorization', 'test')
                .query({
                    name: 'wrong',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(0);
        });

        it('should be able to search contacts by email', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/contacts')
                .set('Authorization', 'test')
                .query({
                    email: 'exa',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(1);
        });

        it('should be return nothing if search contacts by email and contact with this email is not found', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/contacts')
                .set('Authorization', 'test')
                .query({
                    email: 'wrong',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(0);
        });

        it('should be able to search contacts by phone', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/contacts')
                .query({
                    phone: '99',
                })
                .set('Authorization', 'test');

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(1);
        });

        it('should return nothing if search contacts by phone and contact with this phone is not found', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/contacts')
                .query({
                    phone: 'wrong',
                })
                .set('Authorization', 'test');

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(0);
        });

        it('should be able to search contacts with page', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/contacts')
                .query({
                    per_page: 1,
                    page: 2,
                })
                .set('Authorization', 'test');

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(0);
            expect(response.body.paging.current_page).toBe(2);
            expect(response.body.paging.total_page).toBe(1);
            expect(response.body.paging.per_page).toBe(1);
        });
    });
});