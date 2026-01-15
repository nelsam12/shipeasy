import { ApiError } from './api-error.interface';
import { PaginationMeta } from './pagination-meta.interface';

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: ApiError[];
}
