import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import OAuth2Server from 'oauth2-server';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/auth/types';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly oauth2Server: OAuth2Server,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    let request = context.switchToHttp().getRequest();
    let response = context.switchToHttp().getResponse();
    if (!request) {
      const gqlExecutionContext =
        GqlExecutionContext.create(context).getContext();
      request = gqlExecutionContext.req;
      response = gqlExecutionContext.res;
    }

    try {
      const token = await this.oauth2Server.authenticate(
        new OAuth2Server.Request(request),
        new OAuth2Server.Response(response),
      );

      request.user = token.user;
    } catch (e) {
      this.logger.error(e);
      throw new UnauthorizedException();
    }

    return true;
  }
}
