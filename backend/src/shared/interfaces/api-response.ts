import { ApiError } from './api-error';
import { PaginationMeta } from './pagination-meta';

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: ApiError[];
}
