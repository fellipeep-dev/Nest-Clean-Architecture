import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppError } from '@errors';
import { Request, Response } from 'express';
import { Prisma } from 'src/infra/database/prisma/generated/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'Unespected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;

      message = res.message || exception.message;
      errorCode = res.error || exception.name;
    }

    if (exception instanceof AppError) {
      status = exception.status;
      errorCode = exception.errorCode;
      message = exception.message;
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.BAD_REQUEST;
          errorCode = 'UNIQUE_CONSTRAINT_VIOLATION';
          message = `Unique constraint failed: ${exception.meta?.target}`;
          break;

        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          errorCode = 'RECORD_NOT_FOUND';
          message = 'Record not found';
          break;

        default:
          errorCode = exception.code || 'PRISMA_ERROR';
      }
    }

    response.status(status).json({
      statusCode: status,
      errorCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
