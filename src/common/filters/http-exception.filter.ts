import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global Exception Filter untuk sanitize error messages
 * Mencegah exposure internal details ke public endpoints
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An error occurred';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        error = responseObj.error || exception.name;
      } else {
        message = exception.message;
        error = exception.name;
      }
    } else if (exception instanceof Error) {
      // Log internal errors but don't expose details
      this.logger.error(
        `Internal Server Error: ${exception.message}`,
        exception.stack,
        `${request.method} ${request.url}`,
      );
      message = 'An internal error occurred';
      error = 'Internal Server Error';
    }

    // Sanitize error messages untuk production
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      // Generic error messages untuk production
      if (status >= 500) {
        message = 'An internal server error occurred';
        error = 'Internal Server Error';
      } else if (status === 404) {
        message = 'Resource not found';
      } else if (status === 401) {
        message = 'Unauthorized';
      } else if (status === 403) {
        message = 'Forbidden';
      }
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: Array.isArray(message) ? message : [message],
      error,
      // Only include stack trace in development
      ...(process.env.NODE_ENV !== 'production' && exception instanceof Error
        ? { stack: exception.stack }
        : {}),
    };

    // Log error untuk monitoring
    if (status >= 500) {
      this.logger.error(
        `HTTP ${status} Error: ${message}`,
        JSON.stringify(errorResponse),
      );
    } else if (status >= 400) {
      this.logger.warn(
        `HTTP ${status} Error: ${message}`,
        JSON.stringify(errorResponse),
      );
    }

    response.status(status).json(errorResponse);
  }
}













