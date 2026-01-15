import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import type { Response } from 'express';

type PaginatedResult<T> = {
  data: T;
  meta: ApiResponse<T>['meta'];
};

function isPaginatedResult<T>(value: unknown): value is PaginatedResult<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'meta' in value
  );
}

/**
 * API Response Interceptor
 * Standardizes successful responses across the application
 */
@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((result: unknown): ApiResponse<T> => {
        const statusCode = response.statusCode;
        if (isPaginatedResult<T>(result)) {
          return {
            statusCode: statusCode,
            success: true,
            data: result.data,
            meta: result.meta,
          };
        }

        return {
          statusCode: statusCode,
          success: true,
          data: result as T,
        };
      }),
    );
  }
}
