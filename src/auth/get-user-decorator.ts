import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Auth } from './auth.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): Auth => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
