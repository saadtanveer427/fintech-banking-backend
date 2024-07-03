import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from './enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token;
    if (request.headers?.authorization && request.headers?.authorization?.startsWith('Bearer')) {
      token = request.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return false;
    }
    try {
      const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
      request.user = decoded;
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }
}
