import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

// npm run test:e2e -- test/user.e2e-spec.ts
describe('UserController (e2e)', () => {
    let app: INestApplication<App>;
    let testService: TestService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, TestModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        testService = app.get(TestService);
        await testService.deleteContact();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /api/users', () => {
        beforeEach(async () => {
            await testService.deleteUser();
        });

        it('should be rejected if request is invalid', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/users')
                .send({
                    username: '',
                    password: '',
                    name: '',
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to register', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/users')
                .send({
                    username: 'test',
                    password: 'test',
                    name: 'test',
                });

            expect(response.status).toBe(201);
            expect(response.body.data.username).toBe('test');
            expect(response.body.data.name).toBe('test');
        });

        it('should be rejected if username already exists', async () => {
            await testService.createUser();

            const response = await request(app.getHttpServer())
                .post('/api/users')
                .send({
                    username: 'test',
                    password: 'test',
                    name: 'test',
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('POST /api/users/login', () => {
        beforeEach(async () => {
            await testService.deleteUser();
            await testService.createUser();
        });

        it('should be rejected if request is invalid', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/users/login')
                .send({
                    username: '',
                    password: '',
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to login', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/users/login')
                .send({
                    username: 'test',
                    password: 'test',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.username).toBe('test');
            expect(response.body.data.name).toBe('test');
            expect(response.body.data.token).toBeDefined();
        });
    });

    describe('GET /api/users/current', () => {
        beforeEach(async () => {
            await testService.deleteUser();
            await testService.createUser();
        });

        it('should be rejected if token is invalid', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/users/current')
                .set('Authorization', 'wrong');

            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to get user', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/users/current')
                .set('Authorization', 'test');

            expect(response.status).toBe(200);
            expect(response.body.data.username).toBe('test');
            expect(response.body.data.name).toBe('test');
        });
    });

    describe('PATCH /api/users/current', () => {
        beforeEach(async () => {
            await testService.deleteUser();
            await testService.createUser();
        });

        it('should be rejected if request is invalid', async () => {
            const response = await request(app.getHttpServer())
                .patch('/api/users/current')
                .set('Authorization', 'test')
                .send({
                    username: '',
                    name: '',
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to update name', async () => {
            const response = await request(app.getHttpServer())
                .patch('/api/users/current')
                .set('Authorization', 'test')
                .send({
                    name: 'test updated',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.username).toBe('test');
            expect(response.body.data.name).toBe('test updated');
        });

        it('should be able to update password', async () => {
            let response = await request(app.getHttpServer())
                .patch('/api/users/current')
                .set('Authorization', 'test')
                .send({
                    password: 'updated',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('test');
            expect(response.body.data.username).toBe('test');

            response = await request(app.getHttpServer())
                .post('/api/users/login')
                .send({
                    username: 'test',
                    password: 'updated',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.token).toBeDefined();
        });
    });

    describe('DELETE /api/users/current', () => {
        beforeEach(async () => {
            await testService.deleteUser();
            await testService.createUser();
        });

        it('should be rejected if token is invalid', async () => {
            const response = await request(app.getHttpServer())
                .delete('/api/users/current')
                .set('Authorization', 'wrong');

            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to logout user', async () => {
            const response = await request(app.getHttpServer())
                .delete('/api/users/current')
                .set('Authorization', 'test');

            expect(response.status).toBe(200);
            expect(response.body.data).toBe(true);
        });
    });
});