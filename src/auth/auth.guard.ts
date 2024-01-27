import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import config from 'utils/config';
import wrapper from 'utils/wrapper';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      wrapper.response(response, null, 'Unauthorized, token not found', 401);
      return false;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: config.jwt.secretKey,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      request['user'] = payload;
      return true;
    } catch {
      wrapper.response(response, null, 'Unauthorized, token not Sign', 401);
      return false;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
