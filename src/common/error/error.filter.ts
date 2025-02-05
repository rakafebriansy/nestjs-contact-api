import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter<T> implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,

  ) { }

  catch(exception: T, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      this.logger.error(`Http Exception Error: ${exception.getResponse()}`);
      response.status(exception.getStatus()).json({
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      this.logger.error(`Validation Error: ${exception.message}`);
      response.status(400).json({
        errors: 'Validation Error',
      });
    } else {
      this.logger.error(`Internal Server Error: ${exception}`);
      response.status(500).json({
        errors: 'Internal Server Error',
      });

    }
  }
}
