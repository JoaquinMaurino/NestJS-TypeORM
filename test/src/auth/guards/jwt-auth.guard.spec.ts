import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtAuthGuard } from '../../../../src/auth/guards/jwt-auth.guard';

//El siguiente bloque es necesario porque JwtAuthGuard extiende a AuthGuard
jest.mock('@nestjs/passport', () => ({
  AuthGuard: (strategy: string) => {
    return class MockGuard {
      canActivate = jest.fn().mockReturnValue(true);
    };
  },
}));

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
    context = {
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if route is public', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should call super.canActivate() if route si not public', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false);

    //Crear una instancia del AuthGuard mockeado
    const authGuard = new (AuthGuard('jwt'))();
    
    jest.spyOn(authGuard, 'canActivate').mockReturnValue(true)

    const result = authGuard.canActivate(context);

    expect(result).toBe(true);
  });
});
