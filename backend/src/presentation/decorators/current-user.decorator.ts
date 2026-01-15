import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { JwtUser } from '../../../shared/types/request-with-user';

interface RequestWithUser extends Request {
  user: JwtUser;
}

/**
 * Current User Decorator
 * Extracts the authenticated user from the request
 */
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtUser => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
