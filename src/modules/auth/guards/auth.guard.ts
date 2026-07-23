import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/shared/decorators';
import { IAuthRepository } from '../domain/repositories/iauth.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token)
      throw new UnauthorizedException({
        errorCode: 'TOKEN_NOT_PROVIDED',
        message: `Token is not provided`,
      });

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const auth = await this.authRepository.findById(payload.authId);

      if (!auth)
        throw new NotFoundException({
          errorCode: 'AUTH_NOT_FOUNDED',
          message: 'Auth is not founded',
        });

      if (auth.expiresAt <= new Date())
        throw new UnauthorizedException({
          errorCode: 'INVALID_TOKEN',
          message: 'Invalid or expired token',
        });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException({
        errorCode: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
