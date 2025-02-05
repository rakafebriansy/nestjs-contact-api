import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('UserController (e2e)', () => {
    let app: INestApplication<App>;
    let testService: TestService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, TestModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        testService = app.get(TestService);
    });

    describe('POST /api/users', () => {
        beforeEach(async () => {
            await testService.deleteUser();
        });

        it('should be rejected if request is invalid', async () => {
            const response = await request(app.getHttpServer()).post('/api/users').send({
                username: '',
                password: '',
                name: '',
            });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to register', async () => {
            const response = await request(app.getHttpServer()).post('/api/users').send({
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
            
            const response = await request(app.getHttpServer()).post('/api/users').send({
                username: 'test',
                password: 'test',
                name: 'test',
            });
    
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });
    });
});
