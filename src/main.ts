import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger: LoggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.use(logger);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
