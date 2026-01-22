import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiError, ApiResponse } from '../../shared';

/**
 * HTTP Exception Filter
 * Standardizes error responses across the application
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const { message, errors } = this.normalizeException(exceptionResponse);

    const body: ApiResponse<null> = {
      statusCode: status,
      success: false,
      message,
      errors,
    };

    response.status(status).json(body);
  }

  /**
   * Normalizes all possible forms of NestJS errors
   */
  private normalizeException(exceptionResponse: unknown): {
    message: string;
    errors?: ApiError[];
  } {
    // Case 1: simple string
    if (typeof exceptionResponse === 'string') {
      return { message: exceptionResponse };
    }

    // Case 2: standard NestJS object
    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const message = this.extractMessage(exceptionResponse);
      const errors = this.extractErrors(exceptionResponse);

      return { message, errors };
    }

    // Fallback
    return { message: 'Unexpected error occurred' };
  }

  private extractMessage(response: unknown): string {
    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      const msg = (response as { message: unknown }).message;

      if (Array.isArray(msg)) {
        return 'Validation failed';
      }

      if (typeof msg === 'string') {
        return msg;
      }
    }

    return 'Error';
  }

  private extractErrors(response: unknown): ApiError[] | undefined {
    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      const msg = (response as { message: unknown }).message;

      // ValidationPipe errors (array)
      if (Array.isArray(msg)) {
        return msg.map((m) => ({
          message: String(m),
        }));
      }
    }

    return undefined;
  }
}
