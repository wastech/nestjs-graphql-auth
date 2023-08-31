import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { Request } from 'express';
import { Reflector } from '@nestjs/core'; // Import Reflector
import { jwtConstants } from '../constants';
import { UserService } from '../user.service';

@Injectable()
export class JwtAuthGuard extends NestAuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {
    super(); // Call the parent constructor
  }

  async canActivate(context: GqlExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request: Request = ctx.getContext().req;

    const token = this.extractTokenFromHeader(request);
   // console.log('Token:', token);

    if (!token) {
      throw new UnauthorizedException('Token not found.');
    }

    try {
      const payload: any = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // Populate request.user with authenticated user data
      request['user'] = await this.userService.findById(payload.sub);
    } catch (error) {
      throw new UnauthorizedException('Invalid token.');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.substring('Bearer '.length);
      return token;
    }
    return undefined;
  }
}
