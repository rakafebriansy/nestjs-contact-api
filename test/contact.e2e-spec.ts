import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

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
        await testService.deleteUser();
        await testService.createUser();
    });
    
    afterAll(async () => {
        await testService.deleteContact();
        await app.close();
    });

    describe('POST /api/contacts', () => {
        beforeEach(async () => {
            await testService.deleteContact();
        });

        it('should be rejected if request is invalid', async () => {
            const response = await request(app.getHttpServer())
            .post('/api/contacts')
            .set('Authorization','test')
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
            .set('Authorization','test')
            .send({
                first_name: 'test',
                last_name: 'test',
                email: 'test@example.com',
                phone: '081245352617',
            });

            expect(response.status).toBe(201);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.first_name).toBe('test');
            expect(response.body.data.last_name).toBe('test');
            expect(response.body.data.email).toBe('test@example.com');
            expect(response.body.data.phone).toBe('081245352617');
        });
    });
});