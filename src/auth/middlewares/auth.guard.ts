import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}
  async use(
    request: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { authorization }: { authorization?: string } = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Please provide token');
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      const resp = await this.authService.validateToken(authToken);
      const user: User = await this.userService.findById(resp.userId);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      request['user'] = user;

      return next();
    } catch (error) {
      throw new ForbiddenException(
        error.message || 'session expired! Please sign In'
      );
    }
  }
}
